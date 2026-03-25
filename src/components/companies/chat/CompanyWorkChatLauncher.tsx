"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Eye,
  MessageCircle,
  Paperclip,
  Search,
  SendHorizontal,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { companyLogout, companyAuth, getCompanySession } from "@/service/company/auth";
import {
  buildCompanyChatWsUrl,
  companyWorkChatApi,
  WorkChatApiError,
} from "@/service/company/workChatService";
import type {
  WorkChatAttachment,
  WorkChatMessage,
  WorkChatMessageSearchItem,
  WorkChatRoom,
} from "@/types/workChat";
import { useCompanySession } from "@/app/(protected)/companies/layout";

const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const FILE_MAX_BYTES = 20 * 1024 * 1024;
const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];
const ALLOWED_EXTS = [
  ".pdf", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp",
  ".xlsx", ".xls", ".csv", ".ppt", ".pptx", ".doc", ".docx",
  ".hwp", ".hwpx", ".whg", ".txt", ".zip",
];
const BLOCKED_EXTS = [".exe", ".dll", ".bat", ".cmd", ".sh", ".ps1", ".vbs", ".js", ".jar", ".scr", ".com"];
const WS_UNAUTHORIZED_CODES = new Set([4401, 4403, 403, 1008]);
const WS_PING_INTERVAL_MS = 30000;

function toLocalDateTime(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function toLocalTime(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
}

function bytesToLabel(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 1024) return `${Math.max(0, Math.floor(bytes || 0))}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function getExt(name: string) {
  const i = name.lastIndexOf(".");
  if (i < 0) return "";
  return name.slice(i).toLowerCase();
}

function isImageAttachment(att?: WorkChatAttachment | null) {
  if (!att) return false;
  if (att.kind === "image") return true;
  const contentType = String(att.content_type || "").toLowerCase();
  if (contentType.startsWith("image/")) return true;
  return IMAGE_EXTS.includes(getExt(att.file_name || ""));
}

function canPreview(att?: WorkChatAttachment | null) {
  if (!att) return false;
  const contentType = String(att.content_type || "").toLowerCase();
  const ext = getExt(att.file_name || "");
  if (contentType.startsWith("image/")) return true;
  if (contentType === "application/pdf" || ext === ".pdf") return true;
  if (contentType.startsWith("text/")) return true;
  return ext === ".txt";
}

function validateAttachment(file: File): string | null {
  const ext = getExt(file.name);
  if (!ext || !ALLOWED_EXTS.includes(ext)) return "허용되지 않은 파일 확장자입니다.";
  if (BLOCKED_EXTS.includes(ext)) return "보안상 업로드할 수 없는 파일입니다.";

  const byImage = IMAGE_EXTS.includes(ext) || file.type.startsWith("image/");
  const limit = byImage ? IMAGE_MAX_BYTES : FILE_MAX_BYTES;
  if (file.size > limit) {
    return byImage
      ? "이미지는 최대 10MB까지 업로드할 수 있습니다."
      : "일반 파일은 최대 20MB까지 업로드할 수 있습니다.";
  }
  return null;
}

function dedupeByMessageId(items: WorkChatMessage[]) {
  const map = new Map<number, WorkChatMessage>();
  items.forEach((item) => {
    if (item.id > 0) map.set(item.id, item);
  });
  return Array.from(map.values()).sort((a, b) => a.id - b.id);
}

function toUnreadCountDisplay(count: number) {
  if (!Number.isFinite(count) || count <= 0) return "0";
  return count > 300 ? "300+" : String(count);
}

function sortRoomsByRecentMessage(rows: WorkChatRoom[]) {
  return [...rows].sort((a, b) => {
    const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
    const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
    if (at !== bt) return bt - at;
    return b.id - a.id;
  });
}

function normalizeIncomingMessage(raw: any): WorkChatMessage | null {
  const msg = raw?.message ?? raw;
  const id = Number(msg?.id ?? msg?.message_id ?? 0);
  const roomId = Number(msg?.room_id ?? 0);
  if (id <= 0 || roomId <= 0) return null;

  const attachmentRaw = msg?.attachment;
  return {
    id,
    room_id: roomId,
    sender_type: String(msg?.sender_type ?? "system") as WorkChatMessage["sender_type"],
    sender_id: msg?.sender_id == null ? null : Number(msg.sender_id),
    sender_name: msg?.sender_name == null ? null : String(msg.sender_name),
    message_type: String(msg?.message_type ?? "text") as WorkChatMessage["message_type"],
    body: msg?.body == null ? null : String(msg.body),
    is_deleted: Boolean(msg?.is_deleted),
    created_at: String(msg?.created_at ?? ""),
    attachment:
      attachmentRaw && Number(attachmentRaw?.id ?? attachmentRaw?.attachment_id ?? 0) > 0
        ? {
            id: Number(attachmentRaw?.id ?? attachmentRaw?.attachment_id ?? 0),
            message_id: Number(attachmentRaw?.message_id ?? 0),
            file_name: String(attachmentRaw?.file_name ?? ""),
            content_type:
              attachmentRaw?.content_type == null ? null : String(attachmentRaw.content_type),
            file_size: Number(attachmentRaw?.file_size ?? 0),
            kind:
              attachmentRaw?.kind === "image" || attachmentRaw?.kind === "file"
                ? attachmentRaw.kind
                : null,
            is_expired: Boolean(attachmentRaw?.is_expired),
            expires_at:
              attachmentRaw?.expires_at == null ? null : String(attachmentRaw.expires_at),
          }
        : null,
  };
}

function normalizeWsRoomPatch(raw: any): (Partial<WorkChatRoom> & { id: number }) | null {
  const room = raw?.room ?? raw;
  const id = Number(room?.id ?? room?.room_id ?? 0);
  if (id <= 0) return null;
  const unreadCount = room?.unread_count == null ? undefined : Math.max(0, Number(room.unread_count));
  return {
    id,
    room_type: room?.room_type as WorkChatRoom["room_type"] | undefined,
    name: room?.name == null ? undefined : String(room.name),
    display_name: room?.display_name == null ? undefined : String(room.display_name),
    is_active: room?.is_active == null ? undefined : Boolean(room.is_active),
    is_hidden: room?.is_hidden == null ? undefined : Boolean(room.is_hidden),
    is_muted: room?.is_muted == null ? undefined : Boolean(room.is_muted),
    muted_until: room?.muted_until == null ? null : String(room.muted_until),
    unread_count: unreadCount,
    unread_count_display:
      unreadCount == null
        ? undefined
        : typeof room?.unread_count_display === "string"
          ? room.unread_count_display
          : toUnreadCountDisplay(unreadCount),
    last_message_id: room?.last_message_id == null ? undefined : Number(room.last_message_id),
    last_message_preview:
      room?.last_message_preview == null ? undefined : String(room.last_message_preview),
    last_message_at: room?.last_message_at == null ? undefined : String(room.last_message_at),
  };
}

function markText(text: string, q: string) {
  const keyword = q.trim();
  if (!keyword) return text;
  const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const r = new RegExp(`(${esc})`, "ig");
  const parts = text.split(r);
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={`${part}-${i}`} className="rounded bg-yellow-100 px-0.5 text-zinc-900">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${i}`}>{part}</span>
    )
  );
}

type ViewerState = {
  url: string;
  fileName: string;
  contentType?: string | null;
};

export default function CompanyWorkChatLauncher() {
  const router = useRouter();
  const session = useCompanySession();
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<WorkChatRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<WorkChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [nextBeforeMessageId, setNextBeforeMessageId] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchRows, setSearchRows] = useState<WorkChatMessageSearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState(-1);
  const [activeSearchMessageId, setActiveSearchMessageId] = useState<number | null>(null);
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const [viewerMode, setViewerMode] = useState<"fit" | "original">("fit");
  const [retryAuthTried, setRetryAuthTried] = useState(false);
  const [wsEpoch, setWsEpoch] = useState(0);
  const [typingLabel, setTypingLabel] = useState<string | null>(null);
  const [messageMenu, setMessageMenu] = useState<{ x: number; y: number; messageId: number } | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);

  const roomScrollRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const selectedRoomRef = useRef<number | null>(null);
  const wsConnectLockRef = useRef(false);
  const pendingSearchKeywordRef = useRef("");
  const reconnectRefreshPendingRef = useRef(false);
  const typingSentRef = useRef(false);
  const typingStopTimerRef = useRef<number | null>(null);
  const typingClearTimerRef = useRef<number | null>(null);

  const actorType = "company_account";
  const actorId = session?.account_id ?? 0;
  const taxOfficeName = session?.client_company_name || "세무사 사무소";
  const unreadTotal = useMemo(
    () => rooms.reduce((sum, room) => sum + Math.max(0, room.unread_count || 0), 0),
    [rooms]
  );

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) || null,
    [rooms, selectedRoomId]
  );

  const roomTitle = useMemo(() => {
    if (!selectedRoom) return "세무사 연결";
    const display = String(selectedRoom.display_name || selectedRoom.name || "").trim();
    return display || "세무사 연결";
  }, [selectedRoom]);

  const discardRoomFromCache = useCallback((roomId: number) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    if (selectedRoomRef.current === roomId) {
      setSelectedRoomId(null);
      setMessages([]);
    }
  }, []);

  const isRoomAccessError = useCallback(
    (error: unknown) => error instanceof WorkChatApiError && (error.status === 403 || error.status === 404),
    []
  );

  const loadRooms = useCallback(async () => {
    setRoomsLoading(true);
    try {
      const list = await companyWorkChatApi.listRooms({ page: 1, size: 50, include_hidden: false });
      const sorted = sortRoomsByRecentMessage(
        list.items.filter((row) => row.is_active !== false && !row.is_hidden)
      );
      setRooms(sorted);
      if (!selectedRoomRef.current && sorted.length > 0) {
        setSelectedRoomId(sorted[0].id);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "채팅방 목록 조회에 실패했습니다.";
      setErrorMessage(message);
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      await companyWorkChatApi.bootstrapRoom();
    } catch (e) {
      const message = e instanceof Error ? e.message : "채팅방 초기화에 실패했습니다.";
      setErrorMessage(message);
    }
  }, []);

  const loadMessages = useCallback(
    async (roomId: number, opts?: { beforeMessageId?: number | null; append?: boolean }) => {
      const append = Boolean(opts?.append);
      if (append) setLoadingMore(true);
      else setMessagesLoading(true);

      try {
        const res = await companyWorkChatApi.listMessages(roomId, {
          size: 50,
          before_message_id: opts?.beforeMessageId ?? null,
        });
        setNextBeforeMessageId(res.next_before_message_id ?? null);
        if (append) {
          setMessages((prev) => dedupeByMessageId([...res.items, ...prev]));
        } else {
          setMessages(dedupeByMessageId(res.items));
        }
      } catch (e) {
        if (isRoomAccessError(e)) {
          discardRoomFromCache(roomId);
          void loadRooms();
        }
        const message = e instanceof Error ? e.message : "메시지 조회에 실패했습니다.";
        setErrorMessage(message);
      } finally {
        if (append) setLoadingMore(false);
        else setMessagesLoading(false);
      }
    },
    [discardRoomFromCache, isRoomAccessError, loadRooms]
  );

  const handleUnauthorized = useCallback(async () => {
    if (retryAuthTried) {
      companyLogout();
      router.replace("/companies/login");
      return;
    }
    setRetryAuthTried(true);
    try {
      await getCompanySession();
      setWsEpoch((prev) => prev + 1);
    } catch {
      companyLogout();
      router.replace("/companies/login");
    }
  }, [retryAuthTried, router]);

  const ensureSearchMessageLoaded = useCallback(
    async (roomId: number, messageId: number) => {
      let local = messages;
      if (local.some((m) => m.id === messageId)) return;

      let before = nextBeforeMessageId;
      let guard = 0;
      while (before && guard < 20) {
        guard += 1;
        const res = await companyWorkChatApi.listMessages(roomId, {
          size: 50,
          before_message_id: before,
        });
        before = res.next_before_message_id ?? null;
        local = dedupeByMessageId([...res.items, ...local]);
        setMessages(local);
        setNextBeforeMessageId(before);
        if (local.some((m) => m.id === messageId)) return;
      }
    },
    [messages, nextBeforeMessageId]
  );

  const jumpToSearchResult = useCallback(
    async (index: number) => {
      if (!selectedRoomId || index < 0 || index >= searchRows.length) return;
      const row = searchRows[index];
      setSearchIndex(index);
      setActiveSearchMessageId(row.message_id);
      try {
        await ensureSearchMessageLoaded(selectedRoomId, row.message_id);
        setTimeout(() => {
          const el = document.getElementById(`chat-msg-${row.message_id}`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
      } catch {
        // keep quiet
      }
    },
    [ensureSearchMessageLoaded, searchRows, selectedRoomId]
  );

  const runRoomSearch = useCallback(async () => {
    const keyword = searchKeyword.trim();
    if (!selectedRoomId || keyword.length < 2) {
      setSearchRows([]);
      setSearchIndex(-1);
      setActiveSearchMessageId(null);
      return;
    }
    setSearchLoading(true);
    pendingSearchKeywordRef.current = keyword;
    try {
      const res = await companyWorkChatApi.searchMessages(selectedRoomId, {
        q: keyword,
        page: 1,
        size: 50,
      });
      if (pendingSearchKeywordRef.current !== keyword) return;
      setSearchRows(res.items || []);
      if ((res.items || []).length > 0) {
        void jumpToSearchResult(0);
      } else {
        setSearchIndex(-1);
        setActiveSearchMessageId(null);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "검색에 실패했습니다.";
      setErrorMessage(message);
    } finally {
      setSearchLoading(false);
    }
  }, [jumpToSearchResult, searchKeyword, selectedRoomId]);

  const sendWsEvent = useCallback((event: string, data: Record<string, unknown>) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ event, data }));
  }, []);

  const applyRoomPatch = useCallback((patch: (Partial<WorkChatRoom> & { id: number }) | null) => {
    if (!patch) return;
    if (patch.is_active === false || patch.is_hidden) {
      setRooms((prev) => prev.filter((room) => room.id !== patch.id));
      if (selectedRoomRef.current === patch.id) {
        setSelectedRoomId(null);
        setMessages([]);
      }
      return;
    }

    setRooms((prev) => {
      const next = [...prev];
      const idx = next.findIndex((room) => room.id === patch.id);
      if (idx >= 0) {
        const base = next[idx];
        const unread = patch.unread_count == null ? base.unread_count : patch.unread_count;
        next[idx] = {
          ...base,
          ...patch,
          unread_count: unread,
          unread_count_display: patch.unread_count_display || toUnreadCountDisplay(unread),
        };
      } else {
        const unread = Math.max(0, patch.unread_count ?? 0);
        next.push({
          id: patch.id,
          room_type: patch.room_type || "company_bridge",
          name: patch.name || null,
          display_name: patch.display_name || patch.name || "세무사 연결",
          unread_count: unread,
          unread_count_display: patch.unread_count_display || toUnreadCountDisplay(unread),
          last_message_preview: patch.last_message_preview || null,
          last_message_id: patch.last_message_id ?? null,
          last_message_at: patch.last_message_at || null,
          is_active: patch.is_active ?? true,
          is_hidden: Boolean(patch.is_hidden),
          is_muted: Boolean(patch.is_muted),
          muted_until: patch.muted_until || null,
        });
      }
      return sortRoomsByRecentMessage(next);
    });
  }, []);

  const markReadAndSync = useCallback(
    async (roomId: number, lastReadMessageId?: number | null) => {
      try {
        await companyWorkChatApi.markRead(roomId, lastReadMessageId ?? undefined);
        sendWsEvent("chat.read", {
          room_id: roomId,
          last_read_message_id: lastReadMessageId ?? undefined,
        });
      } catch {
        // noop
      } finally {
        setRooms((prev) =>
          prev.map((room) =>
            room.id === roomId
              ? { ...room, unread_count: 0, unread_count_display: "0" }
              : room
          )
        );
      }
    },
    [sendWsEvent]
  );

  useEffect(() => {
    selectedRoomRef.current = selectedRoomId;
  }, [selectedRoomId]);

  useEffect(() => {
    if (!open) return;
    setErrorMessage(null);
    setRetryAuthTried(false);
    void bootstrap().then(() => loadRooms());
  }, [bootstrap, loadRooms, open]);

  useEffect(() => {
    if (!open || !selectedRoomId) return;
    setSearchRows([]);
    setSearchIndex(-1);
    setActiveSearchMessageId(null);
    setTypingLabel(null);
    void loadMessages(selectedRoomId);
    sendWsEvent("chat.enter_room", { room_id: selectedRoomId });
    sendWsEvent("chat.subscribe", { room_id: selectedRoomId });
    void markReadAndSync(selectedRoomId);
  }, [loadMessages, markReadAndSync, open, selectedRoomId, sendWsEvent]);

  useEffect(() => {
    if (!open) {
      wsRef.current?.close();
      wsRef.current = null;
      wsConnectLockRef.current = false;
      return;
    }
    if (wsConnectLockRef.current) return;
    const token = companyAuth.getToken();
    if (!token) return;
    const wsUrl = buildCompanyChatWsUrl(token);
    if (!wsUrl) return;

    wsConnectLockRef.current = true;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      wsConnectLockRef.current = false;
      reconnectRefreshPendingRef.current = true;
      void loadRooms();
      if (selectedRoomRef.current) {
        sendWsEvent("chat.subscribe", { room_id: selectedRoomRef.current });
        sendWsEvent("chat.enter_room", { room_id: selectedRoomRef.current });
      }
    };

    ws.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        const eventName = String(payload?.event || payload?.type || "");
        const data = payload?.data ?? payload;

        if (eventName === "chat.ws.ready") {
          if (reconnectRefreshPendingRef.current) {
            reconnectRefreshPendingRef.current = false;
            void loadRooms();
          }
          return;
        }

        if (eventName === "chat.error") {
          const message =
            typeof data?.message === "string" && data.message.trim()
              ? data.message
              : "채팅 처리 중 오류가 발생했습니다.";
          setErrorMessage(message);
          return;
        }

        if (eventName === "chat.room.new" || eventName === "chat.room.bump") {
          const patch = normalizeWsRoomPatch(data);
          if (patch) applyRoomPatch(patch);
          else void loadRooms();
          return;
        }

        if (eventName === "chat.read" || eventName === "chat.read.ack") {
          const roomId = Number(data?.room_id ?? data?.roomId ?? 0);
          if (roomId <= 0) return;
          const unread =
            data?.unread_count == null ? undefined : Math.max(0, Number(data.unread_count));
          setRooms((prev) =>
            prev.map((room) =>
              room.id === roomId
                ? {
                    ...room,
                    unread_count:
                      unread == null
                        ? data?.actor_type === actorType && Number(data?.actor_id ?? 0) === actorId
                          ? 0
                          : room.unread_count
                        : unread,
                    unread_count_display:
                      unread == null
                        ? data?.actor_type === actorType && Number(data?.actor_id ?? 0) === actorId
                          ? "0"
                          : room.unread_count_display
                        : toUnreadCountDisplay(unread),
                  }
                : room
            )
          );
          return;
        }

        if (eventName === "chat.typing") {
          const roomId = Number(data?.room_id ?? 0);
          const actorTypeFromWs = String(data?.actor_type || "");
          const actorIdFromWs = Number(data?.actor_id ?? 0);
          if (
            roomId <= 0 ||
            roomId !== selectedRoomRef.current ||
            (actorTypeFromWs === actorType && actorIdFromWs === actorId)
          ) {
            return;
          }
          const isTyping = Boolean(data?.is_typing);
          if (!isTyping) {
            setTypingLabel(null);
            if (typingClearTimerRef.current) {
              window.clearTimeout(typingClearTimerRef.current);
              typingClearTimerRef.current = null;
            }
            return;
          }
          setTypingLabel(`${taxOfficeName} 입력 중...`);
          if (typingClearTimerRef.current) window.clearTimeout(typingClearTimerRef.current);
          typingClearTimerRef.current = window.setTimeout(() => setTypingLabel(null), 2500);
          return;
        }

        if (eventName === "chat.message") {
          const normalized = normalizeIncomingMessage(data);
          if (!normalized) return;

          const isMine = normalized.sender_type === actorType && normalized.sender_id === actorId;
          const isViewingRoom = selectedRoomRef.current === normalized.room_id;

          if (isViewingRoom) {
            setMessages((prev) => dedupeByMessageId([...prev, normalized]));
          }

          let roomExists = false;
          setRooms((prev) => {
            const next = prev.map((r) => {
              if (r.id !== normalized.room_id) return r;
              roomExists = true;
              const unreadCount = isViewingRoom || isMine ? 0 : (r.unread_count || 0) + 1;
              return {
                ...r,
                last_message_id: normalized.id,
                last_message_preview: normalized.body || normalized.attachment?.file_name || "",
                last_message_at: normalized.created_at,
                unread_count: unreadCount,
                unread_count_display: toUnreadCountDisplay(unreadCount),
              };
            });
            return sortRoomsByRecentMessage(next);
          });
          if (!roomExists) {
            void loadRooms();
          }
          if (isViewingRoom && !isMine) {
            void markReadAndSync(normalized.room_id, normalized.id);
          }
          return;
        }
      } catch {
        // noop
      }
    };

    ws.onclose = (evt) => {
      wsRef.current = null;
      wsConnectLockRef.current = false;
      if (open && WS_UNAUTHORIZED_CODES.has(evt.code)) {
        void handleUnauthorized();
      } else if (open) {
        setTimeout(() => {
          if (!wsRef.current && open) {
            wsConnectLockRef.current = false;
          }
        }, 1200);
      }
    };

    ws.onerror = () => {
      // connection close will handle fallback
    };

    return () => {
      ws.close();
    };
  }, [
    actorId,
    actorType,
    applyRoomPatch,
    handleUnauthorized,
    loadRooms,
    markReadAndSync,
    open,
    sendWsEvent,
    taxOfficeName,
    wsEpoch,
  ]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => {
      sendWsEvent("chat.ping", {});
    }, WS_PING_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [open, sendWsEvent]);

  useEffect(() => {
    if (!viewer) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewer(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [viewer]);

  const handleSendMessage = useCallback(async () => {
    if (!selectedRoomId || sending) return;
    const body = messageBody.trim();
    if (!body) return;
    setSending(true);
    setErrorMessage(null);
    try {
      const msg = await companyWorkChatApi.sendMessage(selectedRoomId, body);
      setMessages((prev) => dedupeByMessageId([...prev, msg]));
      setMessageBody("");
      if (typingSentRef.current) {
        sendWsEvent("chat.typing", { room_id: selectedRoomId, is_typing: false });
        typingSentRef.current = false;
      }
    } catch (e) {
      if (isRoomAccessError(e)) {
        discardRoomFromCache(selectedRoomId);
        void loadRooms();
      }
      const message = e instanceof Error ? e.message : "메시지 전송에 실패했습니다.";
      setErrorMessage(message);
    } finally {
      setSending(false);
    }
  }, [discardRoomFromCache, isRoomAccessError, loadRooms, messageBody, selectedRoomId, sendWsEvent, sending]);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!selectedRoomId || uploading) return;
      const err = validateAttachment(file);
      if (err) {
        setErrorMessage(err);
        return;
      }
      setUploading(true);
      setErrorMessage(null);
      try {
        const msg = await companyWorkChatApi.uploadAttachment(selectedRoomId, file);
        setMessages((prev) => dedupeByMessageId([...prev, msg]));
      } catch (e) {
        if (isRoomAccessError(e)) {
          discardRoomFromCache(selectedRoomId);
          void loadRooms();
        }
        const message = e instanceof Error ? e.message : "파일 업로드에 실패했습니다.";
        setErrorMessage(message);
      } finally {
        setUploading(false);
      }
    },
    [discardRoomFromCache, isRoomAccessError, loadRooms, selectedRoomId, uploading]
  );

  const markMessageExpired = useCallback((attachmentId: number) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (!m.attachment || m.attachment.id !== attachmentId) return m;
        return {
          ...m,
          body: "만료된 파일입니다.",
          attachment: { ...m.attachment, is_expired: true },
        };
      })
    );
  }, []);

  const handleOpenPreview = useCallback(
    async (attachment: WorkChatAttachment) => {
      if (attachment.is_expired) {
        setErrorMessage("만료된 파일입니다.");
        return;
      }
      try {
        const res = await companyWorkChatApi.getAttachmentPreviewUrl(attachment.id);
        if (res.is_expired || !res.url) {
          markMessageExpired(attachment.id);
          setErrorMessage("만료된 파일입니다.");
          return;
        }
        setViewerMode("fit");
        setViewer({
          url: res.url,
          fileName: res.file_name || attachment.file_name,
          contentType: res.content_type || attachment.content_type,
        });
      } catch (e) {
        if (e instanceof WorkChatApiError && e.status === 410) {
          markMessageExpired(attachment.id);
          setErrorMessage("만료된 파일입니다.");
          return;
        }
        setErrorMessage(e instanceof Error ? e.message : "미리보기에 실패했습니다.");
      }
    },
    [markMessageExpired]
  );

  const handleDownload = useCallback(
    async (attachment: WorkChatAttachment) => {
      if (attachment.is_expired) {
        setErrorMessage("만료된 파일입니다.");
        return;
      }
      try {
        const res = await companyWorkChatApi.getAttachmentDownloadUrl(attachment.id);
        if (res.is_expired || !res.url) {
          markMessageExpired(attachment.id);
          setErrorMessage("만료된 파일입니다.");
          return;
        }
        const a = document.createElement("a");
        a.href = res.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.download = res.file_name || attachment.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        if (e instanceof WorkChatApiError && e.status === 410) {
          markMessageExpired(attachment.id);
          setErrorMessage("만료된 파일입니다.");
          return;
        }
        setErrorMessage(e instanceof Error ? e.message : "다운로드에 실패했습니다.");
      }
    },
    [markMessageExpired]
  );

  const senderLabel = useCallback(
    (msg: WorkChatMessage) => {
      if (msg.sender_type === "system") return "시스템";
      if (msg.sender_type === "company_account" && msg.sender_id === actorId) return "나";
      if (msg.sender_type === "admin" || msg.sender_type === "client_account") return taxOfficeName;
      return "고객사";
    },
    [actorId, taxOfficeName]
  );

  const handleMessageInputChange = useCallback(
    (nextValue: string) => {
      setMessageBody(nextValue);
      if (!selectedRoomId) return;
      if (!typingSentRef.current) {
        sendWsEvent("chat.typing", { room_id: selectedRoomId, is_typing: true });
        typingSentRef.current = true;
      }
      if (typingStopTimerRef.current) window.clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = window.setTimeout(() => {
        if (!typingSentRef.current) return;
        sendWsEvent("chat.typing", { room_id: selectedRoomId, is_typing: false });
        typingSentRef.current = false;
      }, 1200);
    },
    [selectedRoomId, sendWsEvent]
  );

  const handleDeleteMessage = useCallback(
    async (messageId: number) => {
      if (deletingMessageId) return;
      setDeletingMessageId(messageId);
      setMessageMenu(null);
      try {
        await companyWorkChatApi.deleteMessage(messageId);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id !== messageId
              ? msg
              : {
                  ...msg,
                  is_deleted: true,
                  body: "삭제된 메시지입니다.",
                  attachment: null,
                }
          )
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : "메시지 삭제에 실패했습니다.";
        setErrorMessage(message);
      } finally {
        setDeletingMessageId(null);
      }
    },
    [deletingMessageId]
  );

  useEffect(() => {
    if (!open || !selectedRoomId) return;
    return () => {
      if (typingSentRef.current) {
        sendWsEvent("chat.typing", { room_id: selectedRoomId, is_typing: false });
        typingSentRef.current = false;
      }
      if (typingStopTimerRef.current) {
        window.clearTimeout(typingStopTimerRef.current);
        typingStopTimerRef.current = null;
      }
      if (typingClearTimerRef.current) {
        window.clearTimeout(typingClearTimerRef.current);
        typingClearTimerRef.current = null;
      }
    };
  }, [open, selectedRoomId, sendWsEvent]);

  useEffect(() => {
    if (!messageMenu) return;
    const close = () => setMessageMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [messageMenu]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-xl transition hover:bg-neutral-800"
        aria-label="채팅 열기"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadTotal > 0 ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-semibold">
            {unreadTotal > 99 ? "99+" : unreadTotal}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed bottom-24 right-6 z-40 flex h-[620px] w-[980px] max-w-[calc(100vw-32px)] rounded-2xl border border-zinc-200 bg-white shadow-2xl">
          <aside className="w-[300px] shrink-0 border-r border-zinc-200">
            <div className="border-b border-zinc-200 px-4 py-3">
              <div className="text-sm font-semibold text-zinc-900">세무사 연결</div>
              <div className="mt-1 text-xs text-zinc-500">채팅방 목록</div>
            </div>
            <div className="h-[calc(620px-57px)] overflow-y-auto">
              {roomsLoading ? (
                <div className="px-4 py-6 text-sm text-zinc-500">채팅방을 불러오는 중입니다...</div>
              ) : rooms.length === 0 ? (
                <div className="px-4 py-6 text-sm text-zinc-500">채팅방이 없습니다.</div>
              ) : (
                rooms.map((room) => {
                  const active = selectedRoomId === room.id;
                  const title = String(room.display_name || room.name || "").trim() || "세무사 연결";
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`w-full border-b border-zinc-100 px-4 py-3 text-left ${
                        active ? "bg-zinc-100" : "hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-semibold text-zinc-900">{title}</div>
                        {room.unread_count > 0 ? (
                          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[11px] text-white">
                            {room.unread_count_display || room.unread_count}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 truncate text-xs text-zinc-500">
                        {room.last_message_preview || "메시지가 없습니다."}
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-400">{toLocalDateTime(room.last_message_at)}</div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">{roomTitle}</div>
                <div className="mt-1 text-xs text-zinc-500">세무사와 연결된 상담 채팅</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSearchOpen((v) => !v)}
                  className="rounded-md border border-zinc-200 px-2 py-1 text-xs hover:bg-zinc-50"
                >
                  검색
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-zinc-200 px-2 py-1 text-xs hover:bg-zinc-50"
                >
                  닫기
                </button>
              </div>
            </div>

            {searchOpen ? (
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void runRoomSearch();
                      }}
                      placeholder="방 내부 검색"
                      className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-8 pr-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void runRoomSearch()}
                    className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-xs hover:bg-zinc-100"
                  >
                    검색
                  </button>
                  <div className="flex items-center gap-1 text-xs text-zinc-600">
                    <span>
                      {searchRows.length === 0 || searchIndex < 0
                        ? "0/0"
                        : `${searchIndex + 1}/${searchRows.length}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => void jumpToSearchResult(Math.max(0, searchIndex - 1))}
                      disabled={searchRows.length === 0}
                      className="rounded border border-zinc-200 bg-white p-1 disabled:opacity-40"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void jumpToSearchResult(Math.min(searchRows.length - 1, searchIndex + 1))}
                      disabled={searchRows.length === 0}
                      className="rounded border border-zinc-200 bg-white p-1 disabled:opacity-40"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {searchLoading ? (
                  <div className="mt-1 text-xs text-zinc-500">검색 중...</div>
                ) : null}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <div ref={roomScrollRef} className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-4">
              {!selectedRoomId ? (
                <div className="text-sm text-zinc-500">채팅방을 선택해 주세요.</div>
              ) : messagesLoading ? (
                <div className="text-sm text-zinc-500">메시지를 불러오는 중입니다...</div>
              ) : (
                <div className="space-y-3">
                  {nextBeforeMessageId ? (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          selectedRoomId &&
                          !loadingMore &&
                          void loadMessages(selectedRoomId, {
                            beforeMessageId: nextBeforeMessageId,
                            append: true,
                          })
                        }
                        className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs hover:bg-zinc-100"
                      >
                        {loadingMore ? "불러오는 중..." : "이전 메시지 더보기"}
                      </button>
                    </div>
                  ) : null}

                  {messages.length === 0 ? (
                    <div className="py-10 text-center text-sm text-zinc-500">
                      아직 메시지가 없습니다.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const mine = msg.sender_type === actorType && msg.sender_id === actorId;
                      const att = msg.attachment || null;
                      const expired = Boolean(att?.is_expired) || msg.body === "만료된 파일입니다.";
                      const marked = activeSearchMessageId === msg.id && searchKeyword.trim().length > 0;
                      const isSystem = msg.sender_type === "system" || msg.message_type === "system";

                      if (isSystem) {
                        return (
                          <div key={msg.id} className="flex justify-center">
                            <div className="rounded-full bg-zinc-200 px-3 py-1 text-xs text-zinc-700">
                              {msg.body || "시스템 메시지"}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          id={`chat-msg-${msg.id}`}
                          key={msg.id}
                          className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            onContextMenu={(e) => {
                              if (!mine || msg.is_deleted) return;
                              e.preventDefault();
                              setMessageMenu({ x: e.clientX, y: e.clientY, messageId: msg.id });
                            }}
                            className={`max-w-[78%] rounded-xl px-3 py-2 ${
                              mine ? "bg-neutral-900 text-white" : "bg-white text-zinc-900"
                            } ${marked ? "ring-2 ring-yellow-300" : ""}`}
                          >
                            <div className={`text-[11px] ${mine ? "text-neutral-300" : "text-zinc-500"}`}>
                              {senderLabel(msg)} · {toLocalTime(msg.created_at)}
                            </div>

                            {att ? (
                              <div className="mt-1 rounded-md border border-zinc-200/80 bg-white/90 px-2 py-2 text-zinc-900">
                                <div className="flex items-center gap-2 text-xs">
                                  <Paperclip className="h-3.5 w-3.5" />
                                  <span className="truncate">{att.file_name}</span>
                                  <span className="text-zinc-500">{bytesToLabel(att.file_size)}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => att && void handleOpenPreview(att)}
                                    disabled={!canPreview(att) || expired}
                                    className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-[11px] disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                    미리보기
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleDownload(att)}
                                    disabled={expired}
                                    className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-[11px] disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    다운로드
                                  </button>
                                  {expired ? (
                                    <span className="text-[11px] text-rose-600">만료된 파일입니다.</span>
                                  ) : null}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-1 whitespace-pre-wrap break-words text-sm">
                                {markText(String(msg.body || ""), searchKeyword)}
                              </div>
                            )}
                            {mine ? (
                              <div className={`mt-1 text-right text-[10px] ${mine ? "text-neutral-300" : "text-zinc-500"}`}>
                                {selectedRoom?.unread_count === 0 ? "읽음" : "전송됨"}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                  {typingLabel ? (
                    <div className="flex justify-start">
                      <div className="rounded-md bg-white px-3 py-1 text-xs text-zinc-500 shadow-sm">
                        {typingLabel}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="border-t border-zinc-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-zinc-200 px-2 hover:bg-zinc-50">
                  <Paperclip className="h-4 w-4 text-zinc-600" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload(file);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
                <input
                  value={messageBody}
                  onChange={(e) => handleMessageInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                  placeholder="메시지를 입력하세요"
                  className="h-9 flex-1 rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => void handleSendMessage()}
                  disabled={sending || !messageBody.trim() || !selectedRoomId || selectedRoom?.is_active === false}
                  className="inline-flex h-9 items-center gap-1 rounded-md bg-neutral-900 px-3 text-xs font-medium text-white disabled:opacity-50"
                >
                  <SendHorizontal className="h-3.5 w-3.5" />
                  전송
                </button>
              </div>
              {uploading ? (
                <div className="mt-2 text-xs text-zinc-500">파일 업로드 중...</div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      {messageMenu ? (
        <div
          className="fixed z-50 min-w-[120px] rounded-md border border-zinc-200 bg-white p-1 shadow-lg"
          style={{ left: messageMenu.x, top: messageMenu.y }}
        >
          <button
            type="button"
            onClick={() => void handleDeleteMessage(messageMenu.messageId)}
            disabled={deletingMessageId === messageMenu.messageId}
            className="w-full rounded px-2 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-50"
          >
            {deletingMessageId === messageMenu.messageId ? "삭제 중..." : "메시지 삭제"}
          </button>
        </div>
      ) : null}

      {viewer ? (
        <div
          className="fixed inset-0 z-50 bg-black/70"
          onClick={() => setViewer(null)}
          role="button"
          tabIndex={-1}
        >
          <div
            className="absolute inset-6 rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-900">{viewer.fileName}</div>
                <div className="mt-1 text-xs text-zinc-500">빠른 확인 후 다운로드 권장</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewerMode("fit")}
                  className={`rounded border px-2 py-1 text-xs ${
                    viewerMode === "fit" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200"
                  }`}
                >
                  창 맞춤
                </button>
                <button
                  type="button"
                  onClick={() => setViewerMode("original")}
                  className={`rounded border px-2 py-1 text-xs ${
                    viewerMode === "original" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200"
                  }`}
                >
                  원본 크기
                </button>
                <button
                  type="button"
                  onClick={() => setViewer(null)}
                  className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                  닫기
                </button>
              </div>
            </div>
            <div className="h-[calc(100%-58px)] overflow-auto bg-zinc-50 p-4">
              {String(viewer.contentType || "").startsWith("image/") || IMAGE_EXTS.includes(getExt(viewer.fileName)) ? (
                <div className="h-full w-full overflow-auto">
                  <img
                    src={viewer.url}
                    alt={viewer.fileName}
                    className={`mx-auto ${
                      viewerMode === "fit" ? "max-h-full max-w-full object-contain" : "max-h-none max-w-none object-none"
                    }`}
                  />
                </div>
              ) : (
                <iframe title={viewer.fileName} src={viewer.url} className="h-full w-full rounded-md border border-zinc-200 bg-white" />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
