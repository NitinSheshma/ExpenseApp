import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { serverEndpoint } from "../config/appConfig";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/action";

function Login() {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;

        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            try {
                const response = await axios.post(
                    `${serverEndpoint}/auth/login`,
                    formData,
                    { withCredentials: true }
                );

                dispatch({
                    type: SET_USER,
                    payload: response.data.user,
                });

            } catch (error) {
                console.log(error);
                setErrors({
                    message: "Login failed, please try again",
                });
            }
        }
    };

    // ✅ GOOGLE LOGIN FIXED
    const handleGoogleSuccess = async (authResponse) => {
        try {
            console.log("Google Response:", authResponse);

            const response = await axios.post(
                `${serverEndpoint}/auth/google-auth`, // make sure this matches backend
                {
                    token: authResponse.credential, // ✅ IMPORTANT FIX
                },
                { withCredentials: true }
            );

            console.log("Backend Response:", response.data);

            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });

        } catch (error) {
            console.log("Google Login Error:", error);
            setErrors({
                message: "Unable to process google sso, please try again",
            });
        }
    };

    const handleGoogleFailure = (error) => {
        console.log("Google Error:", error);
        setErrors({
            message: "Google login failed",
        });
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">

                            <h2 className="text-center mb-3">
                                Welcome <span className="text-primary">Back</span>
                            </h2>

                            {(message || errors.message) && (
                                <div className="alert alert-danger">
                                    {message || errors.message}
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control mb-3"
                                    onChange={handleChange}
                                />

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="form-control mb-3"
                                    onChange={handleChange}
                                />

                                <button className="btn btn-primary w-100 mb-3">
                                    Sign In
                                </button>
                            </form>

                            <div className="text-center mb-2">OR</div>

                            {/* ✅ GOOGLE LOGIN */}
                            <GoogleOAuthProvider
                                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                            >
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleFailure}
                                />
                            </GoogleOAuthProvider>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;