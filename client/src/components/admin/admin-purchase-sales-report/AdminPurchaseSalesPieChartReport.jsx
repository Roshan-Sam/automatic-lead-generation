import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import config from "../../../Functions/config";
import { FiChevronDown } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { useReactToPrint } from "react-to-print";
import { FaRegFilePdf } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

const AdminPurchaseSalesPieChartReport = () => {
  const chartRef = useRef(null);
  const [productPurchaseSales, setProductPurchaseSales] = useState([]);
  const [dataByMonth, setDataByMonth] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearDropdown, setYearDropdown] = useState(false);

  const PURPLE_700 = "#6B46C1";
  const WHITE = "#FFFFFF";

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const isSmallScreen = useMediaQuery({ query: "(max-width: 600px)" });
  const isMediumScreen = useMediaQuery({
    query: "(min-width: 601px) and (max-width: 1024px)",
  });
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1025px)" });

  useEffect(() => {
    fetchProductPurchaseSalesData();
  }, []);

  useEffect(() => {
    filterDataByYear(productPurchaseSales, selectedYear);
  }, [productPurchaseSales, selectedYear]);

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

  const filterDataByYear = (data, year) => {
    if (data.length > 0) {
      const months = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString("default", { month: "long" }),
        total_amount: 0,
        product_details: [],
      }));

      data
        .filter((item) => item.purchase_date.getFullYear() === year)
        .forEach((item) => {
          const monthIndex = item.purchase_date.getMonth();
          months[monthIndex].total_amount += Number(item.amount);
          months[monthIndex].product_details.push(item);
        });

      const totalAmountForYear = months.reduce(
        (sum, month) => sum + month.total_amount,
        0
      );
      const monthsWithPercentage = months.map((month) => ({
        ...month,
        percentage: totalAmountForYear
          ? (month.total_amount / totalAmountForYear) * 100
          : 0,
      }));

      setDataByMonth(
        monthsWithPercentage.filter((month) => month.percentage > 0)
      );
    } else {
      setDataByMonth([]);
    }
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setYearDropdown(false);
  };

  const customizedTooltip = useMemo(
    () =>
      ({ active, payload }) => {
        if (active && payload && payload.length) {
          const { product_details, month, total_amount, percentage } =
            payload[0].payload;

          const productCompanies = {};
          product_details.forEach((item) => {
            if (!productCompanies[item.product_name]) {
              productCompanies[item.product_name] = new Set();
            }
            productCompanies[item.product_name].add(item.company_name);
          });

          return (
            <div className="p-2 bg-gray-800 text-white rounded shadow-lg max-w-[200px]">
              <p className="font-semibold mb-1">{`${month} (${percentage.toFixed(
                2
              )}%)`}</p>
              <p className="font-semibold mb-2">
                Total Amount: ₹ {total_amount.toFixed(2)}
              </p>
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

  const handlePrint = useReactToPrint({
    content: () => chartRef.current,
    documentTitle: "Product-Purchase-Sales-Pie-Chart-Report",
  });

  const chartHeight = isSmallScreen
    ? 200
    : isMediumScreen
    ? 400
    : isLargeScreen
    ? 600
    : 400;

  return (
    <div className="px-4 bg-[rgb(16,23,42)] min-h-screen overflow-auto pt-10">
      <div className="flex md:gap-4 gap-2 mb-8 flex-wrap md:justify-start justify-center">
        <div className="relative w-36 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setYearDropdown(!yearDropdown);
              sete;
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
        <button
          onClick={handlePrint}
          className="py-2 px-4 text-white inline-flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
        >
          <FaRegFilePdf className="size-4 fill-white" />
          Export pdf / print
        </button>
      </div>
      <div className="flex flex-col items-center">
        {dataByMonth.length > 0 ? (
          <div
            className="w-full"
            style={{ height: chartHeight }}
            ref={chartRef}
          >
            <h1 className="text-gray-500 text-3xl">
              Product Purchase Sales Pie Chart Report
            </h1>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  labelLine={false}
                  data={dataByMonth}
                  dataKey="total_amount"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {dataByMonth.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PURPLE_700}
                      stroke={WHITE}
                    />
                  ))}
                </Pie>
                <Tooltip content={customizedTooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-white text-sm mt-20 text-center">
            No product purchase sales available in selected year.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPurchaseSalesPieChartReport;
