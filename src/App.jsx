import React from 'react' 
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { ToastContainer} from 'react-toastify'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import ForgetPassowrd from './pages/ForgetPassowrd'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Educator/Dashboard'
import Courses from './pages/Educator/Courses'
import EditCourse from './pages/Educator/EditCourse'
import CreateCourses from './pages/Educator/CreateCourses'
import getCreatorCourse from './customHooks/getCreatorCourse'
import getPublishedCourse from './customHooks/getPublishedCourse'

export const serverUrl = "http://localhost:8000"

function App() {
  getCurrentUser()
  getCreatorCourse()
  getPublishedCourse()
  const {userData} = useSelector(state=>state.user);

  return (
    <>  
        <ToastContainer />
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={"/"}/>}/>
            <Route path='/login' element={!userData ? <Login /> : <Navigate to={"/"} />} />
            <Route path='/profile' element={userData ? <Profile/> : <Navigate to={"/login"}/>}/>
            <Route path='/forget' element={!userData ? <ForgetPassowrd/> : <Navigate to="/"/>}/>
            <Route path='/editprofile' element={userData ? <EditProfile/> : <Navigate to="/login"/>}/>

            {/* educator */}
            <Route path='/dashboard' element={userData?.role === "educator" ? <Dashboard/> : <Navigate to="/"/>}/>
            <Route path='/courses' element={userData?.role === "educator" ? <Courses/> : <Navigate to="/"/>}/>
            <Route path='/createcourse' element={userData?.role === "educator" ? <CreateCourses/> : <Navigate to="/"/>}/>
            <Route path='/editcourse/:courseId' element={userData?.role === "educator" ? <EditCourse/> : <Navigate to="/"/>}/>
        </Routes>
    </>
  )
}

export default App