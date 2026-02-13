import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AppLayout from "./components/AppLayout";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import UserLayout from "./components/UserLayout";
import axios from "axios";
import { serverEndpoint } from "./config/appConfig";
import { useSelector, useDispatch } from "react-redux";
import { SET_USER, CLEAR_USER } from "./redux/user/action";
import Groups from "./pages/Groups";
import GroupExpenses from "./pages/GroupExpenses";
import ManagePayments from "./pages/ManagePayments";

function App() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const [loading, setLoading] = useState(true);

    const isUserLoggedIn = async () => {
        try {
            const response = await axios.post(
                `${serverEndpoint}/auth/is-user-logged-in`,
                {},
                { withCredentials: true }
            );

            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });
        } catch (error) {
            // If not logged in, clear the user from Redux
            dispatch({
                type: CLEAR_USER
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        isUserLoggedIn();
    }, []);

    if (loading) {
        return (
            <div className="container text-center">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <Home />
                        </AppLayout>
                    )
                }
            />
            <Route
                path="/login"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <Login />
                        </AppLayout>
                    )
                }
            />
            <Route
                path="/signup"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <Signup />
                        </AppLayout>
                    )
                }
            />
            <Route
                path="/forgot-password"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <ForgotPassword />
                        </AppLayout>
                    )
                }
            />

            <Route
                path="/dashboard"
                element={
                    userDetails ? (
                        <UserLayout>
                            <Groups />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/groups/:groupId"
                element={
                    userDetails ? (
                        <UserLayout>
                            <GroupExpenses />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/manage-payments"
                element={
                    userDetails ? (
                        <UserLayout>
                            <ManagePayments />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/logout"
                element={<Logout />}
            />
        </Routes>
    );
}

export default App;