import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import AdminDash from "../../../components/admin/admin-dash/AdminDash";
import Profile from "../../../components/admin/admin-profile/Profile";
import Company from "../../../components/admin/admin-company/Company";
import PlanAndPricing from "../../../components/admin/admin-plan-pricing/PlanAndPricing";
import Notification from "../../../components/admin/admin-notification/Notification";
import Subscriptions from "../../../components/admin/admin-subscriptions/Subscriptions";
import ProductFeatures from "../../../components/admin/admin-product-features/ProductFeatures";

const AdminDashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const sidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <div className="bg-[rgb(16,23,42)]">
        <AdminNav />
        <div className="flex min-h-screen pt-20">
          <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-50">
            <AdminSidebar sidebarToggle={sidebarToggle} />
          </div>

          <div
            className={`flex-1 min-h-screen overflow-auto transition-all duration-300 z-40 ${
              isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
            }`}
          >
            {tab === "dash" && <AdminDash />}

            {tab === "account" && <Profile />}

            {tab === "company" && <Company />}

            {tab === "plan-pricing" && <PlanAndPricing />}

            {tab === "notifications" && <Notification />}

            {tab === "subscriptions" && <Subscriptions />}

            {tab === "product-features" && <ProductFeatures />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
