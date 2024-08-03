import { useState, useEffect, useMemo, useRef } from "react";
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
import { FiSearch } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { FaRegFilePdf } from "react-icons/fa";

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

const AdminPurchaseSalesBarChartReport = () => {
  const chartRef = useRef(null);
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
  const GRAY_900 = "#1A202C";
  const GRAY_700 = "#4A5568";
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);
  const isMediumScreenOrBelow = useMediaQuery({ query: "(max-width: 1500px)" });

  const isSmallScreen = useMediaQuery({ query: "(max-width: 600px)" });
  const isMediumScreen = useMediaQuery({
    query: "(min-width: 601px) and (max-width: 1024px)",
  });
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1025px)" });

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
              <p className="font-semibold mb-2 text-gray-500">{`${label} (${payload[0].value} Purchases)`}</p>
              {Object.keys(productCompanies).map((product, index) => (
                <div key={index} className="text-sm mb-2 text-gray-500">
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

  const handlePrint = useReactToPrint({
    content: () => chartRef.current,
    documentTitle: "Product-Purchase-Sales-Bar-Chart-Report",
  });

  const chartHeight = isSmallScreen
    ? 500
    : isMediumScreen
    ? 500
    : isLargeScreen
    ? 500
    : 500;

  return (
    <div className="px-4 bg-[rgb(16,23,42)] min-h-screen overflow-auto pt-10">
      <div className="flex md:gap-4 gap-2 mb-4 flex-wrap md:justify-start justify-center">
        <div className="relative w-64 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setCompanyDropdown(!companyDropdown);
              setStatusDropdown(false);
              setProductDropdown(false);
              setYearDropdown(false);
              setSectorDropdown(false);
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
      <div className="flex gap-2 mb-4 flex-wrap md:justify-start justify-center">
        <div className="relative max-w-screen-md flex-grow">
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
        <button
          onClick={handlePrint}
          className="py-2 px-4 text-white flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
        >
          <FaRegFilePdf className="size-4 fill-white" />
          Export pdf / print
        </button>
      </div>
      {allProductCountsZero() ? (
        <p className="text-white text-center mt-40">
          No product purchase sales available for the selected company / status
          / product / year / sector.{" "}
        </p>
      ) : (
        <div
          className="w-full mb-10"
          ref={chartRef}
          style={{ height: chartHeight }}
        >
          <h1 className="text-gray-500 text-3xl mb-10">
            Product Purchase Sales Bar Chart Report
          </h1>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByMonth}
              className="text-white"
              margin={{ top: 20, right: 75, left: 40, bottom: 140 }}
            >
              <XAxis
                dataKey="month"
                stroke={GRAY_700}
                tick={{ fill: "#4A5568" }}
                angle={isMediumScreenOrBelow ? -90 : 0}
                dx={isMediumScreenOrBelow ? -10 : 0}
                dy={isMediumScreenOrBelow ? 10 : 10}
                textAnchor={isMediumScreenOrBelow ? "end" : "middle"}
              />
              <YAxis stroke={GRAY_700} tick={{ fill: "#4A5568" }} />
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
              <Bar
                dataKey="product_count"
                barSize={50}
                name="Product Purchases"
              >
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
                y={chartHeight - 110}
                fill={GRAY_900}
                travellerWidth={15}
                tickFormatter={(month) => month.substring(0, 3)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminPurchaseSalesBarChartReport;
