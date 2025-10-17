import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { AuthCallback } from "@/pages/AuthCallback";
import { Profile } from "@/pages/Profile";
import { Forbidden } from "@/pages/Forbidden";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { CustomerDashboard } from "@/pages/CustomerDashboard";
import { AddBook } from "@/pages/admin/AddBookPage";
import { CartPage } from "@/pages/Cart";
import { CheckoutPage } from "@/pages/Checkout";
import { Orders } from "@/pages/OrdersPage";
import { OrderDetail } from "@/pages/OrderDetail";
import { AdminOrders } from "@/pages/admin/AdminOrders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/books/:id",
    element: <BookDetailPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <CustomerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <Orders />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders/:orderId",
    element: (
      <ProtectedRoute>
        <OrderDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/me",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/add-book",
    element: (
      <ProtectedRoute requireAdmin>
        <AddBook />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminOrders />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
