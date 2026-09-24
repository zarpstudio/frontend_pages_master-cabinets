/**
 * build-cms-pacer: spacing of build-time CMS calls
 * ================================================
 * Runs on the Node built-in test runner (no test framework dependency):
 *
 *   pnpm test
 *
 * /blog/[slug] prerenders every published article at build time, one CMS
 * detail call each. The CMS allows 100 calls / 60 s per client IP and the
 * build shares that IP with the live site. These tests pin the pacer on a
 * fake clock: start times, queue order under concurrency, the per-window
 * bound, and pass-through of results and errors. Pass-through matters
 * because null -> 404 and throw -> 500 is the PR #11 getArticleBySlug
 * contract.
 */

import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { BUILD_CMS_CALL_INTERVAL_MS, createPacer } from "../build-cms-pacer.ts";

/** A fake clock whose sleep advances time instead of waiting. */
function fakeClock(start = 1_000_000) {
  let now = start;
  const starts: number[] = [];
  return {
    now: () => now,
    sleep: async (ms: number) => {
      now += ms;
    },
    starts,
    record<T>(value: T) {
      return async () => {
        starts.push(now);
        return value;
      };
    },
  };
}

describe("createPacer: spacing", () => {
  it("runs the first call immediately", async () => {
    const clock = fakeClock();
    const pace = createPacer(1500, clock.now, clock.sleep);

    await pace(clock.record("a"));

    assert.deepEqual(clock.starts, [1_000_000]);
  });

  it("starts back-to-back calls exactly one interval apart", async () => {
    const clock = fakeClock();
    const pace = createPacer(1500, clock.now, clock.sleep);

    for (const v of ["a", "b", "c", "d"]) await pace(clock.record(v));

    assert.deepEqual(clock.starts, [1_000_000, 1_001_500, 1_003_000, 1_004_500]);
  });

  it("does not wait when the caller is already slower than the interval", async () => {
    const clock = fakeClock();
    let slept = 0;
    const pace = createPacer(1500, clock.now, async (ms) => {
      slept += ms;
      await clock.sleep(ms);
    });

    await pace(clock.record("a"));
    await clock.sleep(5000);
    await pace(clock.record("b"));

    assert.equal(slept, 0);
    assert.deepEqual(clock.starts, [1_000_000, 1_005_000]);
  });

  it("gives concurrent callers distinct, ordered slots (no two calls share a slot)", async () => {
    // Real timers here: a fake sleep resolves too early to show the ordering.
    const starts: Array<[string, number]> = [];
    const t0 = Date.now();
    const pace = createPacer(40);

    await Promise.all(
      ["a", "b", "c", "d"].map((v) =>
        pace(async () => {
          starts.push([v, Date.now() - t0]);
        }),
      ),
    );

    assert.deepEqual(starts.map(([v]) => v), ["a", "b", "c", "d"]);
    for (let i = 1; i < starts.length; i++) {
      assert.ok(starts[i][1] - starts[i - 1][1] >= 35, `gap ${i} too short: ${JSON.stringify(starts)}`);
    }
  });
});

describe("createPacer: rate bound at the production interval", () => {
  it("starts at most 41 calls in any 60 s window, for 200 articles", async () => {
    const clock = fakeClock();
    const pace = createPacer(BUILD_CMS_CALL_INTERVAL_MS, clock.now, clock.sleep);

    for (let i = 0; i < 200; i++) await pace(clock.record(i));

    let peak = 0;
    for (let i = 0, j = 0; i < clock.starts.length; i++) {
      while (clock.starts[i] - clock.starts[j] > 60_000) j++;
      peak = Math.max(peak, i - j + 1);
    }
    assert.equal(peak, 41);
  });

  it("keeps the production interval at or above 1.5 s", () => {
    assert.ok(BUILD_CMS_CALL_INTERVAL_MS >= 1500);
  });
});

describe("createPacer: pass-through (PR #11 contract)", () => {
  it("resolves with the task's value, including null (the 404 answer)", async () => {
    const clock = fakeClock();
    const pace = createPacer(1500, clock.now, clock.sleep);

    assert.equal(await pace(async () => null), null);
    assert.deepEqual(await pace(async () => ({ id: "x" })), { id: "x" });
  });

  it("rejects with the task's own error (a CMS 429/5xx stays a throw, i.e. a 500)", async () => {
    const clock = fakeClock();
    const pace = createPacer(1500, clock.now, clock.sleep);
    const failure = new Error("Failed to fetch article: Too Many Requests");

    await assert.rejects(
      pace(async () => {
        throw failure;
      }),
      (error) => error === failure,
    );
  });

  it("keeps pacing after a failed call", async () => {
    const clock = fakeClock();
    const pace = createPacer(1500, clock.now, clock.sleep);

    await pace(async () => {
      clock.starts.push(clock.now());
      throw new Error("boom");
    }).catch(() => {});
    await pace(clock.record("next"));

    assert.deepEqual(clock.starts, [1_000_000, 1_001_500]);
  });
});
