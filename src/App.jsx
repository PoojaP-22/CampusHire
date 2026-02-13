import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import BrowseDrives from './pages/student/BrowseDrives';
import MyApplications from './pages/student/MyApplications';
import StudentProfile from './pages/student/Profile';

// TPO Pages
import TPODashboard from './pages/tpo/Dashboard';
import ManageDrives from './pages/tpo/ManageDrives';
import ReviewApplications from './pages/tpo/ReviewApplications';
import StudentDirectory from './pages/tpo/StudentDirectory';
import Reports from './pages/tpo/Reports';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyMyDrives from './pages/company/MyDrives';
import Applicants from './pages/company/Applicants';
import CompanyProfile from './pages/company/CompanyProfile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import CompanyManagement from './pages/admin/CompanyManagement';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 0.3s ease' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/drives" element={<ProtectedRoute allowedRoles={['student']}><BrowseDrives /></ProtectedRoute>} />
              <Route path="/student/applications" element={<ProtectedRoute allowedRoles={['student']}><MyApplications /></ProtectedRoute>} />
              <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />

              {/* TPO Routes */}
              <Route path="/tpo/dashboard" element={<ProtectedRoute allowedRoles={['tpo']}><TPODashboard /></ProtectedRoute>} />
              <Route path="/tpo/drives" element={<ProtectedRoute allowedRoles={['tpo']}><ManageDrives /></ProtectedRoute>} />
              <Route path="/tpo/applications" element={<ProtectedRoute allowedRoles={['tpo']}><ReviewApplications /></ProtectedRoute>} />
              <Route path="/tpo/students" element={<ProtectedRoute allowedRoles={['tpo']}><StudentDirectory /></ProtectedRoute>} />
              <Route path="/tpo/reports" element={<ProtectedRoute allowedRoles={['tpo']}><Reports /></ProtectedRoute>} />

              {/* Company Routes */}
              <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
              <Route path="/company/drives" element={<ProtectedRoute allowedRoles={['company']}><CompanyMyDrives /></ProtectedRoute>} />
              <Route path="/company/applicants" element={<ProtectedRoute allowedRoles={['company']}><Applicants /></ProtectedRoute>} />
              <Route path="/company/profile" element={<ProtectedRoute allowedRoles={['company']}><CompanyProfile /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />
              <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><CompanyManagement /></ProtectedRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
