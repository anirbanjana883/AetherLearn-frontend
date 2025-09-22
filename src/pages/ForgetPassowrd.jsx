import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

function ForgetPassowrd() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  // step 1
  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/sendotp",
        { email },
        { withCredentials: true }
      );

      console.log(result.data);
      setLoading(false);
      setStep(2);
      toast.success(result.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Otp not sent");
      setLoading(false);
    }
  };

  // step 2
  const verifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/verifyotp",
        { email, otp },
        { withCredentials: true }
      );
      console.log(result.data);
      setLoading(false);
      setStep(3);
      toast.success(result.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Otp not verified");
      setLoading(false);
    }
  };

  // step 3
  const resetPassword = async () => {
    setLoading(true);
    try {
      if (newPassword !== conPassword) {
        setLoading(false);
        return toast.error("Password not matched");
      }
      const result = await axios.post(
        serverUrl + "/api/auth/resetpassword",
        { email, password: newPassword },
        { withCredentials: true }
      );
      console.log(result.data);
      setLoading(false);
      // setStep(3)
      toast.success(result.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Password resetting failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* step 1 : enter email send otp */}

      {step == 1 && (
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Forgot your password ?
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your email adress
              </label>

              <input
                id="email"
                type="text"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus-ring-[black] "
                placeholder="example@gmail.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button
              type="button" 
              className="w-full bg-[black] hover:bg-[#4b4b4b] text-white
            py-2 px-4 rounded-md font-medium cursor-pointer"
              disabled={loading}
              onClick={sendOtp}
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}
            </button>
          </form>
          <div
            className="text-sm text-center mt-4 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}

      {/* step 2 : submit otp or verify otp */}

      {step == 2 && (
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Enter OTP
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter 4-digit code sent to your email
              </label>

              <input
                id="otp"
                type={show2 ? "text" : "password"}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus-ring-[black] "
                placeholder="* * * *"
                required
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
              {show2 ? (
                <FaRegEye
                  className="absolute w-[20px] h-[20px] cursor-pointer right-[2%] bottom-[15%]"
                  onClick={() => setShow2((prev) => !prev)}
                />
              ) : (
                <FaRegEyeSlash
                  className="absolute w-[20px] h-[20px] cursor-pointer right-[2%] bottom-[15%]"
                  onClick={() => setShow2((prev) => !prev)}
                />
              )}
            </div>
            <button
              type="button" 
              className="w-full bg-[black] hover:bg-[#4b4b4b] text-white
            py-2 px-4 rounded-md font-medium cursor-pointer"
              disabled={loading}
              onClick={verifyOtp}
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Verify OTP"}
            </button>
          </form>
          <div
            className="text-sm text-center mt-4 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}

      {/* step 3 : reset password */}

      {step == 3 && (
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter new password to regain access of your account
          </p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New password
              </label>

              <input
                id="password"
                type={show ? "text" : "password"}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus-ring-[black] "
                placeholder="* * * * * * * *"
                required
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
              {show ? (
                <FaRegEye
                  className="absolute w-[20px] h-[20px] cursor-pointer right-[2%] bottom-[15%]"
                  onClick={() => setShow((prev) => !prev)}
                />
              ) : (
                <FaRegEyeSlash
                  className="absolute w-[20px] h-[20px] cursor-pointer right-[2%] bottom-[15%]"
                  onClick={() => setShow((prev) => !prev)}
                />
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="conpassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm new password
              </label>

              <input
                id="conpassword"
                type={show1 ? "text" : "password"}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus-ring-[black] "
                placeholder="* * * * * * * *"
                required
                onChange={(e) => setConPassword(e.target.value)}
                value={conPassword}
              />
              {show1 ? (
                <FaRegEye
                  className="absolute w-[20px] h-[20px] cursor-pointer right-[2%] bottom-[15%]"
                  onClick={() => setShow1((prev) => !prev)}
                />
              ) : (
                <FaRegEyeSlash
                  className="absolute w-[20px] h-[20px] cursor-pointer right-[2%] bottom-[15%]"
                  onClick={() => setShow1((prev) => !prev)}
                />
              )}
            </div>

            <button
              type="button" 
              className="w-full bg-[black] hover:bg-[#4b4b4b] text-white
            py-2 px-4 rounded-md font-medium cursor-pointer"
              disabled={loading}
              onClick={resetPassword}
            >
              {loading ? (
                <ClipLoader size={30} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          <div
            className="text-sm text-center mt-4 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgetPassowrd;
