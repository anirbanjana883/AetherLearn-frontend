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

export const serverUrl = "http://localhost:8000"

function App() {
  getCurrentUser()
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
        </Routes>
    </>
  )
}

export default App