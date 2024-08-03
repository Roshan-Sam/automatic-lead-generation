import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import config from "../../../Functions/config";
import { FiChevronDown } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
  Cell,
} from "recharts";
import { FiSearch, FiXCircle } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import emailjs from "@emailjs/browser";
import gmailIcon from "../../../icons/gmail_icon.png";
import whatsAppIcon from "../../../icons/whatsapp-icon.png";
import { WhatsappShareButton } from "react-share";
import { FaCheckCircle } from "react-icons/fa";

const sectorOptions = [
  "tech",
  "finance",
  "healthcare",
  "education",
  "real-estate",
  "energy",
  "consumer-goods",
  "utilities",
  "industrials",
  "telecom",
];

const sectors = ["All", ...sectorOptions];

const AdminPurchaseSalesReport = () => {
  const [productPurchaseSales, setProductPurchaseSales] = useState([]);
  const [dataByMonth, setDataByMonth] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState("Select Company");
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [selectedProduct, setSelectedProduct] = useState("Select Product");
  const [selectedSector, setSelectedSector] = useState("Select Sector");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [companyDropdown, setCompanyDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [productDropdown, setProductDropdown] = useState(false);
  const [yearDropdown, setYearDropdown] = useState(false);
  const [sectorDropdown, setSectorDropdown] = useState(false);
  const [brushIndex, setBrushIndex] = useState({ startIndex: 0, endIndex: 11 });
  const [searchTerm, setSearchTerm] = useState("");

  const statusOptions = ["All", "Pending", "Completed"];
  const PURPLE_700 = "#6B46C1";
  const WHITE = "#FFFFFF";
  const GRAY_900 = "#1A202C";
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);
  const isMediumScreenOrBelow = useMediaQuery({ query: "(max-width: 1500px)" });

  const [barEmailDropdownOpen, setBarEmailDropdownOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [suggestedEmails, setSuggestedEmails] = useState([
    "roshansamchirathalackal9898@gmail.com",
    "roshansamchira9898@gmail.com",
  ]);

  const [barSuccess, setBarSuccess] = useState("");
  const [barError, setBarError] = useState("");

  useEffect(() => {
    fetchProductPurchaseSalesData();
    fetchCompaniesAndProducts();
  }, []);

  useEffect(() => {
    filterDataByYear(productPurchaseSales, selectedYear);
  }, [
    productPurchaseSales,
    selectedCompany,
    selectedStatus,
    selectedProduct,
    selectedSector,
    selectedYear,
    searchTerm,
  ]);

  const fetchProductPurchaseSalesData = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-purchase-sales/`
      );
      if (res.status === 200) {
        const { purchases, total_count } = res.data;
        const transformedData = purchases.map((purchase) => ({
          amount: purchase.amount,
          company_name: purchase.company.company_name,
          sector: purchase.company.sector,
          product_name: purchase.product.name,
          quantity: purchase.quantity,
          status: purchase.status,
          purchase_date: new Date(purchase.purchase_date),
        }));
        setProductPurchaseSales(transformedData);
        setTotalCount(total_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompaniesAndProducts = async () => {
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
    } catch (error) {
      console.log(error);
    }
  };

  const filterDataByYear = (data, year) => {
    if (data.length > 0) {
      const months = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString("default", { month: "long" }),
        product_count: 0,
        product_details: [],
      }));

      data
        .filter((item) => {
          const purchaseYear = item.purchase_date.getFullYear();
          const searchTermLower = searchTerm.toLowerCase();
          return (
            purchaseYear === year &&
            (selectedCompany === "Select Company" ||
              item.company_name === selectedCompany) &&
            (selectedStatus === "Select Status" ||
              item.status === selectedStatus) &&
            (selectedProduct === "Select Product" ||
              item.product_name === selectedProduct) &&
            (selectedSector === "Select Sector" ||
              item.sector === selectedSector) &&
            (searchTerm === "" ||
              item.company_name.toLowerCase().includes(searchTermLower) ||
              item.sector.toLowerCase().includes(searchTermLower) ||
              item.product_name.toLowerCase().includes(searchTermLower) ||
              item.status.toLowerCase().includes(searchTermLower))
          );
        })
        .forEach((item) => {
          const monthIndex = item.purchase_date.getMonth();
          months[monthIndex].product_count += item.quantity;
          months[monthIndex].product_details.push(item);
        });

      setDataByMonth(months);
    }
  };

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

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setYearDropdown(false);
  };

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector === "All" ? "Select Sector" : sector);
    setSectorDropdown(false);
  };

  const handleBrushChange = (startIndex, endIndex) => {
    setBrushIndex({ startIndex, endIndex });
  };

  const customizedTooltip = useMemo(
    () =>
      ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          const { product_details } = payload[0].payload;

          const productCompanies = {};
          product_details.forEach((item) => {
            if (!productCompanies[item.product_name]) {
              productCompanies[item.product_name] = new Set();
            }
            productCompanies[item.product_name].add(item.company_name);
          });

          return (
            <div className="p-2 bg-gray-800 text-white rounded shadow-lg max-w-[200px]">
              <p className="font-semibold mb-2">{`${label} (${payload[0].value} Purchases)`}</p>
              {Object.keys(productCompanies).map((product, index) => (
                <div key={index} className="text-sm mb-2">
                  <p className="font-semibold">{product}:</p>
                  <p className="pl-2 text-sm mt-1">
                    <span className="text-teal-400">Companies:</span>{" "}
                    {Array.from(productCompanies[product]).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          );
        }
        return null;
      },
    []
  );

  const allProductCountsZero = () => {
    return dataByMonth.every((item) => item.product_count === 0);
  };

  useEffect(() => {
    allProductCountsZero();
  }, [dataByMonth]);

  const renderCustomLegend = () => {
    return (
      <div
        style={{
          color: PURPLE_700,
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "50px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            marginRight: 5,
            width: 10,
            height: 10,
            backgroundColor: PURPLE_700,
            borderRadius: "50%",
          }}
        ></span>
        Product Purchases
      </div>
    );
  };

  const handleEmailSelect = (email) => {
    setEmailAddress(email);
  };

  const handleBarShare = async () => {
    if (!emailAddress) {
      setBarError("Please enter an email address.");
      setTimeout(() => {
        setBarError("");
      }, 3000);
      return;
    }

    const templateParams = {
      to_email: emailAddress,
      subject: "Product Purchase Sales Bar Chart Report",
      message: `Please check the product purchase sales bar chart report at the following link:\n\n${shareBarUrl}\n\nBest regards,\nAdmin`,
    };

    try {
      const response = await emailjs.send(
        config.service_id,
        config.template_id,
        templateParams,
        config.public_key
      );

      if (response.status === 200) {
        setBarSuccess("Email sent successfully.");
        setEmailAddress("");
        setTimeout(() => {
          setBarSuccess("");
          setBarEmailDropdownOpen(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const shareBarUrl =
    "http://localhost:5173/admin/product-purchase-sales-bar-chart-report";

  const barTitle = `Product Purchase Sales Bar Chart Report\n`;

  return (
    <div className="px-4 bg-[rgb(16,23,42)] min-h-screen overflow-auto">
      <h1 className="text-2xl text-white mb-4">
        Product Purchase Sales Bar Chart Report
      </h1>
      <div className="flex md:gap-4 gap-2 mb-4 flex-wrap md:justify-start justify-center">
        <div className="relative w-64 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setCompanyDropdown(!companyDropdown);
              setStatusDropdown(false);
              setProductDropdown(false);
              setYearDropdown(false);
              setSectorDropdown(false);
              setBarEmailDropdownOpen(false);
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
              setYearDropdown(false);
              setSectorDropdown(false);
              setBarEmailDropdownOpen(false);
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
        <div className="relative w-64 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setProductDropdown(!productDropdown);
              setCompanyDropdown(false);
              setStatusDropdown(false);
              setYearDropdown(false);
              setSectorDropdown(false);
              setBarEmailDropdownOpen(false);
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
        <div className="relative w-36 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setYearDropdown(!yearDropdown);
              setCompanyDropdown(false);
              setStatusDropdown(false);
              setProductDropdown(false);
              setSectorDropdown(false);
              setBarEmailDropdownOpen(false);
            }}
            className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
          >
            <span className="pr-4 text-sm text-white">{selectedYear}</span>
            <FiChevronDown
              id="rotate4"
              className="absolute z-10 cursor-pointer right-5 text-white"
              size={14}
            />
          </button>
          <div
            className={`absolute right-0 z-20 ${
              yearDropdown ? "" : "hidden"
            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
          >
            {yearOptions.map((year, index) => (
              <a key={index}>
                <p
                  className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </p>
              </a>
            ))}
          </div>
        </div>
        <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setSectorDropdown(!sectorDropdown);
              setYearDropdown(false);
              setCompanyDropdown(false);
              setStatusDropdown(false);
              setProductDropdown(false);
              setBarEmailDropdownOpen(false);
            }}
            className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
          >
            <span className="pr-4 text-sm text-white">{selectedSector}</span>
            <FiChevronDown
              id="rotate4"
              className="absolute z-10 cursor-pointer right-5 text-white"
              size={14}
            />
          </button>
          <div
            className={`absolute right-0 z-20 ${
              sectorDropdown ? "" : "hidden"
            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
          >
            {sectors.map((sector, index) => (
              <a key={index}>
                <p
                  className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                  onClick={() => handleSectorSelect(sector)}
                >
                  {sector}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="relative mb-4 max-w-screen-md">
        <input
          type="text"
          id="search"
          name="search"
          className="py-2 px-3 ps-11 text-white block w-full bg-slate-900 border-gray-700 rounded-lg text-sm focus:border-purple-600 focus:ring-purple-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="Search by product name, company name, status, sector"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
          <FiSearch className="flex-shrink-0 size-4 text-slate-400" />
        </div>
      </div>
      <div className="flex gap-4 md:justify-start justify-center flex-wrap mb-4">
        <div className="relative w-80 h-fit border border-gray-700 rounded-lg outline-none">
          <button
            onClick={() => {
              setBarEmailDropdownOpen(!barEmailDropdownOpen);
              setCompanyDropdown(false);
              setStatusDropdown(false);
              setProductDropdown(false);
              setYearDropdown(false);
              setSectorDropdown(false);
            }}
            className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
          >
            <span className="pr-4 text-sm text-white flex gap-2 items-center">
              Share via Email
              <img src={gmailIcon} alt="Gmail Icon" className="w-5" />
            </span>
            <FiChevronDown
              className="absolute z-10 cursor-pointer right-5 text-white"
              size={14}
            />
          </button>
          {barEmailDropdownOpen && (
            <div className="absolute right-0 z-20 w-full px-4 py-2 bg-slate-900 border border-gray-700 rounded shadow top-12">
              <div className="flex items-center gap-1">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-purple-700 focus:border-1 focus:ring-0 focus:outline-none"
                  placeholder="Type email address"
                />
                <MdClear
                  className="text-gray-400 size-6 mb-2 cursor-pointer"
                  onClick={() => {
                    setEmailAddress("");
                  }}
                />
              </div>
              <div className="max-h-32 overflow-y-scroll mt-2 select">
                {suggestedEmails.map((email, index) => (
                  <div
                    key={index}
                    className="p-2 text-sm leading-none text-white cursor-pointer hover:bg-gray-800 hover:font-medium hover:text-purple-600 hover:rounded"
                    onClick={() => handleEmailSelect(email)}
                  >
                    {email}
                  </div>
                ))}
              </div>
              <button
                className="flex gap-2 items-center justify-center w-full p-2 mt-4 text-sm text-white border border-slate-700 hover:bg-gray-800 rounded-lg"
                onClick={handleBarShare}
              >
                Share
                <img src={gmailIcon} alt="Gmail Icon" className="w-5" />
              </button>
              {barError ? (
                <p className="mt-2 flex items-center gap-2 text-red-500 text-sm justify-center">
                  <FiXCircle className="size-4" />
                  {barError}
                </p>
              ) : (
                ""
              )}
              {barSuccess ? (
                <p className="mt-2 flex items-center gap-2 text-green-400 text-sm justify-center">
                  <FaCheckCircle className="size-3" />
                  {barSuccess}
                </p>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
        <WhatsappShareButton url={shareBarUrl} title={barTitle}>
          <div className="relative w-72 h-fit border border-gray-700 rounded-lg outline-none cursor-pointer">
            <div className="relative flex items-center justify-center w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent">
              <span className="pr-4 text-sm text-white flex gap-2 items-center">
                Share via WhatsApp
                <img src={whatsAppIcon} alt="WhatsApp Icon" className="w-5" />
              </span>
            </div>
          </div>
        </WhatsappShareButton>
      </div>
      {allProductCountsZero() ? (
        <p className="text-white text-center mt-40">
          No product purchase sales available for the selected company / status
          / product / year / sector.{" "}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={800}>
          <BarChart
            data={dataByMonth}
            className="text-white"
            margin={{ top: 20, right: 40, left: 0, bottom: 140 }}
          >
            <XAxis
              dataKey="month"
              stroke={WHITE}
              tick={{ fill: "white" }}
              angle={isMediumScreenOrBelow ? -90 : 0}
              dx={isMediumScreenOrBelow ? -10 : 0}
              dy={isMediumScreenOrBelow ? 10 : 10}
              textAnchor={isMediumScreenOrBelow ? "end" : "middle"}
            />
            <YAxis stroke={WHITE} tick={{ fill: "white" }} />
            <Tooltip
              content={customizedTooltip}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Legend
              wrapperStyle={{
                bottom: "20px",
              }}
              verticalAlign="bottom"
              layout="horizontal"
              content={renderCustomLegend}
            />
            <Bar dataKey="product_count" barSize={50} name="Product Purchases">
              {dataByMonth.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PURPLE_700}
                  onMouseOver={(e) => (e.target.style.fill = PURPLE_700)}
                  onMouseOut={(e) => (e.target.style.fill = PURPLE_700)}
                />
              ))}
            </Bar>
            <Brush
              dataKey="month"
              stroke={PURPLE_700}
              startIndex={brushIndex.startIndex}
              endIndex={brushIndex.endIndex}
              onChange={({ startIndex, endIndex }) =>
                handleBrushChange(startIndex, endIndex)
              }
              height={20}
              y={800 - 110}
              fill={GRAY_900}
              travellerWidth={15}
              tickFormatter={(month) => month.substring(0, 3)}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminPurchaseSalesReport;
