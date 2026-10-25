import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import FloatingCallButton from './components/common/FloatingCallButton';
import WhatsAppNotificationModal from './components/common/WhatsAppNotificationModal';
import AIChatbotWidget from './components/chatbot/AIChatbotWidget';
import ScrollToTop from './components/common/ScrollToTop';
import DiscountWidget from './components/common/DiscountWidget';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Aesthetic from './pages/public/Aesthetic';
import BookAppointment from './pages/public/BookAppointment';
import Testimonials from './pages/public/Testimonials';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import AnnualHealthPlan from './pages/public/AnnualHealthPlan';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManagePatients from './pages/admin/ManagePatients';
import ManageServices from './pages/admin/ManageServices';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageGallery from './pages/admin/ManageGallery';
import ManageFAQ from './pages/admin/ManageFAQ';
import ManageContactRequests from './pages/admin/ManageContactRequests';
import DoctorProfile from './pages/admin/DoctorProfile';
import WhatsAppSettings from './pages/admin/WhatsAppSettings';
import ManageCoupons from './pages/admin/ManageCoupons';

// Protected Admin Route Guard
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Main App Layout Wrapper
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/aesthetic" element={<Aesthetic />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/annual-health-plan" element={<AnnualHealthPlan />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="appointments" element={<ManageAppointments />} />
            <Route path="patients" element={<ManagePatients />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="faq" element={<ManageFAQ />} />
            <Route path="contacts" element={<ManageContactRequests />} />
            <Route path="doctor-profile" element={<DoctorProfile />} />
            <Route path="coupons" element={<ManageCoupons />} />
            <Route path="whatsapp-settings" element={<WhatsAppSettings />} />
          </Route>

          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>

      {!isAdminRoute && <Footer />}

      {/* Global Widgets & Dialogs */}
      {!isAdminRoute && <DiscountWidget />}
      {!isAdminRoute && <FloatingWhatsApp />}
      {!isAdminRoute && <FloatingCallButton />}
      {!isAdminRoute && <AIChatbotWidget />}
      <WhatsAppNotificationModal />
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
