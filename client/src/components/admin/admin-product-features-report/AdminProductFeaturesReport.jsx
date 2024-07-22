import { useState, useEffect } from "react";
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
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category.name)),
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

  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === "Select Category" ||
        product.category.name === selectedCategory) &&
      (selectedStatus === "Select Status" ||
        product.availability_status === selectedStatus)
    );
  });

  const data = filteredProducts.map((product) => ({
    name: product.name,
    features: product.features.split(", ").length,
  }));

  const PURPLE_700 = "#6B46C1";
  const WHITE = "#FFFFFF";
  const GRAY_900 = "#1A202C";

  const isMediumScreenOrBelow = useMediaQuery({ query: "(max-width: 1500px)" });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded">
          <p className="text-white">{`Product: ${label}`}</p>
          <p className="text-white">{`Features: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-4 bg-[rgb(16,23,42)] min-h-screen overflow-auto">
      <h1 className="text-2xl text-white mb-4">Product Features Report</h1>
      <div className="flex space-x-4 mb-8">
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
            {categories.map((category, index) => (
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
          {data.length === 0 ? (
            <div className="text-white text-center mt-40">
              No products available for the selected category / status.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 75, left: 40, bottom: 140 }}
                barGap={10}
                barSize={80}
              >
                <XAxis
                  dataKey="name"
                  stroke={WHITE}
                  angle={isMediumScreenOrBelow ? -45 : 0}
                  dx={isMediumScreenOrBelow ? -10 : 0}
                  dy={isMediumScreenOrBelow ? 10 : 10}
                  textAnchor={isMediumScreenOrBelow ? "end" : "middle"}
                />
                <YAxis stroke={WHITE} />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="features" fill={PURPLE_700}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PURPLE_700} />
                  ))}
                </Bar>
                <Brush
                  dataKey="name"
                  height={20}
                  y={800 - 80}
                  stroke={PURPLE_700}
                  fill={GRAY_900}
                  travellerWidth={15}
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
