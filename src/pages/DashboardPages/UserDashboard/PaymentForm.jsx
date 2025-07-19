import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import axios from "axios";
import Swal from "sweetalert2";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [processing, setProcessing] = useState(false);

    const { wishlistId } = useParams();

    const { isPending, data: offeredInfo = {} } = useQuery({
        queryKey: ["wishlist", wishlistId],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/accepted-offer/${wishlistId}`);
            return res.data;
        },
    });

    if (isPending) return <LoadingFallback />;

    const amount = offeredInfo?.offerAmount || 0;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        setProcessing(true);
        setError(null);
        setSuccess(null);

        try {
            // ✅ Create PaymentMethod
            const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card,
            });

            if (paymentError) {
                setError(paymentError.message);
                setProcessing(false);
                return;
            }

            // ✅ Create PaymentIntent
            const { data: createPI } = await axios.post(
                `${import.meta.env.VITE_API_URL}/create-payment-intent`,
                {
                    amount, // Stripe uses cents
                    wishlistId,
                }
            );

            const clientSecret = createPI.clientSecret;

            // ✅ Confirm Card Payment
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card,
                    billing_details: {
                        name: offeredInfo?.buyerName || "Anonymous",
                        email: offeredInfo?.buyerEmail || "N/A",
                    },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                // ✅ Payment was successful → store payment on server
                const paymentInfo = {
                    wishlistId,
                    propertyId: offeredInfo?.propertyId,
                    propertyTitle: offeredInfo?.propertyTitle,
                    propertyLocation: offeredInfo?.propertyLocation,
                    propertyImage: offeredInfo?.propertyImage,
                    buyerEmail: offeredInfo?.buyerEmail,
                    buyerName: offeredInfo?.buyerName,
                    agentEmail: offeredInfo?.agentEmail,
                    agentName: offeredInfo?.agentName,
                    transactionId: paymentIntent.id,
                    amountPaid: amount,
                    status: "paid",
                    createdAt: new Date(),
                };

                await axios.post(`${import.meta.env.VITE_API_URL}/payments`, paymentInfo);

                setSuccess(`Payment successful! Transaction ID: ${paymentIntent.id}`);
                Swal.fire("Success!", "Payment completed successfully.", "success");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong during payment.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto space-y-4 p-4 bg-white shadow-md w-full rounded"
            >
                <h2 className="text-2xl font-bold mb-4">Pay ${amount} for your property</h2>
                <CardElement className="border p-2 rounded mb-4" />
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="btn btn-primary w-full"
                >
                    {processing ? "Processing..." : `Pay $${amount}`}
                </button>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </form>
        </section>
    );
};

export default PaymentForm;
