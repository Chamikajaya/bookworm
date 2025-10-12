import { UserRole } from "./user";

export interface Connection {
  connectionId: string;
  userId: string;
  role: UserRole;
  email: string;
  name: string;
  connectedAt: string;
  lastActiveAt: string;
  ttl?: number;
}

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  readAt?: string;
  type: "text";
}

export interface Conversation {
  conversationId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  adminId: string;
  adminName: string;
  lastMessage: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
  };
  unreadCount: {
    customer: number;
    admin: number;
  };
  createdAt: string;
  updatedAt: string;
  status: "active" | "closed";
}

export interface WebSocketEvent {
  requestContext: {
    connectionId: string;
    routeKey: string;
    authorizer?: {
      userId: string;
      role: string;
      email: string;
      name: string;
    };
  };
  body?: string;
  queryStringParameters?: {
    token?: string;
  };
}

export interface SendMessagePayload {
  action: "sendMessage";
  recipientId: string;
  content: string;
}
