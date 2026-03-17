export type WorkChatSenderType = "admin" | "client_account" | "company_account" | "system";
export type WorkChatMessageType = "text" | "system" | "file" | "image";
export type WorkChatAttachmentKind = "image" | "file";

export type WorkChatRoom = {
  id: number;
  room_type: "direct" | "group" | "company_bridge";
  name: string | null;
  display_name?: string | null;
  unread_count: number;
  unread_count_display: string;
  last_message_preview: string | null;
  last_message_id?: number | null;
  last_message_at: string | null;
};

export type WorkChatRoomListResponse = {
  total: number;
  items: WorkChatRoom[];
};

export type WorkChatBootstrapResponse = {
  created: boolean;
  room: WorkChatRoom;
};

export type WorkChatAttachment = {
  id: number;
  message_id: number;
  file_name: string;
  content_type?: string | null;
  file_size: number;
  kind?: WorkChatAttachmentKind | null;
  is_expired: boolean;
  expires_at?: string | null;
};

export type WorkChatMessage = {
  id: number;
  room_id: number;
  sender_type: WorkChatSenderType;
  sender_id: number | null;
  sender_name?: string | null;
  message_type: WorkChatMessageType;
  body: string | null;
  attachment?: WorkChatAttachment | null;
  is_deleted: boolean;
  created_at: string;
};

export type WorkChatMessageListResponse = {
  total: number;
  size: number;
  has_more: boolean;
  next_before_message_id: number | null;
  items: WorkChatMessage[];
};

export type WorkChatMessageSearchItem = {
  message_id: number;
  room_id: number;
  sender_type: WorkChatSenderType;
  sender_id: number | null;
  sender_name?: string | null;
  message_type: WorkChatMessageType;
  snippet: string;
  created_at: string;
};

export type WorkChatMessageSearchResponse = {
  total: number;
  page: number;
  size: number;
  items: WorkChatMessageSearchItem[];
};

export type WorkChatAttachmentUrlOut = {
  attachment_id: number;
  message_id: number;
  file_name: string;
  content_type?: string | null;
  file_size: number;
  is_expired: boolean;
  expires_at?: string | null;
  url?: string | null;
  expires_in?: number | null;
};

export type WorkChatListRoomsQuery = {
  room_type?: string;
  page?: number;
  size?: number;
};
