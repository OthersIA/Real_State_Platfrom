import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Helmet } from "react-helmet-async";

const PropertyReports = () => {
    const queryClient = useQueryClient();
    const [viewReport, setViewReport] = useState(null);

    // Fetch all reports
    const { data: reports = [], isLoading, isError } = useQuery({
        queryKey: ["reports"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/reports`);
            return res.data;
        },
    });

    // ✅ Remove FULL property + reports + reviews + bookmarks, etc.
    const removePropertyAndReport = useMutation({
        mutationFn: async ({ propertyId }) => {
            await axios.delete(`${import.meta.env.VITE_API_URL}/all-reports/${propertyId}`);
        },
        onSuccess: () => {
            Swal.fire("Removed!", "Property and ALL its info have been deleted.", "success");
            queryClient.invalidateQueries(["reports"]);
            queryClient.invalidateQueries(["properties"]);
        },
        onError: () => {
            Swal.fire("Error!", "Failed to remove property.", "error");
        },
    });

    const handleRemoveProperty = (propertyId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Deleting this will permanently delete the property AND ALL related information in the database!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete everything!",
        }).then((result) => {
            if (result.isConfirmed) {
                removePropertyAndReport.mutate({ propertyId });
            }
        });
    };

    // ✅ Remove JUST report
    const removeReport = useMutation({
        mutationFn: async ({ reportId }) => {
            await axios.delete(`${import.meta.env.VITE_API_URL}/reports/${reportId}`);
        },
        onSuccess: () => {
            Swal.fire("Removed!", "The report has been deleted.", "success");
            queryClient.invalidateQueries(["reports"]);
        },
        onError: () => {
            Swal.fire("Error!", "Failed to delete report.", "error");
        },
    });

    const handleRemoveReport = (reportId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete JUST this report.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete report",
        }).then((result) => {
            if (result.isConfirmed) {
                removeReport.mutate({ reportId });
            }
        });
    };

    if (isLoading) return <LoadingFallback />;
    if (isError) return <p className="text-error">Failed to load reports.</p>;

    return (
        <section className="container mx-auto p-6 max-w-6xl">
            <Helmet>
                <title>Reported Properties | RealEstate</title>
            </Helmet>
            <h2 className="text-3xl font-bold mb-6 text-[#00BBA7]">Property Reports</h2>

            {reports.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-lg">No reports found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-[#00BBA7] text-white">
                            <tr>
                                <th>#</th>
                                <th>Reporter</th>
                                <th>Email</th>
                                <th>Property</th>
                                <th>Agent</th>
                                <th>Details</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, idx) => (
                                <tr key={report._id}>
                                    <td className="font-semibold">{idx + 1}</td>
                                    <td className="font-semibold">{report.reporterName}</td>
                                    {/* <td>
                                        {report.reporterEmail.length > 10
                                            ? `${report.reporterEmail.slice(0, 10)}...`
                                            : report.reporterEmail}
                                    </td> */}
                                    <td>
                                        {report.reporterEmail.length > 10
                                            ? `...${report.reporterEmail.slice(-10)}`
                                            : report.reporterEmail}
                                    </td>
                                    <td>
                                        {report.propertyTitle.length > 10
                                            ? `${report.propertyTitle.slice(0, 10)}...`
                                            : report.propertyTitle}
                                    </td>

                                    <td>{report.agentName}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => setViewReport(report)}
                                            className="btn btn-sm btn-outline btn-info"
                                            title="View Full Report"
                                        >
                                            <FaEye className="w-6 h-4" />
                                        </button>
                                    </td>
                                    <td className=" flex flex-col space-y-2 text-center">
                                        <button
                                            onClick={() => handleRemoveReport(report._id)}
                                            className="btn btn-warning btn-xs"
                                            disabled={removeReport.isLoading}
                                        >
                                            {removeReport.isLoading ? "Deleting..." : "Remove_Report"}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveProperty(report.propertyId)}
                                            className="btn btn-error btn-xs"
                                            disabled={removePropertyAndReport.isLoading}
                                        >
                                            {removePropertyAndReport.isLoading ? "Removing..." : "Remove_Property"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {viewReport && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-base-300 p-6 rounded-xl max-w-lg w-full shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-[#00BBA7]">Report Details</h3>

                        <div className="space-y-2">
                            <p><span className="font-semibold">Reporter:</span> {viewReport.reporterName}</p>
                            <p><span className="font-semibold">Email:</span> {viewReport.reporterEmail}</p>
                            <p><span className="font-semibold">Property:</span> {viewReport.propertyTitle}</p>
                            <p><span className="font-semibold">Agent:</span> {viewReport.agentName}</p>
                            <p><span className="font-semibold">Agent:</span> {viewReport.agentEmail}</p>
                            <p><span className="font-semibold">Description:</span></p>
                            <p className="bg-base-200 p-3 rounded text-sm">{viewReport.description}</p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                className="btn btn-outline"
                                onClick={() => setViewReport(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default PropertyReports;
