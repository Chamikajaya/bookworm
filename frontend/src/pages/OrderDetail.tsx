import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Package, MapPin, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useGetOrderByIdQuery } from "@/api/ordersApi";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { statusColors } from "@/constants/constants";

// ! TODO: Need to break this down
export const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isLoading: authLoading } = useRequireAuth();
  const { data, isLoading, error } = useGetOrderByIdQuery(orderId!);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  const { order, items } = data;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">
              Order #{order.orderId.slice(0, 8).toUpperCase()}
            </h1>
            <Badge className={statusColors[order.status]} variant="secondary">
              {order.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Placed on {format(order.createdAt, "MMMM dd, yyyy")} at{" "}
            {format(order.createdAt, "h:mm a")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Items */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.bookId} className="flex gap-4">
                    <div className="w-16 h-20 flex-shrink-0 bg-muted rounded overflow-hidden">
                      {item.bookImage ? (
                        <img
                          src={item.bookImage}
                          alt={item.bookTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {item.bookTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        by {item.bookAuthor}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-semibold">
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Info */}
          <div className="space-y-4">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-semibold">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.statusHistory.map((entry, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === order.statusHistory.length - 1
                              ? "bg-primary"
                              : "bg-muted-foreground/30"
                          }`}
                        />
                        {index < order.statusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-muted-foreground/30 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{entry.status}</span>
                          <Badge variant="outline" className="text-xs">
                            {format(entry.timestamp, "MMM dd, h:mm a")}
                          </Badge>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
