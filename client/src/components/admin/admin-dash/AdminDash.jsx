import React, { useEffect, useState } from "react";
import { FiUsers, FiDollarSign, FiBell } from "react-icons/fi";
import { FaRegPaperPlane } from "react-icons/fa";
import axios from "axios";

const AdminDash = () => {
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [totalPlanPricing, setTotalPlanPricing] = useState(0);

  const fetchAllSectionCount = async () => {
    try {
      const [companiesRes, subscriptionsRes, notificationsRes, planPricingRes] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}companies/`),
          axios.get(`${import.meta.env.VITE_API_URL}admin/subscriptions/`),
          axios.get(`${import.meta.env.VITE_API_URL}admin/notifications/`),
          axios.get(
            `${import.meta.env.VITE_API_URL}admin/create-subscription-plan/`
          ),
        ]);

      setTotalCompanies(companiesRes.data.length);
      setTotalSubscriptions(subscriptionsRes.data.length);
      setTotalNotifications(notificationsRes.data.length);
      setTotalPlanPricing(planPricingRes.data.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllSectionCount();
  }, []);

  return (
    <>
      <div className="bg-slate-900 min-h-full text-white px-4">
        <div className="bg-transparent px-4 py-16 text-white">
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-x-6 gap-y-12 max-w-7xl mx-auto">
            <div className="text-center bg-gray-800 p-4 border-b-4 border-purple-700 rounded-md">
              <FiUsers className="fill-purple-600 w-10 inline-block size-10" />
              <h3 className="text-5xl font-extrabold mt-5">{totalCompanies}</h3>
              <p className="text-gray-300 font-semibold mt-3">
                Total Companies
              </p>
            </div>
            <div className="text-center bg-gray-800 p-4 border-b-4 border-purple-700 rounded-md">
              <FiDollarSign className="fill-purple-600 w-10 inline-block size-10" />
              <h3 className="text-5xl font-extrabold mt-5">
                {totalPlanPricing}
              </h3>
              <p className="text-gray-300 font-semibold mt-3">
                Total Plan and Pricing
              </p>
            </div>
            <div className="text-center bg-gray-800 p-4 border-b-4 border-purple-700 rounded-md">
              <FaRegPaperPlane className="fill-purple-400 w-10 inline-block size-10" />
              <h3 className="text-5xl font-extrabold mt-5">
                {totalSubscriptions}
              </h3>
              <p className="text-gray-300 font-semibold mt-3">
                Total Subscriptions
              </p>
            </div>
            <div className="text-center bg-gray-800 p-4 border-b-4 border-purple-700 rounded-md">
              <FiBell className="fill-purple-600 w-10 inline-block size-10" />
              <h3 className="text-5xl font-extrabold mt-5">
                {totalNotifications}
              </h3>
              <p className="text-gray-300 font-semibold mt-3">
                Total Notifications
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDash;
