/**
 * Spacing between build-time CMS calls made by /blog/[slug].
 *
 * The CMS throttles every route handler separately (backend
 * shared/throttling/throttle-policy.ts):
 * - from the trusted Coolify egress IP, each site key has its own bucket of
 *   600 requests / 60 s;
 * - from any other IP (a local, CI or agent-host build) the default applies:
 *   100 requests / 60 s per client IP, shared by every tenant on that IP.
 *
 * 1.5 s caps the paced calls at 41 in any 60 s window, under half of the
 * smallest budget however many articles are published. Unpaced, prerendering
 * 77 articles fired 81 calls in about 3 s, and a blog past about 96 articles
 * would hit 429 on its own build requests off the trusted egress.
 *
 * The bound is global only because next.config.ts pins static generation
 * to one worker (`experimental.cpus: 1`). Each worker process has its own
 * pacer.
 */
export const BUILD_CMS_CALL_INTERVAL_MS = 1500;

type Clock = () => number;
type Sleep = (ms: number) => Promise<void>;

const realSleep: Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Returns `pace(task)`, which starts each task at least `intervalMs` after the
 * previous one started. Slots are reserved synchronously, so concurrent
 * callers queue in call order instead of racing for the same slot. The task's
 * result and rejection pass through untouched.
 */
export function createPacer(
  intervalMs: number,
  now: Clock = Date.now,
  sleep: Sleep = realSleep,
): <T>(task: () => Promise<T>) => Promise<T> {
  let nextSlot = Number.NEGATIVE_INFINITY;

  return async function pace<T>(task: () => Promise<T>): Promise<T> {
    const current = now();
    const slot = Math.max(current, nextSlot);
    nextSlot = slot + intervalMs;
    if (slot > current) await sleep(slot - current);
    return task();
  };
}
