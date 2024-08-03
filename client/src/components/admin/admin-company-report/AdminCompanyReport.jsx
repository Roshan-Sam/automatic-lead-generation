import React, { useState, useEffect, useMemo } from "react";
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
import { FiChevronDown } from "react-icons/fi";
import config from "../../../Functions/config";
import { useMediaQuery } from "react-responsive";

const PURPLE_700 = "#6B46C1";

const sectors = [
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

const sectorOptions = ["All", ...sectors];
const statusOptions = ["All", "Active", "Inactive"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { sector, count, companies } = payload[0].payload;
    return (
      <div className="bg-gray-800 p-2 rounded max-w-[200px] text-white">
        <p className="text-base">
          <span className="font-semibold">Sector: </span>
          {sector}
        </p>
        <p className="text-sm ml-2 mt-2">
          <span className="text-teal-400">No of companies: </span>
          {count}
        </p>
        <p className="text-sm ml-2 mt-2">
          <span>Companies: </span>
          {companies.length > 0
            ? companies.join(", ")
            : "No companies available"}
        </p>
      </div>
    );
  }
  return null;
};

const AdminCompanyReport = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedSector, setSelectedSector] = useState("Select Sector");
  const [sectorDropdown, setSectorDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [brushIndex, setBrushIndex] = useState({ startIndex: 0, endIndex: 0 });

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}companies/`);
      if (res.status === 200) {
        const formattedCompanies = res.data.map((company) => ({
          company_name: company.company_name,
          sector: company.sector,
          status: company.status,
          register_date: company.register_date,
        }));
        setCompanies(formattedCompanies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector === "All" ? "Select Sector" : sector);
    setSectorDropdown(false);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status === "All" ? "Select Status" : status);
    setStatusDropdown(false);
  };

  const handleBrushChange = (startIndex, endIndex) => {
    setBrushIndex({ startIndex, endIndex });
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      return (
        (selectedSector === "Select Sector" ||
          company.sector.toLowerCase() === selectedSector.toLowerCase()) &&
        (selectedStatus === "Select Status" ||
          company.status.toLowerCase() === selectedStatus.toLowerCase())
      );
    });
  }, [companies, selectedSector, selectedStatus]);

  const aggregatedData = useMemo(() => {
    return sectors.map((sector) => {
      const sectorCompanies = filteredCompanies.filter(
        (company) => company.sector.toLowerCase() === sector
      );
      return {
        sector,
        count: sectorCompanies.length,
        companies: sectorCompanies.map((company) => company.company_name),
      };
    });
  }, [filteredCompanies]);

  const isMediumScreenOrBelow = useMediaQuery({ query: "(max-width: 1500px)" });

  useEffect(() => {
    setBrushIndex((prevState) => ({
      ...prevState,
      endIndex: aggregatedData.length - 1,
    }));
  }, []);

  return (
    <div className="px-4 bg-[rgb(16,23,42)] min-h-screen overflow-auto">
      <h1 className="text-2xl text-white mb-4">Company Report</h1>
      <div className="flex mb-8 md:justify-start justify-center flex-wrap md:gap-4 gap-2">
        <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
          <button
            onClick={() => {
              setSectorDropdown(!sectorDropdown);
              setStatusDropdown(false);
            }}
            className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
          >
            <span className="pr-4 text-sm text-white">{selectedSector}</span>
            <FiChevronDown
              id="rotate1"
              className="absolute z-10 cursor-pointer right-5 text-white"
              size={14}
            />
          </button>
          <div
            className={`absolute right-0 z-20 ${
              sectorDropdown ? "" : "hidden"
            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
          >
            {sectorOptions.map((sector, index) => (
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
        <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-two">
          <button
            onClick={() => {
              setStatusDropdown(!statusDropdown);
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
      </div>
      <div className="w-full mb-8 overflow-x-auto">
        <div className="w-full h-[800px]">
          {filteredCompanies.length === 0 ? (
            <div className="text-white text-center mt-40">
              No companies available for the selected sector / status.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={aggregatedData}
                margin={{
                  top: 20,
                  right: 40,
                  left: 0,
                  bottom: 140,
                }}
                barGap={10}
                barSize={50}
              >
                <XAxis
                  dataKey="sector"
                  stroke="white"
                  angle={isMediumScreenOrBelow ? -90 : 0}
                  dx={isMediumScreenOrBelow ? -10 : 0}
                  dy={isMediumScreenOrBelow ? 10 : 10}
                  textAnchor={isMediumScreenOrBelow ? "end" : "middle"}
                />
                <YAxis type="number" stroke="white" />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                />
                <Bar dataKey="count" fill={PURPLE_700}>
                  {aggregatedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PURPLE_700}
                      onMouseOver={(e) => (e.target.style.fill = PURPLE_700)}
                      onMouseOut={(e) => (e.target.style.fill = PURPLE_700)}
                    />
                  ))}
                </Bar>
                <Brush
                  dataKey="sector"
                  height={20}
                  stroke={PURPLE_700}
                  fill="#1A202C"
                  travellerWidth={15}
                  y={800 - 40}
                  startIndex={brushIndex.startIndex}
                  endIndex={brushIndex.endIndex}
                  onChange={({ startIndex, endIndex }) =>
                    handleBrushChange(startIndex, endIndex)
                  }
                  tickFormatter={(sector) => sector.substring(0, 3)}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCompanyReport;
