import z from "zod";
import { OrderStatus } from "../types/order";

export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus),
  note: z.string().optional(),
});
