import { useState } from "react";
import { format } from "date-fns";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/api/ordersApi";
import { toast } from "sonner";
import { Package, Eye } from "lucide-react";
import type { Order, OrderStatus } from "@/types/orderTypes";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { statusColors } from "@/constants/constants";
import { Spinner } from "@/components/ui/spinner";

// ! TODO: Need to break this down + add admin dashboard stats + link this
export const AdminOrders = () => {
  const { isLoading: authLoading } = useRequireAuth("ADMIN");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("PENDING");
  const [statusNote, setStatusNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusFilter =
    activeTab === "all" ? undefined : (activeTab.toUpperCase() as OrderStatus);
  const { data, isLoading } = useGetAllOrdersQuery(statusFilter);
  const [updateStatus, { isLoading: updating }] =
    useUpdateOrderStatusMutation();

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await updateStatus({
        orderId: selectedOrder.orderId,
        data: { status: newStatus, note: statusNote },
      }).unwrap();
      toast.success("Order status updated successfully");
      setIsDialogOpen(false);
      setSelectedOrder(null);
      setStatusNote("");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const openStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote("");
    setIsDialogOpen(true);
  };

  if (authLoading) return null;

  if (isLoading) {
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
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    processing: orders.filter((o) => o.status === "PROCESSING").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.processing}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shipped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.shipped}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell className="font-medium">
                            #{order.orderId.slice(0, 8).toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.userName}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.userEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(order.createdAt, "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${order.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={statusColors[order.status]}
                              variant="secondary"
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    `/orders/${order.orderId}`,
                                    "_blank"
                                  )
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => openStatusDialog(order)}
                              >
                                Update Status
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Update Status Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Order #{selectedOrder?.orderId.slice(0, 8).toUpperCase()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <Select
                  value={newStatus}
                  onValueChange={(value) => setNewStatus(value as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Note (Optional)</label>
                <Textarea
                  placeholder="Add a note about this status update..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={updating}>
                {updating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};
