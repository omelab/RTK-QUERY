import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './modules/home';
import RequireUser from './modules/auth/RequireUser';
import ProfilePage from './modules/auth/Profile';
import DashboardPage from './modules/dashboard';
import UnauthorizePage from './modules/error/Unauthorize';
import LoginPage from './modules/auth/Login';
import RegisterPage from './modules/auth/Register';

// const appVersion = import.meta.env.VITE_APP_VERSION;

function App() {
  // console.log(appVersion);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* Private Route */}
          <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route element={<RequireUser allowedRoles={['admin']} />}>
            <Route path="admin" element={<DashboardPage />} />
          </Route>

          <Route path="unauthorized" element={<UnauthorizePage />} />
        </Route>

        <Route path="login" element={<LoginPage />} />

        <Route path="register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
