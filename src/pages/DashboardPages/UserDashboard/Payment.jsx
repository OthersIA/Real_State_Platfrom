import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

const Payment = () => {
    return (
         <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>
    );
};
export default Payment;