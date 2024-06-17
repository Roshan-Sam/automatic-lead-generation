import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdKeyboardArrowLeft,
  MdOutlineCategory,
  MdOutlineAttachMoney,
  MdBusiness,
  MdSubscriptions,
  MdNotifications,
  MdSettings,
  MdLock,
  MdExitToApp,
} from "react-icons/md";
import React from "react";
import Preline from "../../preline/Preline";
import "./adminsidebar.css";

const AdminSidebar = ({ sidebarToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [tab, setTab] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const handleSignOut = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    sidebarToggle();
    if (isAccountSettingsOpen) {
      setIsAccountSettingsOpen(!isAccountSettingsOpen);
    }
  };

  const toggleAccountSettings = () => {
    setIsAccountSettingsOpen(!isAccountSettingsOpen);
  };

  const menu = [
    {
      name: "Dashboard",
      link: "/admin-dash?tab=dash",
      icon: MdOutlineDashboard,
      tab: "dash",
    },
    {
      name: "Product & Features",
      link: "/admin-dash?tab=product-features",
      icon: MdOutlineCategory,
      tab: "product-features",
    },
    {
      name: "Plan & Pricing",
      link: "/admin-dash?tab=plan-pricing",
      icon: MdOutlineAttachMoney,
      tab: "plan-pricing",
    },
    {
      name: "Company",
      link: "/admin-dash?tab=company",
      icon: MdBusiness,
      tab: "company",
    },
    {
      name: "Subscriptions",
      link: "/admin-dash?tab=subscriptions",
      icon: MdSubscriptions,
      tab: "subscriptions",
    },
    {
      name: "Notifications",
      link: "/admin-dash?tab=notifications",
      icon: MdNotifications,
      tab: "notifications",
    },
    {
      name: "Account Settings",
      icon: MdSettings,
      submenu: [
        {
          name: "Password Change",
          action: () => {
            /* Your password change logic here */
          },
          icon: MdLock,
        },
        { name: "Signout", action: handleSignOut, icon: MdExitToApp },
      ],
    },
  ];

  return (
    <>
      <Preline />
      <section className="flex gap-6 fixed top-20 left-0 bottom-0 z-50 border-r border-gray-700">
        <div
          className={`bg-gray-900 z-50 min-h-screen ${
            isSidebarOpen ? "w-64" : "w-20"
          } duration-300 text-gray-100 px-4`}
        >
          <div className="py-3 flex justify-end">
            <div className="bg-purple-700 rounded-full">
              <MdKeyboardArrowLeft
                size={26}
                className={`cursor-pointer transition-transform duration-300 ${
                  isSidebarOpen ? "" : "rotate-180"
                }`}
                onClick={toggleSidebar}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 relative">
            {menu?.map((menuItem, i) => (
              <React.Fragment key={i}>
                {menuItem.submenu ? (
                  <div className="relative group mt-20 z-50">
                    <div
                      className={`group z-50 flex items-center cursor-pointer text-sm gap-3.5 font-medium p-2 hover:bg-purple-800 rounded-md`}
                      onClick={toggleAccountSettings}
                    >
                      <div>
                        {React.createElement(menuItem.icon, { size: "24" })}
                      </div>
                      <h2
                        className={`whitespace-pre duration-500 ${
                          !isSidebarOpen &&
                          "opacity-0 translate-x-20 overflow-hidden"
                        }`}
                      >
                        {menuItem.name}
                      </h2>
                      <h2
                        className={`${
                          isSidebarOpen && "hidden"
                        } absolute z-50 left-20 bg-transparent font-semibold whitespace- text-white rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                      >
                        {menuItem.name}
                      </h2>
                    </div>
                    {isAccountSettingsOpen && (
                      <div
                        className={`absolute flex flex-col gap-4 top-full left-3 bg-gray-900 shadow-lg rounded-md p-2 mt-1 ${
                          isSidebarOpen ? "w-full" : "w-max"
                        }`}
                      >
                        {menuItem.submenu.map((subMenuItem, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-3.5 text-sm font-medium p-2 bg-gray-900 hover:bg-purple-800 rounded-md cursor-pointer hover:text-gray-200"
                            onClick={() => {
                              subMenuItem.action && subMenuItem.action();
                              setIsAccountSettingsOpen(false);
                            }}
                          >
                            {React.createElement(subMenuItem.icon, {
                              size: "20",
                            })}
                            <span>{subMenuItem.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={menuItem.link}
                    className={`group z-50 flex items-center text-sm gap-3.5 font-medium p-2 rounded-md ${
                      menuItem.tab === tab
                        ? "bg-purple-800"
                        : "hover:bg-purple-800"
                    }`}
                  >
                    <div>
                      {React.createElement(menuItem.icon, { size: "24" })}
                    </div>
                    <h2
                      className={`whitespace-pre duration-500 ${
                        !isSidebarOpen &&
                        "opacity-0 translate-x-20 overflow-hidden"
                      }`}
                    >
                      {menuItem.name}
                    </h2>
                    <h2
                      className={`${
                        isSidebarOpen && "hidden"
                      } absolute left-20 z-40 bg-transparent font-semibold whitespace-pre-line text-white rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                    >
                      {menuItem.name}
                    </h2>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminSidebar;
