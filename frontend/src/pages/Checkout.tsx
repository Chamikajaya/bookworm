import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/layout/Header";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useGetCartQuery } from "@/api/cartApi";
import { useCreateOrderMutation } from "@/api/ordersApi";
import {
  shippingSchema,
  type ShippingFormData,
} from "@/lib/validations/shippingFormSchema";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useRequireAuth();
  const { data: cart, isLoading: cartLoading } = useGetCartQuery();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Sri Lanka",
      phone: "",
    },
  });

  const onSubmit = async (data: ShippingFormData) => {
    try {
      const result = await createOrder({ shippingAddress: data }).unwrap();
      toast.success("Order placed successfully!");
      navigate(`/orders/${result.order.orderId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Redirect if cart is empty after loading
  if (!cart || cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ShippingForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isCreatingOrder}
            />
          </div>
          <div>
            <CheckoutOrderSummary cart={cart} />
          </div>
        </div>
      </main>
    </div>
  );
};
