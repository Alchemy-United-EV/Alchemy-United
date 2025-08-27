// client/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import HostApplication from "./pages/HostApplication";
import EarlyAccess from "./pages/early-access";

import { ToastProvider } from "@/components/ui/toast";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/host-application", element: <HostApplication /> },
  { path: "/early-access", element: <EarlyAccess /> }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>
);