// src/service/company/companyService.ts

import {
  ContractorCreateRequest,
  ContractorUpdateRequest,
  Contractor,
  ContractorListResponse,
  Withholding33CreateRequest,
  Withholding33,
  Withholding33ListResponse,
  Withholding33StatusUpdateRequest,
  ContractorDocument,
  ContractorDocumentListResponse,
  ContractorDocumentPreviewResponse,
} from "@/types/company";
import { companyAuth } from "@/service/company/auth";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");
}

function authHeaders(): Record<string, string> {
  const token = companyAuth.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * -------------------------------------------------------
 * 공통 fetch 래퍼
 * -------------------------------------------------------
 */
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    if (res.status === 401) companyAuth.clearToken();
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "요청 처리 중 오류가 발생했습니다.");
  }

  return res.json();
}

/**
 * =======================================================
 * 1️⃣ 사업소득 대상자 (Contractor)
 * =======================================================
 */

// 목록 조회
export async function fetchContractors(): Promise<ContractorListResponse> {
  return request<ContractorListResponse>("/company/contractors");
}

// 생성
export async function createContractor(
  payload: ContractorCreateRequest
): Promise<Contractor> {
  return request<Contractor>("/company/contractors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 수정
export async function updateContractor(
  contractorId: number,
  payload: ContractorUpdateRequest
): Promise<Contractor> {
  return request<Contractor>(`/company/contractors/${contractorId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * =======================================================
 * 2️⃣ 3.3% 지급내역
 * =======================================================
 */

// 생성
export async function createWithholding33(
  payload: Withholding33CreateRequest
): Promise<Withholding33> {
  const body = JSON.stringify(
    Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
    )
  );

  return request<Withholding33>("/company/withholding33", {
    method: "POST",
    body,
  });
}

// 목록 조회 (target_month optional)
export async function fetchWithholding33List(
  targetMonth?: string | null
): Promise<Withholding33ListResponse> {
  const qs =
    targetMonth && targetMonth.trim().length > 0
      ? `?target_month=${encodeURIComponent(targetMonth)}`
      : "";
  return request<Withholding33ListResponse>(`/company/withholding33${qs}`);
}

// 단건 조회
export async function fetchWithholding33(
  paymentId: number
): Promise<Withholding33> {
  return request<Withholding33>(`/company/withholding33/${paymentId}`);
}

// 상태 변경
export async function updateWithholding33Status(
  paymentId: number,
  payload: Withholding33StatusUpdateRequest
): Promise<Withholding33> {
  return request<Withholding33>(`/company/withholding33/${paymentId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * =======================================================
 * 3️⃣ 대상자 문서
 * =======================================================
 */

// 문서 목록
export async function fetchContractorDocuments(
  contractorId: number
): Promise<ContractorDocumentListResponse> {
  return request<ContractorDocumentListResponse>(
    `/company/contractor-documents/${contractorId}`
  );
}

// 문서 업로드
export async function uploadContractorDocument(
  contractorId: number,
  docTypeCode: string,
  file: File
): Promise<ContractorDocument> {
  const baseUrl = getBaseUrl();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${baseUrl}/company/contractor-documents/${contractorId}/${encodeURIComponent(docTypeCode)}`,
    {
      method: "POST",
      body: formData,
      headers: {
        ...authHeaders(),
      },
    }
  );

  if (!res.ok) {
    if (res.status === 401) companyAuth.clearToken();
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "업로드 실패");
  }

  return (await res.json()) as ContractorDocument;
}

// 문서 미리보기
export async function previewContractorDocument(
  documentId: number
): Promise<ContractorDocumentPreviewResponse> {
  return request<ContractorDocumentPreviewResponse>(
    `/company/contractor-documents/preview/${documentId}`
  );
}

// 문서 삭제
export async function deleteContractorDocument(
  documentId: number
): Promise<{ message: string }> {
  return request<{ message: string }>(
    `/company/contractor-documents/${documentId}`,
    {
      method: "DELETE",
    }
  );
}
