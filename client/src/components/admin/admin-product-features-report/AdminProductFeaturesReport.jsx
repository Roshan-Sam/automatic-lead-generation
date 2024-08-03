import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Brush,
} from "recharts";
import { useMediaQuery } from "react-responsive";
import { FiChevronDown } from "react-icons/fi"; // Ensure you import this icon
import config from "../../../Functions/config";

const AdminProductFeaturesReport = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [brushIndex, setBrushIndex] = useState({ startIndex: 0, endIndex: 0 });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/`
      );
      if (res.status === 200) {
        const { products, total_count } = res.data;
        setProducts(products);
        setTotalCount(total_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/add-category/`);
      if (res.status === 200) {
        setCategories(res.data.map((category) => category.name));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const categoryOptions = [
    "All",
    ...new Set(categories.map((category) => category)),
  ];

  const statuses = ["All", "In Stock", "Out of Stock", "Pre-Order"];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === "All" ? "Select Category" : category);
    setCategoryDropdown(false);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status === "All" ? "Select Status" : status);
    setStatusDropdown(false);
  };

  const handleBrushChange = (startIndex, endIndex) => {
    setBrushIndex({ startIndex, endIndex });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        (selectedCategory === "Select Category" ||
          product.category.name === selectedCategory) &&
        (selectedStatus === "Select Status" ||
          product.availability_status === selectedStatus)
      );
    });
  }, [products, selectedCategory, selectedStatus]);

  const data = useMemo(() => {
    return categories.map((category) => {
      const categoryProducts = filteredProducts.filter(
        (product) => product.category.name === category
      );
      return {
        name: category,
        count: categoryProducts.length,
        products: categoryProducts.map((product) => product.name),
      };
    });
  }, [categories, filteredProducts]);

  const PURPLE_700 = "#6B46C1";
  const WHITE = "#FFFFFF";
  const GRAY_900 = "#1A202C";

  const isMediumScreenOrBelow = useMediaQuery({ query: "(max-width: 1500px)" });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { count, products } = payload[0].payload;
      return (
        <div className="bg-gray-800 p-2 rounded max-w-[200px] text-white">
          <p className="">
            <span className="font-semibold text-base">Category: </span>
            {label}
          </p>
          <p className="mt-2 text-sm ml-2">
            <span className="text-teal-400">No of products: </span>
            {count}
          </p>
          <p className="text-sm mt-2 ml-2">
            <span className="">Products: </span>
            {products.length > 0
              ? products.join(", ")
              : "No products available"}
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setBrushIndex((prevState) => ({
      ...prevState,
      endIndex: categories.length - 1,
    }));
  }, [categories]);

  const allCategoriesCountZero = data.every((category) => category.count === 0);

  return (
    <div className="px-4 bg-[rgb(16,23,42)] min-h-screen overflow-auto">
      <h1 className="text-2xl text-white mb-4">Product Features Report</h1>
      <div className="flex mb-8 md:gap-4 gap-2 flex-wrap md:justify-start justify-center">
        <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setCategoryDropdown(!categoryDropdown);
              setStatusDropdown(false);
            }}
            className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
          >
            <span className="pr-4 text-sm text-white">{selectedCategory}</span>
            <FiChevronDown
              id="rotate1"
              className="absolute z-10 cursor-pointer right-5 text-white"
              size={14}
            />
          </button>
          <div
            className={`absolute right-0 z-20 ${
              categoryDropdown ? "" : "hidden"
            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
          >
            {categoryOptions.map((category, index) => (
              <a key={index}>
                <p
                  className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </p>
              </a>
            ))}
          </div>
        </div>
        <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-two">
          <button
            onClick={() => {
              setStatusDropdown(!statusDropdown);
              setCategoryDropdown(false);
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
            {statuses.map((status, index) => (
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
      </div>
      <div className="w-full mb-8 overflow-x-auto">
        <div className="w-full h-[800px]">
          {data.length === 0 || allCategoriesCountZero ? (
            <div className="text-white text-center mt-40">
              No products available for the selected category / status.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 40, left: 0, bottom: 140 }}
                barGap={10}
                barSize={50}
              >
                <XAxis
                  dataKey="name"
                  stroke={WHITE}
                  angle={isMediumScreenOrBelow ? -90 : 0}
                  dx={isMediumScreenOrBelow ? -10 : 0}
                  dy={isMediumScreenOrBelow ? 10 : 10}
                  textAnchor={isMediumScreenOrBelow ? "end" : "middle"}
                />
                <YAxis stroke={WHITE} />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="count" fill={PURPLE_700}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PURPLE_700}
                      onMouseOver={(e) => (e.target.style.fill = PURPLE_700)}
                      onMouseOut={(e) => (e.target.style.fill = PURPLE_700)}
                    />
                  ))}
                </Bar>
                <Brush
                  dataKey="name"
                  height={20}
                  y={800 - 80}
                  stroke={PURPLE_700}
                  fill={GRAY_900}
                  travellerWidth={15}
                  startIndex={brushIndex.startIndex}
                  endIndex={brushIndex.endIndex}
                  onChange={({ startIndex, endIndex }) =>
                    handleBrushChange(startIndex, endIndex)
                  }
                  tickFormatter={(name) => name.substring(0, 3)}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductFeaturesReport;
