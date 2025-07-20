import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import AOS from "aos";
import "aos/dist/aos.css";

const PaymentHistory = () => {
  const { email } = useParams();

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-out" });
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["paymentHistory", email],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/history/${email}`);
      return res.data;
    },
    enabled: !!email,
  });

  if (isLoading) return <LoadingFallback />;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  const { payments = [], totalPaidAmount = 0 } = data || {};

  return (
    <section
      data-aos="fade-up"
      className="container mx-auto p-4 font-sans"
    >
      <h2 className="text-3xl font-bold mb-4 text-[#00BBA7]">My Payment History</h2>

      <p className="mb-4 font-semibold ">
        Below is the record of all your completed payments for purchased properties.
      </p>

      <p className="mb-6 font-semibold text-[#00BBA7] text-lg">
        Total Paid Amount: <span>${totalPaidAmount}</span>
      </p>

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="table w-full border-collapse border border-gray-300">
            <thead className="bg-[#00BBA7] text-white">
              <tr>
                <th className="border border-gray-300">#</th>
                <th className="border border-gray-300">Property Title</th>
                <th className="border border-gray-300">Location</th>
                <th className="border border-gray-300">Buyer</th>
                <th className="border border-gray-300">Sold Price</th>
                <th className="border border-gray-300">Transaction ID</th>
                <th className="border border-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr
                  key={payment._id}
                  className="hover:bg-[#00BBA7]/20 transition-colors"
                >
                  <td className="border border-gray-300 text-center">{idx + 1}</td>
                  <td className="border border-gray-300">{payment.propertyTitle}</td>
                  <td className="border border-gray-300">{payment.propertyLocation}</td>
                  <td className="border border-gray-300">{payment.agentName}</td>
                  <td className="border border-gray-300">${payment.amountPaid}</td>
                  <td className="border border-gray-300 break-all">{payment.transactionId}</td>
                  <td className="border border-gray-300">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
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
