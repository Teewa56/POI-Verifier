import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './auth/Landingpage';
import DashboardPage from './components/DashBoard';
import InsightForm from './pages/NewInsightPage';
import Profile from './components/Profile';
import SignInPage from './auth/Login';
import SignUpPage from './auth/SignUp';
import NotFoundPage from './error/NotFoundPage';
import { useAuth } from './context/AuthContext'; 
import { useEffect, useState } from 'react';
import InsightDetailPage from './pages/InsightDetailsPage';
import VerifyPage from './pages/VerifyInsights';
import './App.css';

function App() {
  const { user } = useAuth();
  const [isAuth, setIsAuth] = useState(false);
  const token = sessionStorage.getItem('token');
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) setIsAuth(true);
  }, []);

  function ProtectedRoutes({ children }) {
    if (!user) return <Navigate to="/" replace />;
    return children;
  }

  if(!user && token){
    return(
      <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-16 h-16">
        {/* Top circle */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-6 rounded-full bg-[#f4511e] animate-ping"></div>
        
        {/* Bottom-left circle */}
        <div className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-green-600 animate-ping [animation-delay:0.2s]"></div>
        
        {/* Bottom-right circle */}
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-red-600 animate-ping [animation-delay:0.4s]"></div>
      </div>
    </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Main Content */}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={isAuth ? <DashboardPage /> : <LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route 
              path="/submit" 
              element={<ProtectedRoutes><InsightForm /></ProtectedRoutes>} 
            />
            <Route 
              path='/profile'
              element={<ProtectedRoutes><Profile /></ProtectedRoutes>} 
            />
            <Route 
              path='/insight/:id'
              element={<ProtectedRoutes><InsightDetailPage /></ProtectedRoutes>} 
            />
            <Route 
              path='/verify'
              element={<ProtectedRoutes><VerifyPage /></ProtectedRoutes>} 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;