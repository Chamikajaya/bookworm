export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED";

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  createdAt: number;
  updatedAt: number;
  statusHistory: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: number;
  note?: string;
}

export interface OrderItem {
  orderId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookPrice: number;
  quantity: number;
  subtotal: number;
  bookImage?: string;
}

export interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}

export interface CreateOrderInput {
  shippingAddress: ShippingAddress;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  note?: string;
}
