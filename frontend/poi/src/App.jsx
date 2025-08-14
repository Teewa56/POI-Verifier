import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideNav from './components/SideNav';
import LandingPage from './auth/Landingpage';
import DashboardPage from './pages/DashboardPage';
import InsightForm from './pages/NewInsightPage';
import Profile from './components/Profile';
import SignInPage from './auth/Login';
import SignUpPage from './auth/SignUp';
import NotFoundPage from './error/NotFoundPage';
import {useAuth} from './context/AuthContext'; 
import './App.css';

function App() {
  const { user } = useAuth();
  function ProtectedRoutes({children}){
    if(!user){
      return <Navigate to='/' replace/>
    }
    return children
  }
  return (
    <BrowserRouter>
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {user && <SideNav />}
      <div className="flex-1 w-1/3 p-4">
        <Routes>
          <Route path="/" element={user ? <DashboardPage /> : <LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<ProtectedRoutes><DashboardPage /></ProtectedRoutes>} />
          <Route path="/submit" element={<ProtectedRoutes><InsightForm /></ProtectedRoutes>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {user && <Route path="/profile" 
        element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />}
      <ToastContainer position="top-right" />
    </div>
  </BrowserRouter>
  );
}

export default App;