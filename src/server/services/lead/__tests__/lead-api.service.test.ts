/**
 * Lead API Service Tests
 * =======================
 * Tests for the LeadApiService that submits leads to backend API.
 *
 * Every assertion goes through a real `submitLead` call with the HTTP adapter
 * replaced, so the tests observe the request that would actually leave the
 * server (host, path, tenant header) rather than configuration internals.
 *
 * Run: pnpm dlx vitest@3.2.4 run (see vitest.config.mjs)
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios"
import { LeadApiService } from "../lead-api.service"
import type { SubmitPublicLeadDTO } from "@/types/lead.type"

/** Production Zarp API host; the POST /api/leads/submit route lives there. */
const PRODUCTION_API_HOST = "https://api.zarpstudio.com"

const LEAD: SubmitPublicLeadDTO = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+15555550123",
  source: "test-form",
}

interface CapturedRequest {
  url: string
  tenantKey: unknown
}

/**
 * Replaces the service's HTTP adapter and returns the URL and tenant header of
 * every request it would have sent.
 */
function interceptRequests(
  service: LeadApiService,
  respond: (config: InternalAxiosRequestConfig) => Promise<unknown>
): CapturedRequest[] {
  const captured: CapturedRequest[] = []
  const client = (service as unknown as { client: AxiosInstance }).client

  client.defaults.adapter = async (config) => {
    captured.push({
      url: axios.getUri(config),
      tenantKey: config.headers?.["X-Tenant-Key"],
    })
    return respond(config) as never
  }

  return captured
}

function okResponse(config: InternalAxiosRequestConfig) {
  return Promise.resolve({
    data: { leadId: 42 },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  })
}

describe("LeadApiService", () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.ZARP_API_ENDPOINT_URL = "https://leads.test.invalid"
    process.env.NEXT_PUBLIC_TENANT_KEY = "tenant-key-for-tests"
    vi.spyOn(console, "warn").mockImplementation(() => undefined)
    vi.spyOn(console, "error").mockImplementation(() => undefined)
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.restoreAllMocks()
  })

  describe("API host resolution", () => {
    it("sends leads to ZARP_API_ENDPOINT_URL when it is configured", async () => {
      const service = new LeadApiService()
      const requests = interceptRequests(service, okResponse)

      await service.submitLead(LEAD)

      expect(requests).toHaveLength(1)
      expect(requests[0].url).toBe("https://leads.test.invalid/api/leads/submit")
    })

    it("falls back to the production Zarp API when ZARP_API_ENDPOINT_URL is unset", async () => {
      delete process.env.ZARP_API_ENDPOINT_URL
      const service = new LeadApiService()
      const requests = interceptRequests(service, okResponse)

      await service.submitLead(LEAD)

      expect(requests[0].url).toBe(`${PRODUCTION_API_HOST}/api/leads/submit`)
    })

    it("treats an empty ZARP_API_ENDPOINT_URL as unset", async () => {
      process.env.ZARP_API_ENDPOINT_URL = ""
      const service = new LeadApiService()
      const requests = interceptRequests(service, okResponse)

      await service.submitLead(LEAD)

      expect(requests[0].url).toBe(`${PRODUCTION_API_HOST}/api/leads/submit`)
    })

    it("warns instead of throwing when ZARP_API_ENDPOINT_URL is unset", () => {
      delete process.env.ZARP_API_ENDPOINT_URL

      expect(() => new LeadApiService()).not.toThrow()
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("ZARP_API_ENDPOINT_URL is not configured")
      )
    })
  })

  describe("tenant key", () => {
    it("sends NEXT_PUBLIC_TENANT_KEY as the X-Tenant-Key header", async () => {
      const service = new LeadApiService()
      const requests = interceptRequests(service, okResponse)

      await service.submitLead(LEAD)

      expect(requests[0].tenantKey).toBe("tenant-key-for-tests")
    })

    it("warns instead of throwing when NEXT_PUBLIC_TENANT_KEY is unset", () => {
      delete process.env.NEXT_PUBLIC_TENANT_KEY

      expect(() => new LeadApiService()).not.toThrow()
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("NEXT_PUBLIC_TENANT_KEY is not configured")
      )
    })
  })

  describe("submitLead", () => {
    it("returns the lead id on success", async () => {
      const service = new LeadApiService()
      interceptRequests(service, okResponse)

      await expect(service.submitLead(LEAD)).resolves.toEqual({
        success: true,
        data: { leadId: 42 },
        status: 200,
      })
    })

    it("maps a backend rejection to a failure carrying its status and message", async () => {
      const service = new LeadApiService()
      interceptRequests(service, (config) =>
        Promise.reject(
          new axios.AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, {
            data: { message: "Invalid tenant key" },
            status: 401,
            statusText: "Unauthorized",
            headers: {},
            config,
          })
        )
      )

      await expect(service.submitLead(LEAD)).resolves.toEqual({
        success: false,
        error: "Invalid tenant key",
        status: 401,
      })
    })
  })
})
