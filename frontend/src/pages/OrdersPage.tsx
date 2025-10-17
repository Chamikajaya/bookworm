import { format } from "date-fns";
import { Package, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetOrdersQuery } from "@/api/ordersApi";
import { statusColors } from "@/constants/constants";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";

// ! TODO: Rather than making a separate page, integrate this into CustomerDashboard
// ! Break this down ? + Fix the issue with authrizaion / rbac error
export const Orders = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth();
  const { data, isLoading } = useGetOrdersQuery();

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Spinner className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            {orders.length === 0
              ? "No orders yet"
              : `${orders.length} order(s)`}
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground text-center">
                Start shopping to see your orders here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.orderId}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/orders/${order.orderId}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          Order #{order.orderId.slice(0, 8).toUpperCase()}
                        </h3>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Placed on {format(order.createdAt, "MMM dd, yyyy")}
                      </p>
                      <p className="font-semibold text-lg">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        View Details
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
