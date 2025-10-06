import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { AddBook } from "@/pages/admin/AddBookPage";
import { AdminDashboard } from "@/pages/admin/Dashboard";

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
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/add-book",
    element: <AddBook />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
