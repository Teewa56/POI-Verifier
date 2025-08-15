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
import './App.css';

function App() {
  const { user } = useAuth();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) setIsAuth(true);
  }, []);

  function ProtectedRoutes({ children }) {
    if (!user) return <Navigate to="/" replace />;
    return children;
  }

  if(!user) return null;

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;