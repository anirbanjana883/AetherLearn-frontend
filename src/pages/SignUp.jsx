import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa6"; // Added FaGoogle
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function SignUp() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, password, email, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("Signup Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const { displayName: name, email } = user;
      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        { name, email, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("Signup Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#030712] text-white flex items-center justify-center p-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.1)_0%,#030712_70%)]"></div>

      <div className="relative z-10 w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)] border border-blue-500/30">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 bg-slate-900/40 backdrop-blur-xl p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full">
            <h1 className="font-bold text-3xl text-slate-100">Let's Get Started</h1>
            <h2 className="text-slate-400 text-base mt-1">Create your AetherLearn account</h2>

            <form className="mt-8 flex flex-col gap-4" onSubmit={handleSignup}>
              {/* Name, Email, Password Inputs */}
              {[
                { id: "name", type: "text", label: "Name", value: name, action: setName, placeholder: "Your Full Name" },
                { id: "email", type: "email", label: "Email", value: email, action: setEmail, placeholder: "your.email@example.com" },
                { id: "password", type: show ? "text" : "password", label: "Password", value: password, action: setPassword, placeholder: "Create a strong password" }
              ].map(field => (
                <div key={field.id} className="flex flex-col gap-1">
                  <label htmlFor={field.id} className="font-semibold text-slate-300 text-sm">{field.label}</label>
                  <div className="relative w-full">
                    <input
                      id={field.id}
                      type={field.type}
                      className="w-full p-3 pr-12 bg-black/30 text-white placeholder-slate-500 border border-blue-500/40 rounded-lg 
                                 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
                      placeholder={field.placeholder}
                      required
                      onChange={(e) => field.action(e.target.value)}
                      value={field.value}
                    />
                    {field.id === "password" && (
                      <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300" onClick={() => setShow(!show)}>
                        {show ? <FaRegEye className="w-5 h-5" /> : <FaRegEyeSlash className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Role Selection */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-semibold text-slate-300 text-sm">I am a...</label>
                <div className="flex gap-4">
                    {["student", "educator"].map(r => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`
                                px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 w-full
                                border ${role === r ? "border-cyan-400 bg-blue-600/50 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]" : "border-blue-500/30 bg-slate-800/50 text-slate-300 hover:bg-slate-700/70"}
                            `}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
              </div>

              <button
                className="w-full p-3 mt-4 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center
                           transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]
                           disabled:bg-blue-800 disabled:cursor-not-allowed"
                disabled={loading}
                type="submit"
              >
                {loading ? <ClipLoader size={24} color="white" /> : "Create Account"}
              </button>

              <div className="w-full flex items-center gap-4 my-2">
                <div className="flex-grow h-px bg-blue-500/30"></div>
                <span className="text-slate-400 text-sm">OR</span>
                <div className="flex-grow h-px bg-blue-500/30"></div>
              </div>

              <button
                type="button"
                className="w-full p-3 bg-slate-800/60 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-3
                           border border-blue-500/40 transition-all duration-300 hover:bg-slate-700/80 hover:border-cyan-400"
                onClick={googleSignUp}
              >
                <FaGoogle className="text-lg" />
                Continue with Google
              </button>

              <p className="text-sm text-slate-400 text-center mt-4">
                Already have an account?
                <span className="font-semibold text-cyan-300 cursor-pointer ml-2 hover:underline" onClick={() => navigate("/login")}>
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side: Branding */}
        <div className="hidden lg:flex w-1/2 bg-black items-center justify-center p-12">
          <div className="flex flex-col items-center justify-center text-center">
                      <img src={logo1} alt="AetherLearn Logo" className="w-70 shadow-2xl " />
                      <h2 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 mt-4">
                        AETHERLEARN
                      </h2>
                    </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;