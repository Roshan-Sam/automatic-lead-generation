import Cookies from "js-cookie";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiBell, FiZap, FiUser, FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useAdminProfileContext } from "../../../hooks/useAdminProfileContext";

const AdminNav = () => {
  const { profile } = useAdminProfileContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [tab, setTab] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const handleSignOut = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <div className="z-50" onMouseLeave={() => setDropdownOpen(false)}>
      <header className="fixed top-0 left-0 right-0 h-20 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-[rgb(16,23,42)] border-b border-gray-700 text-sm py-2.5 sm:py-4 dark:bg-neutral-950 dark:border-neutral-700">
        <nav
          className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Global"
        >
          <div className="me-5 md:me-8 flex">
            <a
              className="flex-none text-2xl font-semibold text-white"
              href="#"
              aria-label="Brand"
            >
              Admin Dash
            </a>
          </div>

          <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
            <div className="flex flex-row items-center justify-end gap-2 ml-auto">
              <button
                type="button"
                className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                <FiBell className="flex-shrink-0 size-4" />
              </button>
              <button
                type="button"
                className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
                data-hs-offcanvas="#hs-offcanvas-right"
              >
                <FiZap className="flex-shrink-0 size-4" />
              </button>

              <div className="relative inline-flex">
                <button
                  onClick={() => toggleDropdown()}
                  type="button"
                  className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
                >
                  <img
                    className="inline-block size-[38px] rounded-full object-cover"
                    src={`${import.meta.env.VITE_API_IMAGE_URL}${
                      profile.profile
                    }`}
                    alt={profile.username}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-12 w-48 bg-gray-900 border border-gray-700 shadow-lg rounded-lg p-2 z-10"
                  >
                    <div className="py-3 px-5 -m-2 bg-gray-900 rounded-t-lg border-b border-b-gray-700">
                      <p className="text-sm text-white">Signed in as</p>
                      <p className="text-sm font-medium text-white">
                        {profile.username}
                      </p>
                    </div>
                    <div className="mt-2 py-2 first:pt-0 last:pb-0">
                      <Link
                        to="/admin-dash?tab=account"
                        className={`flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-white hover:bg-purple-600 ${
                          tab === "account" ? "bg-purple-600" : ""
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser className="flex-shrink-0 size-4" />
                        Account
                      </Link>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-white hover:bg-purple-600 w-full"
                    >
                      <FiArrowRight className="flex-shrink-0 size-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default AdminNav;
