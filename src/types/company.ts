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
  ip?: string;
  user_agent?: string;
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
  status: string;
  created_at: string;
  updated_at: string;
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
  review_status: string;
  reviewed_at?: string;
  filed_at?: string;
  created_at: string;
}

export interface Withholding33ListResponse {
  total: number;
  items: Withholding33[];
}