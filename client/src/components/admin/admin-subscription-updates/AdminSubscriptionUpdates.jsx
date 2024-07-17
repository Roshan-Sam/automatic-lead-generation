import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAdminNotificationContext } from "../../../hooks/useAdminNotificationContext";
import config from "../../../Functions/config";

const AdminSubscriptionUpdates = () => {
  const [companySubscriptions, setCompanySubscriptions] = useState([]);
  const { dispatch } = useAdminNotificationContext();
  const isCheckingSubscriptions = useRef(false);

  const fetchCompanySubscriptions = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/subscriptions/`);
      if (res.status === 200) {
        const { company_subscriptions } = res.data;
        setCompanySubscriptions(company_subscriptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanySubscriptions();
    const interval = setInterval(
      fetchCompanySubscriptions,
      24 * 60 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (companySubscriptions.length > 0) {
      checkSubscriptionsAndNotify();
    }
  }, [companySubscriptions]);

  const checkSubscriptionsAndNotify = async () => {
    if (isCheckingSubscriptions.current) return;
    isCheckingSubscriptions.current = true;

    const now = new Date();
    const twoDaysLater = new Date(now);
    twoDaysLater.setDate(now.getDate() + 2);

    for (const subscription of companySubscriptions) {
      const endDate = new Date(subscription.end_date);

      if (
        endDate.toDateString() === twoDaysLater.toDateString() &&
        !subscription.notify_before_expire
      ) {
        await axios.post(`${config.baseApiUrl}admin/notifications/`, {
          message: `Subscription for ${subscription.company.company_name}, ${subscription.subscription_plan.product.name} product, ${subscription.subscription_plan.plan.name} plan is expiring in 2 days.`,
          type: "subscription",
        });
        await axios.patch(
          `${config.baseApiUrl}admin/subscriptions/${subscription.id}/update/notify/`,
          {
            notify_before_expire: true,
          }
        );
      } else if (endDate < now && !subscription.notify_on_expire) {
        await axios.post(`${config.baseApiUrl}admin/notifications/`, {
          message: `Subscription for ${subscription.company.company_name}, ${subscription.subscription_plan.product.name} product, ${subscription.subscription_plan.plan.name} plan has expired.`,
          type: "subscription",
        });
        await axios.patch(
          `${config.baseApiUrl}admin/subscriptions/${subscription.id}/update/notify/`,
          {
            notify_on_expire: true,
          }
        );
      }
    }
    isCheckingSubscriptions.current = false;
    fetchNotifications();
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${config.baseApiUrl}admin/notifications/`
      );

      const unread = response.data.filter(
        (notification) => !notification.is_read
      );
      dispatch({ type: "UPDATE_UNREAD_NOTIFICATIONS", payload: unread });
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  return <></>;
};

export default AdminSubscriptionUpdates;
