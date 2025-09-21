import React, { useState } from "react";
import logo1 from "../assets/logo1.png";
import google from "../assets/google.jpg";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { serverUrl } from "../App";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Login() {
  const [show, setShow] = useState(false);
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogin = async ()=>{
    setLoading(true)
    try {
      const result = await  axios.post(serverUrl + "/api/auth/login",
        {email , password},
        {withCredentials:true}
      )
      setLoading(false)
      dispatch(setUserData(result.data))
      toast.success("Login Successfully");
      navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
      <form
        className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl
          rounded-2xl flex"
          onSubmit={(e)=>e.preventDefault()}
      >
        {/* left div */}
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
          {/* logo at top */}
          <div className="w-[170px] h-[60px] rounded-lg overflow-hidden lg:hidden">
            <img src={logo1} alt="logo" className="w-full h-full " />
          </div>

          <div>
            <h1 className="font-semibold text-black text-2xl">Welcome back</h1>

            <h2 className=" text-gray-500 text-[18px]">
              Login to your account
            </h2>
          </div>

          {/* main form  */}
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="border-1 w-[100%] h-[35px]
                 border-[#e7e6e6] text-[15px] px-[20px]"
              placeholder="Your Email"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
            />

            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              id="password"
              type={show ? "text" : "password"}
              className="border-1 w-[100%] h-[35px]
                 border-[#e7e6e6] text-[15px] px-[20px]"
              placeholder="Password"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
            />
            {show ? (
              <FaRegEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[6%] bottom-[4%]"
                onClick={() => setShow((prev) => !prev)}
              />
            ) : (
              <FaRegEyeSlash
                className="absolute w-[20px] h-[20px] cursor-pointer right-[6%] bottom-[4%]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>

          <button
            className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center
              justify-center rounded-[10px] "
              disabled = {loading} 
              onClick={handleLogin}
          >
            {loading ? <ClipLoader size={30} color="white"/> : "Login"}
          </button>

          <span className="text-[16px] cursor-pointer text-[#585757]">Forgot your Password ?</span>

          <div className="w-[80%] flex items-center gap-2">
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
            <div className="w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center">
              Or continue
            </div>
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
          </div>

          <div
            className="w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center
              justify-center"
          >
            <img src={google} alt="" className="w-[25px]" />
            <span className="text-[18px] text-gray-500">oogle</span>
          </div>

          <div className="text-[#6f6f6f]">
            Don't have an account ?
            <span 
            className="underline underline-offset-1 cursor-pointer"
            onClick={()=>navigate("/signup")}
            > Signup </span>
          </div>


        </div>

        {/* right div */}
        <div
          className="w-[50%] h-[100%] rounded-2xl bg-[black] md:flex items-center justify-center
            flex-col hidden"
        >
          <img src={logo1} alt="logo" className="w-90 shadow-2xl" />
        </div>
      </form>
    </div>
  );
}

export default Login;
