import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Register from "./pages/registration-login/registration/Register";
import Login from "./pages/registration-login/login/Login";
import Index from "./pages/index/Index";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import CompanyDashboard from "./pages/company/dashboard/CompanyDashboard";
import "preline/preline";
import "./App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dash" element={<AdminDashboard />} />
        <Route path="/company-dash" element={<CompanyDashboard />} />
      </Routes>
    </>
  );
}

export default App;
