// 1️⃣ 로그인
export interface CompanyLoginRequest {
  login_id: string;
  password: string;
}

// 2️⃣ 세션
export interface CompanySession {
  account_id: number;
  company_id: number;
  company_name: string;
  registration_number: string;
  status: string;

  // 세무사(클라이언트) 정보 — /company/session 응답 확장 시 사용
  // (백엔드가 아직 미반영이면 undefined/null로 올 수 있으므로 optional)
  client_id?: number | null;
  client_company_name?: string | null;
  owner_name?: string | null;
  industry_type?: string | null;
  business_type?: string | null;
  postal_code?: string | null;
  address1?: string | null;
  address2?: string | null;
}

export interface CompanyLoginResponse {
  access_token: string;
  token_type: 'bearer';
}

export interface CompanyChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface CompanyChangePasswordResponse {
  message: string
}

// 2-1️⃣ 회사 문서(사업자등록증 등)
export interface CompanyDocumentType {
  id: number
  code: string
  name: string
  description?: string | null
  is_unique_per_company: boolean
  is_active: boolean
  created_at: string // datetime
  updated_at: string // datetime
}

export interface CompanyDocument {
  id: number
  company_id: number
  doc_type_id: number

  // 조인해서 내려줄 때(선택)
  doc_type_code?: string | null
  doc_type_name?: string | null

  file_key: string
  file_name: string
  content_type: string
  file_size: number
  is_active: boolean
  uploaded_at: string // datetime
  deleted_at?: string | null

  // 프라이빗 문서 미리보기 URL(선택)
  preview_url?: string | null
}

export interface CompanyDocumentListResponse {
  total: number
  items: CompanyDocument[]
}

export interface CompanyDocumentCurrent {
  company_id: number
  doc_type_id: number
  document_id: number
  updated_at: string // datetime
}

export interface CompanyDocumentUploadMeta {
  doc_type_code: string
}

export interface CompanyDocumentDeleteRequest {
  doc_type_code: string
}

export interface CompanyDocumentPreviewResponse {
  file_name: string
  preview_url: string
}

export interface CompanyDocumentDeleteResponse {
  message: string
}

// 3️⃣ 약관
export interface ConsentTerm {
  id: number;
  code: string;
  version: number;
  title: string;
  is_required: boolean;
  effective_from: string; // date → string
}

export interface ConsentAgreeRequest {
  term_ids: number[];
}

export interface CompanyConsent {
  term_id: number;
  agreed_at: string; // datetime → string
  ip?: string | null;
  user_agent?: string | null;
}

// 4️⃣ 사업소득자
export interface ContractorCreateRequest {
  name: string;
  rrn: string;
  birth_date?: string; // date
}

export interface Contractor {
  id: number;
  name: string;
  rrn_masked: string;
  birth_date?: string | null; // date
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ContractorUpdateRequest {
  name?: string;
  rrn?: string;
  birth_date?: string; // date
  status?: 'active' | 'inactive';
}

export interface ContractorListResponse {
  total: number;
  items: Contractor[];
}

// 5️⃣ 3.3% 지급내역
export interface Withholding33CreateRequest {
  contractor_id: number;
  target_month: string; // YYYY-MM
  pay_date: string; // date
  gross_pay: number;
}

export interface Withholding33 {
  id: number;
  contractor_id: number;
  target_month: string;
  pay_date: string;
  gross_pay: number;
  income_tax: number;
  local_tax: number;
  net_pay: number;
  review_status: 'draft' | 'reviewed' | 'filed' | 'rejected';
  reviewed_at?: string | null;
  reviewed_by_admin_id?: number | null;
  filed_at?: string | null;
  filed_by_admin_id?: number | null;
  review_note?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface Withholding33ListResponse {
  total: number;
  items: Withholding33[];
}

export interface Withholding33UpdateRequest {
  pay_date?: string; // date
  gross_pay?: number;
}

export interface Withholding33StatusUpdateRequest {
  review_status: 'reviewed' | 'rejected' | 'filed';
  review_note?: string;
}

// 6️⃣ 사업소득자(3.3%) 대상자 문서
export interface ContractorDocument {
  id: number;
  contractor_id: number;
  doc_type_id: number;

  doc_type_code?: string | null;
  doc_type_name?: string | null;

  file_key: string;
  file_name: string;
  content_type: string;
  file_size: number;
  is_active: boolean;
  uploaded_at: string;
  deleted_at?: string | null;
}

export interface ContractorDocumentListResponse {
  total: number;
  items: ContractorDocument[];
}

export interface ContractorDocumentUploadMeta {
  doc_type_code: string;
}

export interface ContractorDocumentPreviewResponse {
  file_name: string;
  preview_url: string;
}
