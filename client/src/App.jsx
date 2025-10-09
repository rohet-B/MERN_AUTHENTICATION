// First install axios package to make api call -> npm i axios 
// Second install react router dom to create router in react app -> npm i react-router-dom
// Third install react tostify package to display notifications on our webpage ->npm i react-toastify
// Create Pages folder, context folder and components folder
// THen add BrowserRouter in main.jsx and remove strict mode.
// Now in app.jsx import Routes and route
// Make routes according to pages



import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer} from 'react-toastify';
  

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<VerifyEmail/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App
