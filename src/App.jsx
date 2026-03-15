import React from 'react' 
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'

// Components & Pages
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import ForgetPassowrd from './pages/ForgetPassowrd'
import EditProfile from './pages/EditProfile'
import Courses from './pages/Educator/Courses'
import EditCourse from './pages/Educator/EditCourse'
import CreateCourses from './pages/Educator/CreateCourses'
import AllCourses from './pages/AllCourses'
import CreateLecture from './pages/Educator/CreateLecture'
import EditLecture from './pages/Educator/EditLecture'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './component/ScrollToTop'
import ViewLecture from './pages/ViewLecture'
import MyEnrolledCourse from './pages/MyEnrolledCourse'
import SearchWithAi from './pages/searchWithAi'
import StudentDashboard from './pages/StudentDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import EducatorDashboard from './pages/Educator/EducatorDashboard'
import CourseAnalytics from './pages/Educator/CourseAnalytics'

function App() {
  const { userData } = useSelector(state => state.user);

  return (
    <>  
      <ToastContainer />
      <ScrollToTop/>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" />} />
        <Route path='/forget' element={!userData ? <ForgetPassowrd/> : <Navigate to="/"/>}/>

        {/* General Protected Routes */}
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path='/editprofile' element={<ProtectedRoute><EditProfile/></ProtectedRoute>}/>
        <Route path='/allcourses' element={<ProtectedRoute><AllCourses/></ProtectedRoute>}/>
        <Route path='/viewcourse/:courseId' element={<ProtectedRoute><ViewCourse/></ProtectedRoute>}/>
        <Route path='/viewlecture/:courseId' element={<ProtectedRoute><ViewLecture/></ProtectedRoute>}/>
        <Route path='/mycourses' element={<ProtectedRoute><MyEnrolledCourse/></ProtectedRoute>}/>
        <Route path='/search' element={<ProtectedRoute><SearchWithAi/></ProtectedRoute>}/>

        {/* Student Specific */}
        <Route path='/dashboardstudent' element={
          <ProtectedRoute role="student"><StudentDashboard/></ProtectedRoute>
        }/>

        {/* Educator Specific */}
        <Route path='/dashboard' element={<ProtectedRoute role="educator"><EducatorDashboard/></ProtectedRoute>}/>
        <Route path='/analytics/:courseId' element={<ProtectedRoute role="educator"><CourseAnalytics/></ProtectedRoute>}/>
        <Route path='/courses' element={<ProtectedRoute role="educator"><Courses/></ProtectedRoute>}/>
        <Route path='/createcourse' element={<ProtectedRoute role="educator"><CreateCourses/></ProtectedRoute>}/>
        <Route path='/editcourse/:courseId' element={<ProtectedRoute role="educator"><EditCourse/></ProtectedRoute>}/>
        <Route path='/createlecture/:courseId/:sectionId' element={<ProtectedRoute role="educator"><CreateLecture/></ProtectedRoute>}/>
        <Route path='/editlecture/:courseId/:lectureId' element={<ProtectedRoute role="educator"><EditLecture/></ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App