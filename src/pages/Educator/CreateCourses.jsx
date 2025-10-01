import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";



function CreateCourses() {
  const navigate = useNavigate();
  const [title,setTitle] = useState("")
  const [category,setCategory] = useState("")
  const [loading,setLoading ] = useState(false)


  const handleCreateCourse = async ()=>{
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/course/create",
        {title,category},
        {withCredentials:true}
      )
      console.log(result.data)
      navigate("/courses")
      setLoading(false)
      toast.success("Course Created")
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(error.response.data.messaage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md mt-10 relative">
        <FaArrowLeftLong
          className="top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/courses")}
        />

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Course
        </h2>

        <form className="space-y-5"
        onSubmit={(e)=>e.preventDefault()}>
          <div>
            <label
              htmlFor="title"
              className="block text-md font-medium text-gray-700 mb-1"
            >
              Course title
            </label>

            <input
              type="text"
              id="title"
              placeholder="Enter Course title"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none
               focus:ring-2 focus:ring-[black]"
               onChange={(e)=>setTitle(e.target.value)} value={title}
            />
          </div>

          <div>
            <label
              htmlFor="cat"
              className="block text-md font-medium text-gray-700 mb-1"
            >
              Course category
            </label>
              <select
                id="cat"
                name="cat"
                defaultValue=""
                aria-label="Select Category"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 
               focus:outline-none focus:ring-2 focus:ring-black focus:border-black 
               hover:border-gray-400 transition-colors duration-200 cursor-pointer"
               onChange={(e)=>setCategory(e.target.value)}
              >
                <option value="" disabled>
                  -- Select Category --
                </option>
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Designing">UI/UX Designing</option>
                <option value="App Development">App Development</option>
                <option value="Blockchain">Blockchain</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="Others">Others</option>
              </select>
          </div>
          <button className="w-full bg-[black] text-white px-4 py-2 rounded-md active:bg-[#3a3a3a] transition"
            onClick={handleCreateCourse}
          >{loading ? <ClipLoader size={30} color="white"/> :"Create"}</button>
        </form>
      </div>
    </div>
  );
}

export default CreateCourses;
