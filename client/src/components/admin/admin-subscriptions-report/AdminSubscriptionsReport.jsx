import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import config from "../../../Functions/config";
import { FiChevronDown } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";

const AdminSubscriptionsReport = () => {
  const [companySubscriptions, setCompanySubscriptions] = useState([]);
  const [dataByMonth, setDataByMonth] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("Select Company");
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [selectedProduct, setSelectedProduct] = useState("Select Product");
  const [companyDropdown, setCompanyDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [productDropdown, setProductDropdown] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const statusOptions = ["All", "Active", "Pending", "Inactive", "Canceled"];

  const fetchCompanySubscriptions = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/subscriptions/`);
      if (res.status === 200) {
        const { company_subscriptions } = res.data;
        const currentYear = new Date().getFullYear();

        const transformedSubscriptions = company_subscriptions
          .filter((sub) => {
            const startYear = new Date(sub.start_date).getFullYear();
            return startYear === currentYear;
          })
          .map((sub) => ({
            company: sub.company.company_name,
            start_date: sub.start_date,
            end_date: sub.end_date,
            subscription_plan: sub.subscription_plan.plan_name,
            product: sub.subscription_plan.product.name,
            status: sub.status,
          }));

        setCompanySubscriptions(transformedSubscriptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompaniesAndPlans = async () => {
    try {
      const companyRes = await axios.get(`${config.baseApiUrl}companies/`);
      const companyNames = companyRes.data.map(
        (company) => company.company_name
      );
      companyNames.unshift("All");
      setCompanies(companyNames);

      const productRes = await axios.get(
        `${config.baseApiUrl}admin/product-features/`
      );
      const productNames = productRes.data.products.map(
        (product) => product.name
      );
      productNames.unshift("All");
      setProducts(productNames);

      const planRes = await axios.get(`${config.baseApiUrl}admin/add-plan/`);
      const planNames = planRes.data.map((plan) => plan.name);
      setPlans(planNames);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanySubscriptions();
    fetchCompaniesAndPlans();
  }, []);

  useEffect(() => {
    if (companySubscriptions.length > 0) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthData = months.map((month) => ({
        month,
        ...Object.fromEntries(plans.map((plan) => [plan, 0])),
        details: Object.fromEntries(plans.map((plan) => [plan, []])),
      }));

      companySubscriptions
        .filter((sub) => {
          return (
            (selectedCompany === "Select Company" ||
              sub.company === selectedCompany) &&
            (selectedStatus === "Select Status" ||
              sub.status === selectedStatus) &&
            (selectedProduct === "Select Product" ||
              sub.product === selectedProduct)
          );
        })
        .forEach((sub) => {
          const startMonth = new Date(sub.start_date).getMonth();
          const plan = sub.subscription_plan;
          if (plans.includes(plan)) {
            const existingIndex = monthData[startMonth].details[plan].findIndex(
              (item) =>
                item.company === sub.company && item.product === sub.product
            );
            if (existingIndex === -1) {
              monthData[startMonth][plan] += 1;
              monthData[startMonth].details[plan].push({
                company: sub.company,
                product: sub.product,
              });
            }
          }
        });

      setDataByMonth(monthData);
    }
  }, [
    companySubscriptions,
    plans,
    selectedCompany,
    selectedStatus,
    selectedProduct,
  ]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company === "All" ? "Select Company" : company);
    setCompanyDropdown(false);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status === "All" ? "Select Status" : status);
    setStatusDropdown(false);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product === "All" ? "Select Product" : product);
    setProductDropdown(false);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-gray-800 text-white rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {Object.keys(data.details).map((plan) => {
            const uniqueCompanies =
              Array.from(
                new Set(data.details[plan].map((item) => item.company))
              ).join(", ") || "No companies";
            const uniqueProducts =
              Array.from(
                new Set(data.details[plan].map((item) => item.product))
              ).join(", ") || "No products";
            return (
              <div key={plan} className="mt-2">
                <p className="font-semibold">
                  {plan} ({data[plan]}):
                </p>
                <p className="text-sm">Companies: {uniqueCompanies}</p>
                <p className="text-sm">Products: {uniqueProducts}</p>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  const isMediumScreenOrBelow = useMediaQuery({ query: "(max-width: 1500px)" });

  const PURPLE_700 = "#6B46C1";
  const ORANGE_700 = "#DD6B20";
  const BLUE_700 = "#4535C1";
  const WHITE = "#FFFFFF";

  const getBarColor = (plan) => {
    switch (plan) {
      case "Basic":
        return PURPLE_700;
      case "Standard":
        return ORANGE_700;
      case "Premium":
        return BLUE_700;
      default:
        return "#8884d8";
    }
  };

  console.log(dataByMonth);

  return (
    <div className="px-4 bg-[rgb(16,23,42)] min-h-screen overflow-auto">
      <h1 className="text-white text-2xl mb-4">Company Subscription Plans</h1>
      <div className="flex space-x-4 mb-8">
        <div className="relative w-64 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setCompanyDropdown(!companyDropdown);
              setStatusDropdown(false);
              setProductDropdown(false);
            }}
            className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
          >
            <span className="pr-4 text-sm text-white">{selectedCompany}</span>
            <FiChevronDown
              id="rotate1"
              className="absolute z-10 cursor-pointer right-5 text-white"
              size={14}
            />
          </button>
          <div
            className={`absolute right-0 z-20 ${
              companyDropdown ? "" : "hidden"
            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
          >
            {companies.map((company, index) => (
              <a key={index}>
                <p
                  className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                  onClick={() => handleCompanySelect(company)}
                >
                  {company}
                </p>
              </a>
            ))}
          </div>
        </div>
        <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setStatusDropdown(!statusDropdown);
              setCompanyDropdown(false);
              setProductDropdown(false);
            }}
            className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
          >
            <span className="pr-4 text-sm text-white">{selectedStatus}</span>
            <FiChevronDown
              id="rotate2"
              className="absolute z-10 cursor-pointer right-5 text-white"
              size={14}
            />
          </button>
          <div
            className={`absolute right-0 z-20 ${
              statusDropdown ? "" : "hidden"
            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
          >
            {statusOptions.map((status, index) => (
              <a key={index}>
                <p
                  className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                  onClick={() => handleStatusSelect(status)}
                >
                  {status}
                </p>
              </a>
            ))}
          </div>
        </div>
        <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setProductDropdown(!productDropdown);
              setCompanyDropdown(false);
              setStatusDropdown(false);
            }}
            className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
          >
            <span className="pr-4 text-sm text-white">{selectedProduct}</span>
            <FiChevronDown
              id="rotate3"
              className="absolute z-10 cursor-pointer right-5 text-white"
              size={14}
            />
          </button>
          <div
            className={`absolute right-0 z-20 ${
              productDropdown ? "" : "hidden"
            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
          >
            {products.map((product, index) => (
              <a key={index}>
                <p
                  className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                  onClick={() => handleProductSelect(product)}
                >
                  {product}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-[800px]">
        {dataByMonth.length === 0 ? (
          <div className="text-white text-center mt-40">
            No subscription plans available for the selected company / status /
            product.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByMonth}
              margin={{ top: 20, right: 20, left: 10, bottom: 140 }}
            >
              <Legend
                wrapperStyle={{
                  color: "white",
                  fontSize: "18px",
                  bottom: "50px",
                }}
                align="center"
                verticalAlign="bottom"
                layout="horizontal"
                iconSize={10}
                iconType="circle"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "white" }}
                stroke={WHITE}
                angle={isMediumScreenOrBelow ? -80 : 0}
                dx={isMediumScreenOrBelow ? -10 : 0}
                dy={isMediumScreenOrBelow ? 10 : 10}
                textAnchor={isMediumScreenOrBelow ? "end" : "middle"}
              />
              <YAxis tick={{ fill: "white" }} stroke={WHITE} />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                content={<CustomTooltip />}
              />
              {plans.map((plan) => (
                <Bar key={plan} dataKey={plan} fill={getBarColor(plan)} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionsReport;
