import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { BookDetailPage } from "@/pages/BookDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/books/:id",
    element: <BookDetailPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
