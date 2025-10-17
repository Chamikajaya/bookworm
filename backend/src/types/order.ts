export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
}

export interface Order {
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}

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

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface CreateOrderInput {
  shippingAddress: ShippingAddress;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  note?: string;
}

export interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}
