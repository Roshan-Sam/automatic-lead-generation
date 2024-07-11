import React from "react";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const Report = () => {

    const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext()

    const sidebarToggle = () => {
        sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
    };

    const data = [
        {
          name: 'Jan', Adobe: 4000, 'Basic Netflix Plan': 2400, 'Premium Netflix Plan': 1200, Peloton: 2400,
        },
        {
          name: 'Feb', Adobe: 3000, 'Basic Netflix Plan': 1398, 'Premium Netflix Plan': 900, Peloton: 2210,
        },
        {
          name: 'Mar', Adobe: 2000, 'Basic Netflix Plan': 9800, 'Premium Netflix Plan': 5000, Peloton: 2290,
        },
        {
          name: 'Apr', Adobe: 2780, 'Basic Netflix Plan': 3908, 'Premium Netflix Plan': 1800, Peloton: 2000,
        },
        {
          name: 'May', Adobe: 1890, 'Basic Netflix Plan': 4800, 'Premium Netflix Plan': 2300, Peloton: 2181,
        },
        {
          name: 'Jun', Adobe: 2390, 'Basic Netflix Plan': 3800, 'Premium Netflix Plan': 1600, Peloton: 2500,
        },
        {
          name: 'Jul', Adobe: 3490, 'Basic Netflix Plan': 4300, 'Premium Netflix Plan': 2100, Peloton: 2100,
        },
    ];
      

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57', '#8dd1e1', '#ffbb28', '#ff8042', '#d0d0d0'];

    const assignColorsToPlans = (plans) => {
        const planColors = {};
        plans.forEach((plan, index) => {
            planColors[plan] = colors[index % colors.length];
        });
        return planColors;
    };

    const subscriptionPlans = ['Adobe', 'Basic Netflix Plan', 'Premium Netflix Plan', 'Peloton', 'Spotify', 'Disney+'];
    const planColors = assignColorsToPlans(subscriptionPlans);

    return (
        <>
            <div className="bg-[rgb(16,23,42)]">
                <AdminNav />
                <div className="flex min-h-screen pt-20">
                    <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-50">
                        <AdminSidebar sidebarToggle={sidebarToggle} />
                    </div>
                    <div
                        className={`flex-1 min-h-screen overflow-auto transition-all duration-300 z-40 ${isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
                            }`}
                    >

                        <div className="bg-red-400">helloii</div>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                width={600}
                                height={300}
                                data={data}
                                margin={{
                                    top: 20, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {subscriptionPlans.map((plan) => (
                                    <Bar key={plan} dataKey={plan} fill={planColors[plan]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </>
    )
}

export default Report