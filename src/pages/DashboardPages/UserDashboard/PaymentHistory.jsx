import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";
import LoadingFallback from "../../../components/shared/LoadingFallback";

const PaymentHistory = () => {
    const { email } = useParams(); // ✅ get email from URL

    const { data, isLoading, error } = useQuery({
        queryKey: ["paymentHistory", email],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/history/${email}`);
            return res.data;
        },
        enabled: !!email, // don't run if no email
    });

    if (isLoading) return <LoadingFallback />;
    if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

    const { payments = [], totalPaidAmount = 0 } = data || {};

    return (
        <section className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">My Payment History</h2>

            <p className="mb-4 font-semibold">
                Total Paid Amount: <span className="text-primary">${totalPaidAmount}</span>
            </p>

            {payments.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Property Title</th>
                                <th>Location</th>
                                <th>Buyer</th>
                                <th>Buyer Email</th>
                                <th>Sold Price</th>
                                <th>Transaction ID</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>{payment.propertyTitle}</td>
                                    <td>{payment.propertyLocation}</td>
                                    <td>{payment.buyerName}</td>
                                    <td>{payment.buyerEmail}</td>
                                    <td>${payment.amountPaid}</td>
                                    <td>{payment.transactionId}</td>
                                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default PaymentHistory;
