import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import SideNav from './components/SideNav';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SubmitPage from './pages/SubmitPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './auth/Landingpage';
import useAuth from './context/AuthContext';

function App() {
  const { user } = useAuth();
  function ProtectedRoutes({children}){
    if(!user){
      return <Navigate to='/' replace/>
    }
    return children
  }
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <SideNav />
            <div className="flex-1 ml-64 p-4">
              <Routes>
                <Route path="/" element={user ? <HomePage /> : <LandingPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={<ProtectedRoutes><DashboardPage /></ProtectedRoutes>} />
                <Route path="/submit" element={<ProtectedRoutes><SubmitPage /></ProtectedRoutes>} />
                <Route path="/profile" element={<ProtectedRoutes><ProfilePage /></ProtectedRoutes>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <ToastContainer position="top-right" />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;