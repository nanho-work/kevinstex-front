import { companyAuth } from "@/service/company/auth";
import type {
  WorkChatAttachmentUrlOut,
  WorkChatBootstrapResponse,
  WorkChatListRoomsQuery,
  WorkChatMessage,
  WorkChatMessageListResponse,
  WorkChatMessageSearchResponse,
  WorkChatReadCursor,
  WorkChatRoomPreferenceUpdateRequest,
  WorkChatRoom,
  WorkChatRoomListResponse,
} from "@/types/workChat";

export class WorkChatApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "WorkChatApiError";
    this.status = status;
  }
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");
}

function getWsBaseUrl() {
  const base = getBaseUrl();
  return base.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://");
}

function buildAuthHeader(): Record<string, string> {
  const token = companyAuth.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseErrorMessage(res: Response): Promise<string> {
  const fallback = `요청 실패 (HTTP ${res.status})`;
  try {
    const data = await res.json();
    if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
    return fallback;
  } catch {
    return fallback;
  }
}

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeader(),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    if (res.status === 401) companyAuth.clearToken();
    throw new WorkChatApiError(res.status, await parseErrorMessage(res));
  }
  return (await res.json()) as T;
}

async function requestForm<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      ...buildAuthHeader(),
    },
    body: form,
  });
  if (!res.ok) {
    if (res.status === 401) companyAuth.clearToken();
    throw new WorkChatApiError(res.status, await parseErrorMessage(res));
  }
  return (await res.json()) as T;
}

function normalizeRoom(raw: any): WorkChatRoom {
  const membersRaw = Array.isArray(raw?.members) ? raw.members : [];
  return {
    id: Number(raw?.id ?? raw?.room_id ?? 0),
    room_type: (raw?.room_type ?? "company_bridge") as WorkChatRoom["room_type"],
    client_id: raw?.client_id == null ? undefined : Number(raw.client_id),
    company_id: raw?.company_id == null ? null : Number(raw.company_id),
    name: raw?.name == null ? null : String(raw.name),
    display_name: raw?.display_name == null ? null : String(raw.display_name),
    is_active: raw?.is_active == null ? true : Boolean(raw.is_active),
    is_hidden: raw?.is_hidden == null ? false : Boolean(raw.is_hidden),
    is_muted: raw?.is_muted == null ? false : Boolean(raw.is_muted),
    muted_until: raw?.muted_until == null ? null : String(raw.muted_until),
    unread_count: Number(raw?.unread_count ?? 0),
    unread_count_display:
      typeof raw?.unread_count_display === "string"
        ? raw.unread_count_display
        : String(Number(raw?.unread_count ?? 0)),
    last_message_preview: raw?.last_message_preview == null ? null : String(raw.last_message_preview),
    last_message_id: raw?.last_message_id == null ? null : Number(raw.last_message_id),
    last_message_at: raw?.last_message_at == null ? null : String(raw.last_message_at),
    created_at: raw?.created_at == null ? undefined : String(raw.created_at),
    updated_at: raw?.updated_at == null ? undefined : String(raw.updated_at),
    members: membersRaw.map((m: any) => ({
      member_type: String(m?.member_type || "admin") as "admin" | "client_account" | "company_account",
      member_id: Number(m?.member_id ?? 0),
      name: m?.name == null ? null : String(m.name),
      profile_image_url: m?.profile_image_url == null ? null : String(m.profile_image_url),
      role: m?.role == null ? undefined : String(m.role),
      is_active: m?.is_active == null ? undefined : Boolean(m.is_active),
      joined_at: m?.joined_at == null ? undefined : String(m.joined_at),
      left_at: m?.left_at == null ? null : String(m.left_at),
    })),
  };
}

function normalizeMessage(raw: any): WorkChatMessage {
  const attachmentRaw = raw?.attachment;
  return {
    id: Number(raw?.id ?? raw?.message_id ?? 0),
    room_id: Number(raw?.room_id ?? 0),
    sender_type: (raw?.sender_type ?? "system") as WorkChatMessage["sender_type"],
    sender_id: raw?.sender_id == null ? null : Number(raw.sender_id),
    sender_name: raw?.sender_name == null ? null : String(raw.sender_name),
    message_type: (raw?.message_type ?? "text") as WorkChatMessage["message_type"],
    body: raw?.body == null ? null : String(raw.body),
    is_deleted: Boolean(raw?.is_deleted),
    created_at: String(raw?.created_at ?? ""),
    attachment:
      attachmentRaw && Number(attachmentRaw?.id ?? attachmentRaw?.attachment_id ?? 0) > 0
        ? {
            id: Number(attachmentRaw?.id ?? attachmentRaw?.attachment_id ?? 0),
            message_id: Number(attachmentRaw?.message_id ?? 0),
            file_name: String(attachmentRaw?.file_name ?? ""),
            content_type: attachmentRaw?.content_type == null ? null : String(attachmentRaw.content_type),
            file_size: Number(attachmentRaw?.file_size ?? 0),
            kind:
              attachmentRaw?.kind === "image" || attachmentRaw?.kind === "file"
                ? attachmentRaw.kind
                : null,
            is_expired: Boolean(attachmentRaw?.is_expired),
            expires_at: attachmentRaw?.expires_at == null ? null : String(attachmentRaw.expires_at),
          }
        : null,
  };
}

export function buildCompanyChatWsUrl(token: string) {
  return `${getWsBaseUrl()}/ws/company/chats?token=${encodeURIComponent(token)}`;
}

export const companyWorkChatApi = {
  async bootstrapRoom(): Promise<WorkChatBootstrapResponse> {
    const data = await requestJson<any>("/company/chats/rooms/bootstrap", { method: "POST" });
    return {
      created: Boolean(data?.created),
      room: normalizeRoom(data?.room ?? {}),
    };
  },

  async listRooms(query?: WorkChatListRoomsQuery): Promise<WorkChatRoomListResponse> {
    const params = new URLSearchParams();
    if (query?.room_type) params.set("room_type", query.room_type);
    if (query?.page) params.set("page", String(query.page));
    if (query?.size) params.set("size", String(query.size));
    if (typeof query?.include_hidden === "boolean") {
      params.set("include_hidden", String(query.include_hidden));
    }
    const qs = params.toString() ? `?${params.toString()}` : "";
    const data = await requestJson<any>(`/company/chats/rooms${qs}`);
    const itemsRaw = Array.isArray(data?.items) ? data.items : [];
    return {
      total: Number(data?.total ?? itemsRaw.length ?? 0),
      items: itemsRaw
        .map((r: any) => normalizeRoom(r))
        .filter((r: WorkChatRoom) => r.id > 0 && r.is_active !== false),
    };
  },

  async getRoom(roomId: number): Promise<WorkChatRoom> {
    const data = await requestJson<any>(`/company/chats/rooms/${roomId}`);
    return normalizeRoom(data);
  },

  async listMessages(
    roomId: number,
    params?: { before_message_id?: number | null; size?: number }
  ): Promise<WorkChatMessageListResponse> {
    const qs = new URLSearchParams();
    if (params?.before_message_id) qs.set("before_message_id", String(params.before_message_id));
    if (params?.size) qs.set("size", String(params.size));
    const queryString = qs.toString() ? `?${qs.toString()}` : "";
    const data = await requestJson<any>(`/company/chats/rooms/${roomId}/messages${queryString}`);
    const itemsRaw = Array.isArray(data?.items) ? data.items : [];
    return {
      total: Number(data?.total ?? itemsRaw.length ?? 0),
      size: Number(data?.size ?? itemsRaw.length ?? 0),
      has_more: Boolean(data?.has_more),
      next_before_message_id:
        data?.next_before_message_id == null ? null : Number(data.next_before_message_id),
      items: itemsRaw.map((m: any) => normalizeMessage(m)).filter((m: WorkChatMessage) => m.id > 0),
    };
  },

  async searchMessages(
    roomId: number,
    params: { q: string; page?: number; size?: number }
  ): Promise<WorkChatMessageSearchResponse> {
    const qs = new URLSearchParams();
    qs.set("q", params.q);
    qs.set("page", String(params.page ?? 1));
    qs.set("size", String(params.size ?? 20));
    const data = await requestJson<WorkChatMessageSearchResponse>(
      `/company/chats/rooms/${roomId}/messages/search?${qs.toString()}`
    );
    return data;
  },

  async sendMessage(roomId: number, body: string): Promise<WorkChatMessage> {
    const data = await requestJson<any>(`/company/chats/rooms/${roomId}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
    return normalizeMessage(data);
  },

  async uploadAttachment(roomId: number, file: File): Promise<WorkChatMessage> {
    const form = new FormData();
    form.append("file", file);
    const data = await requestForm<any>(`/company/chats/rooms/${roomId}/attachments`, form);
    return normalizeMessage(data?.message ?? data);
  },

  async markRead(roomId: number, lastReadMessageId?: number | null): Promise<void> {
    await requestJson(`/company/chats/rooms/${roomId}/read`, {
      method: "POST",
      body: JSON.stringify({ last_read_message_id: lastReadMessageId ?? undefined }),
    });
  },

  async leaveRoom(roomId: number): Promise<void> {
    await requestJson(`/company/chats/rooms/${roomId}/leave`, { method: "POST" });
  },

  async updateRoomPreference(
    roomId: number,
    payload: WorkChatRoomPreferenceUpdateRequest
  ): Promise<WorkChatRoom> {
    const data = await requestJson<any>(`/company/chats/rooms/${roomId}/preference`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return normalizeRoom(data);
  },

  async listReadCursors(roomId: number): Promise<WorkChatReadCursor[]> {
    const data = await requestJson<any>(`/company/chats/rooms/${roomId}/read-cursors`);
    const items = Array.isArray(data?.items) ? data.items : [];
    return items
      .map((row: any) => ({
        room_id: roomId,
        member_type: String(row?.member_type || "admin") as
          | "admin"
          | "client_account"
          | "company_account",
        member_id: Number(row?.member_id ?? 0),
        member_name: row?.member_name == null ? null : String(row.member_name),
        last_read_message_id:
          row?.last_read_message_id == null ? null : Number(row.last_read_message_id),
        read_at: row?.read_at == null ? null : String(row.read_at),
      }))
      .filter((row: WorkChatReadCursor) => row.member_id > 0);
  },

  async deleteMessage(messageId: number): Promise<void> {
    await requestJson(`/company/chats/messages/${messageId}`, {
      method: "DELETE",
    });
  },

  async getAttachmentPreviewUrl(attachmentId: number): Promise<WorkChatAttachmentUrlOut> {
    return requestJson<WorkChatAttachmentUrlOut>(
      `/company/chats/attachments/${attachmentId}/preview-url`
    );
  },

  async getAttachmentDownloadUrl(attachmentId: number): Promise<WorkChatAttachmentUrlOut> {
    return requestJson<WorkChatAttachmentUrlOut>(
      `/company/chats/attachments/${attachmentId}/download-url`
    );
  },
};
