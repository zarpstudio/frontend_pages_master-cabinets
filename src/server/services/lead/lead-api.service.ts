/**
 * Lead API Service
 * =================
 * Service for submitting leads to the backend API endpoint.
 * Uses Axios to POST lead data to the public lead submission endpoint.
 */

import axios, { type AxiosInstance } from "axios"
import type { SubmitPublicLeadDTO, PublicLeadApiResponse } from "@/types/lead.type"

export interface ILeadApiService {
  submitLead(data: SubmitPublicLeadDTO): Promise<PublicLeadApiResponse>
}

/**
 * Production Zarp API host. Used when ZARP_API_ENDPOINT_URL is absent so a
 * missing env var degrades to the real backend instead of an unroutable
 * placeholder domain.
 */
const DEFAULT_ZARP_API_BASE_URL = "https://api.zarpstudio.com"

/** Request timeout for lead submission, in milliseconds. */
const LEAD_REQUEST_TIMEOUT_MS = 10_000

export class LeadApiService implements ILeadApiService {
  private readonly client: AxiosInstance
  private readonly tenantKey: string

  constructor() {
    const apiUrl = process.env.ZARP_API_ENDPOINT_URL
    const tenantKey = process.env.NEXT_PUBLIC_TENANT_KEY

    if (!apiUrl) {
      console.warn(
        `ZARP_API_ENDPOINT_URL is not configured, falling back to ${DEFAULT_ZARP_API_BASE_URL}`
      )
    }

    if (!tenantKey) {
      console.warn(
        "NEXT_PUBLIC_TENANT_KEY is not configured — lead submission will be rejected with HTTP 401 by the backend tenant-key guard"
      )
    }

    this.tenantKey = tenantKey || ""
    this.client = axios.create({
      baseURL: apiUrl || DEFAULT_ZARP_API_BASE_URL,
      timeout: LEAD_REQUEST_TIMEOUT_MS,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  async submitLead(data: SubmitPublicLeadDTO): Promise<PublicLeadApiResponse> {
    try {
      const url = "/api/leads/submit"

      const response = await this.client.post<{ leadId: number }>(
        url,
        data,
        {
          headers: {
            "X-Tenant-Key": this.tenantKey,
          },
        }
      )

      return {
        success: true,
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500
        const message = error.response?.data?.message || error.message

        console.error("[LEAD_API_SERVICE] Error submitting lead:", {
          status,
          message,
          data: error.response?.data,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
        })

        return {
          success: false,
          error: message,
          status,
        }
      }

      console.error("[LEAD_API_SERVICE] Unexpected error:", error)

      return {
        success: false,
        error: "An unexpected error occurred",
        status: 500,
      }
    }
  }
}

// Default service instance
export const leadApiService = new LeadApiService()
