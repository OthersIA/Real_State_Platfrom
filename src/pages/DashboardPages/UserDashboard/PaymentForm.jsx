import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthContext } from "../../../context/AuthContext";
import { Helmet } from "react-helmet-async";

const PaymentForm = () => {
    const { user } = useContext(AuthContext);
    const stripe = useStripe();
    const elements = useElements();
    const { wishlistId } = useParams();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 600, easing: "ease-out" });
    }, []);

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
            // Create PaymentMethod
            const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card,
            });

            if (paymentError) {
                setError(paymentError.message);
                setProcessing(false);
                return;
            }

            // Create PaymentIntent on backend
            const { data: createPI } = await axios.post(
                `${import.meta.env.VITE_API_URL}/create-payment-intent`,
                {
                    amount, // in cents or as expected by your backend
                    wishlistId,
                }
            );

            const clientSecret = createPI.clientSecret;

            // Confirm card payment
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
                // Store payment info on your server
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

                // Update property status to sold
                await axios.patch(`${import.meta.env.VITE_API_URL}/properties/${offeredInfo.propertyId}/status`, {
                    status: "sold",
                });

                setSuccess(`Payment successful! Transaction ID: ${paymentIntent.id}`);
                Swal.fire("Success!", "Payment completed successfully.", "success");
                navigate(`/dashboard/payments/history/${user.email}`);
            }

        } catch (err) {
            console.error(err);
            setError("Something went wrong during payment.");
        } finally {
            setProcessing(false);
        }
    };

    console.log("Fetching accepted offer for:", wishlistId);

    return (
        <section
            data-aos="fade-up"
            className="container w-8/9 md:w-3/4 my-10  mx-auto space-y-6 p-6 bg-white shadow-md rounded"
        >
            <Helmet>
                <title>Payment Form | RealEstate</title>
            </Helmet>
            <h2 className="text-3xl font-bold mb-2 text-[#00BBA7]">
                Pay ${amount} for Your Property
            </h2>

            <p className="text-gray-700 mb-4">
                Complete your payment securely using Stripe. Your transaction is encrypted and safe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border border-gray-300 rounded p-3">
                    <CardElement options={{ hidePostalCode: true }} />
                </div>

                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="btn w-full"
                    style={{
                        backgroundColor: "#00BBA7",
                        borderColor: "#00BBA7",
                        color: "white",
                    }}
                >
                    {processing ? "Processing..." : `Pay $${amount}`}
                </button>

                {error && <p className="text-red-600 font-semibold">{error}</p>}
                {success && <p className="text-green-600 font-semibold">{success}</p>}
            </form>
        </section>
    );
};

export default PaymentForm;
