import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";

const COLORS = ["#00BBA7", "#FF7A59", "#FFBB28", "#FF8042", "#00C49F", "#8884d8"];

const SellingStatistics = () => {
    const { user } = useContext(AuthContext);

    const { data, isLoading } = useQuery({
        queryKey: ["soldProperties", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/sold-properties?agentEmail=${user.email}`
            );
            return res.data;
        },
    });

    const soldProperties = data?.soldProperties || [];

    if (isLoading) return <LoadingFallback />;

    const chartData = soldProperties.map((item, index) => ({
        id: item.propertyId,
        title: item.propertyTitle,
        price: item.amountPaid,
        color: COLORS[index % COLORS.length],
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { title, price, id } = payload[0].payload;
            return (
                <div className="p-3 rounded bg-base-200 border border-base-300 shadow">
                    <p className="font-bold">{title}</p>
                    <p>Sold Price: ${price}</p>
                    <Link to={`/property/${id}`} className="text-[#00BBA7] underline">
                        View Details
                    </Link>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="container mx-auto p-4 space-y-12">
            <Helmet>
                <title>Selling Statistics | RealEstate</title>
            </Helmet>
            <h2 className="text-3xl font-bold mb-4 text-[#00BBA7]">Selling Statistics</h2>

            {/* Bar Chart */}
            {/* <div className="bg-base-200 rounded-lg p-4 shadow border border-base-300">
                <h3 className="text-xl font-semibold mb-2">Bar Chart</h3>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="price" fill="#00BBA7" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-8">No sold properties found.</p>
                )}
            </div> */}

            {/* Line Chart */}
            {/* <div className="bg-base-200 rounded-lg p-4 shadow border border-base-300">
                <h3 className="text-xl font-semibold mb-2">Line Chart</h3>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="price" stroke="#00BBA7" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-8">No sold properties found.</p>
                )}
            </div> */}

            {/* Pie Chart */}
            <div className="bg-base-200 rounded-lg p-4 shadow border border-base-300">
                <h3 className="text-xl font-semibold mb-2">Pie Chart</h3>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Tooltip />
                            <Legend />
                            <Pie
                                data={chartData}
                                dataKey="price"
                                nameKey="title"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-8">No sold properties found.</p>
                )}
            </div>
        </section>
    );
};

export default SellingStatistics;
