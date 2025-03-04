import React from "react";
import ReactDOM from "react-dom/client";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import "./index.css";

import {
  WorkerLoginPage,
  WorkerRegisterPage,
  WorkerOrdersTable,
  WorkerInventoryTable,
  InventoryTable,
  OrdersTable,
  LoginPage as AdminLoginPage,
  ProtectedRoute,
} from "./components";

import NavigationLayout from "./layouts/NavigationLayout";
import AdminNavigation from "./layouts/AdminNavigation";
import WorkerNavigation from "./layouts/WorkerNavigation";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavigationLayout />}>
      <Route index element={<AdminLoginPage />} />
      <Route path="worker-login" element={<WorkerLoginPage />} />
      <Route path="worker-register" element={<WorkerRegisterPage />} />

      {/* Admin Routes */}
      <Route path="admin" element={<ProtectedRoute><AdminNavigation /></ProtectedRoute>}>
        <Route path="orders" element={<OrdersTable />} />
        <Route path="inventory" element={<InventoryTable />} />
      </Route>

      {/* Worker Routes */}
      <Route path="worker" element={<ProtectedRoute><WorkerNavigation /></ProtectedRoute>}>
        <Route path="orders" element={<WorkerOrdersTable />} />
        <Route path="inventory" element={<WorkerInventoryTable />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
