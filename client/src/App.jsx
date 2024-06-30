import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/registration-login/registration/Register";
import Login from "./pages/registration-login/login/Login";
import Index from "./pages/index/Index";
import CompanyDashboard from "./pages/company/dashboard/CompanyDashboard";
import AdminDash from "./pages/admin/admin-dash/AdminDash";
import Company from "./pages/admin/admin-company/Company";
import ProductFeatures from "./pages/admin/admin-product-features/ProductFeatures";
import PlanAndPricing from "./pages/admin/admin-plan-pricing/PlanAndPricing";
import Subscriptions from "./pages/admin/admin-subscriptions/Subscriptions";
import Notification from "./pages/admin/admin-notification/Notification";
import Profile from "./pages/admin/admin-profile/Profile";
import ProductPreview from "./pages/admin/admin-product-features/ProductPreview";
import "flowbite";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin">
          <Route path="dashboard" element={<AdminDash />} />
          <Route path="company" element={<Company />} />
          <Route path="product-features" element={<ProductFeatures />} />
          <Route path="plan-pricing" element={<PlanAndPricing />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="account" element={<Profile />} />
          <Route
            path="product-features-details/:id"
            element={<ProductPreview />}
          />
        </Route>
        <Route path="/company-dash" element={<CompanyDashboard />} />
      </Routes>
    </>
  );
}

export default App;
