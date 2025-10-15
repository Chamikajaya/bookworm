export enum EmailType {
  ORDER_CONFIRMATION_CUSTOMER = "ORDER_CONFIRMATION_CUSTOMER",
  ORDER_CONFIRMATION_ADMIN = "ORDER_CONFIRMATION_ADMIN",
  ORDER_STATUS_UPDATE = "ORDER_STATUS_UPDATE",
}

export interface EmailMessage {
  type: EmailType;
  to: string;
  subject: string;
  data: any;
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: any;
}

export interface StatusUpdateData {
  orderNumber: string;
  customerName: string;
  status: string;
  statusMessage: string;
}

export const statusMessages: Record<string, string> = {
  PENDING: "Your order has been received and is being processed.",
  PROCESSING: "Your order is being prepared for shipment.",
  SHIPPED: "Your order has been shipped and is on its way!",
};
