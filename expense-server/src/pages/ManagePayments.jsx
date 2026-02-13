import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

const CREDITS_PACK = [
    { price: 1, credits: 10 },
    { price: 4, credits: 50 },
    { price: 7, credits: 100 },
];

function ManagePayments() {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const getUserProfile = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/profile/get-user-info`,
                { withCredentials: true }
            );
            setUserProfile(response.data.user);
        } catch (error) {
            setErrors({ message: "Unable to fetch user profile" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const paymentResponseHandler = async (credits, payment) => {
        try {
            const response = await axios.post(
                `${serverEndpoint}/payments/verify-order`,
                {
                    razorpay_order_id: payment.razorpay_order_id,
                    razorpay_payment_id: payment.razorpay_payment_id,
                    razorpay_signature: payment.razorpay_signature,
                    credits: credits,
                },
                { withCredentials: true }
            );

            // ✅ Update credits properly
            setUserProfile((prev) => ({
                ...prev,
                credits: response.data.credits,
            }));

            setMessage(`Payment successful! ${credits} credits added.`);
            setErrors({});
        } catch (error) {
            setErrors({
                message:
                    error.response?.data?.message ||
                    "Unable to process payment request, contact customer service",
            });
        }
    };

    const handlePayment = async (credits) => {
        try {
            setLoading(true);

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded.");
                return;
            }

            const orderResponse = await axios.post(
                `${serverEndpoint}/payments/create-order`,
                { credits },
                { withCredentials: true }
            );

            const order = orderResponse.data.order;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "MergeMoney",
                description: `Order for purchasing ${credits} credits`,
                order_id: order.id,
                theme: { color: "#3399cc" },
                handler: (response) => {
                    paymentResponseHandler(credits, response);
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            setErrors({
                message:
                    error.response?.data?.message ||
                    "Unable to process the payment request",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container p-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container p-5">
            {errors.message && (
                <div className="alert alert-danger">{errors.message}</div>
            )}
            {message && (
                <div className="alert alert-success">{message}</div>
            )}

            <h2>Manage Payments</h2>
            <p>
                <strong>Current Credit Balance: </strong>
                {userProfile?.credits || 0}
            </p>

            <div className="row">
                {CREDITS_PACK.map((credit, index) => (
                    <div key={index} className="col-auto border m-2 p-3">
                        <h4>{credit.credits} Credits</h4>
                        <p>
                            Buy {credit.credits} Credits for INR {credit.price}
                        </p>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => handlePayment(credit.credits)}
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManagePayments;