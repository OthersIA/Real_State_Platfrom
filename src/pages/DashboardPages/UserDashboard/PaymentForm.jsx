import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        const card = elements.getElement(CardElement);


        if (!card) {
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
        }

    }

    return (
        <section>
            <div>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4 bg-white shadow-md w-full rounded">
                    <CardElement className="border p-2 rounded mb-4" />
                    <button type="submit" disabled={!stripe} className="btn btn-primary w-full">
                        Pay for property
                    </button>
                </form>
            </div>
        </section>
    );
};
export default PaymentForm;