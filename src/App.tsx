import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Basic from "./layouts/Basic";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import ChangePassword from "./pages/ChangePassword";
import Root from "./pages/Root";
import PrivateRoute from "./components/PrivateRoute";
import { RootState, useAppSelector } from "./store/store";
import CreatorRoute from "./components/creatorRoute";
import FanRoute from "./components/fanRouter";
import ProductPurchase from "./pages/productPurchase";
import Wallet from "./pages/Wallet";
import FanProfile from "./pages/FanProfile";
import ConnectStripe from "./pages/StripeConnect";
import SearchPage from "./pages/SearchPage";
import SharedPost from "./pages/SharedPost";

function App() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const role = useAppSelector((state) => state.auth?.user?.lastActiveRole);

  const url = location.pathname;

  useEffect(() => {
    if (isAuthenticated) {
      url ? navigate(url) : navigate("/feed");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/feed/:postId" element={<SharedPost />} />
      <Route element={<Basic />}>
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/connect-account"
          element={
            <CreatorRoute>
              <ConnectStripe />
            </CreatorRoute>
          }
        />
        <Route
          path="/add-post"
          element={
            <CreatorRoute>
              <AddPost />
            </CreatorRoute>
          }
        />
        <Route
          path="/search"
          element={
            <FanRoute>
              <SearchPage />
            </FanRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            role === "CREATOR" ? (
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            ) : (
              <FanRoute>
                <FanProfile />
              </FanRoute>
            )
          }
        />
        <Route
          path="/account"
          element={
            <CreatorRoute>
              <Account />
            </CreatorRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/purchase/:productId"
          element={
            <FanRoute>
              <ProductPurchase />
            </FanRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <FanRoute>
              <Profile />
            </FanRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <FanRoute>
              <Wallet />
            </FanRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
