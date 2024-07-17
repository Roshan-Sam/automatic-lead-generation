import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FiChevronDown } from "react-icons/fi";
import config from "../../../Functions/config";
import { useMediaQuery } from "react-responsive";

const PURPLE_700 = "#6B46C1";

const sectorMapping = {
  tech: 2,
  finance: 3,
  healthcare: 4,
  education: 5,
  "real-estate": 6,
  energy: 7,
  "consumer-goods": 8,
  utilities: 9,
  industrials: 10,
  telecom: 11,
};

const sectorOptions = ["All", ...Object.keys(sectorMapping)];

const statusOptions = ["All", "Active", "Inactive"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { sector, count, companies } = payload[0].payload;
    return (
      <div className="bg-gray-800 p-2 rounded">
        <p className="text-white">{`Sector: ${sector}`}</p>
        <p className="text-white">{`Companies: ${count}`}</p>
        <p className="text-white">{`Company Names: ${companies.join(", ")}`}</p>
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

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}companies/`);
      if (res.status === 200) {
        const formattedCompanies = res.data.map((company) => ({
          company_name: company.company_name,
          sector: company.sector,
          status: company.status,
          register_date: company.register_date,
          sector_value: sectorMapping[company.sector.toLowerCase()],
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

  const filteredCompanies = companies.filter((company) => {
    return (
      (selectedSector === "Select Sector" ||
        company.sector.toLowerCase() === selectedSector.toLowerCase()) &&
      (selectedStatus === "Select Status" ||
        company.status.toLowerCase() === selectedStatus.toLowerCase())
    );
  });

  const aggregatedData = Object.keys(sectorMapping).map((sector) => {
    const sectorCompanies = filteredCompanies.filter(
      (company) => company.sector.toLowerCase() === sector
    );
    return {
      sector,
      count: sectorCompanies.length,
      companies: sectorCompanies.map((company) => company.company_name),
    };
  });

  const isMediumScreenOrBelow = useMediaQuery({ query: "(max-width: 1500px)" });

  return (
    <div className="px-4 bg-[rgb(16,23,42)] min-h-screen overflow-auto">
      <h1 className="text-2xl text-white mb-4">Company Report</h1>
      <div className="flex space-x-4 mb-8">
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
        <div className="min-w-[1200px] h-[800px]">
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
                  right: 20,
                  left: 10,
                  bottom: 140,
                }}
              >
                <XAxis
                  dataKey="sector"
                  type="category"
                  stroke="white"
                  angle={isMediumScreenOrBelow ? -45 : 0}
                  dx={isMediumScreenOrBelow ? -10 : 0}
                  dy={isMediumScreenOrBelow ? 10 : 10}
                  textAnchor={isMediumScreenOrBelow ? "end" : "middle"}
                />
                <YAxis type="number" stroke="white" />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                />
                <Bar dataKey="count" fill={PURPLE_700} barSize={80}>
                  {aggregatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PURPLE_700} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCompanyReport;
