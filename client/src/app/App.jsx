import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from '../context/AppContext';
import { PublicLayout } from '../components/Layout';
import { Loading } from '../components/UI';
import { Home } from '../features/public/pages/Home';
import { About } from '../features/public/pages/About';
import { MenuPage } from '../features/public/pages/MenuPage';
import { Gallery } from '../features/public/pages/Gallery';
import { Contact } from '../features/public/pages/Contact';
import { BookingPage } from '../features/public/pages/BookingPage';
import { Login } from '../features/auth/pages/Login';
import { Register } from '../features/auth/pages/Register';
import { ForgotPassword } from '../features/auth/pages/ForgotPassword';
import { ResetPassword } from '../features/auth/pages/ResetPassword';
import { Cart } from '../features/customer/pages/Cart';
import { Checkout } from '../features/customer/pages/Checkout';
import { AccountLayout } from '../features/customer/pages/AccountLayout';
import { AccountHome } from '../features/customer/pages/AccountHome';
import { MyOrders } from '../features/customer/pages/MyOrders';
import { MyBookings } from '../features/customer/pages/MyBookings';
import { AdminLogin } from '../features/admin/pages/AdminLogin';
import { AdminLayout } from '../features/admin/pages/AdminLayout';
import { AdminDashboard } from '../features/admin/pages/AdminDashboard';
import { AdminMenu } from '../features/admin/pages/AdminMenu';
import { AdminCategories } from '../features/admin/pages/AdminCategories';
import { AdminBookings } from '../features/admin/pages/AdminBookings';
import { AdminOrders } from '../features/admin/pages/AdminOrders';
import { AdminCustomers } from '../features/admin/pages/AdminCustomers';
import { AdminGallery } from '../features/admin/pages/AdminGallery';
import { AdminContent } from '../features/admin/pages/AdminContent';
import { AdminInquiries } from '../features/admin/pages/AdminInquiries';
import { AdminReports } from '../features/admin/pages/AdminReports';
import { AdminSettings } from '../features/admin/pages/AdminSettings';
import { AdminFaqs } from '../features/admin/pages/AdminFaqs';
import { AdminTestimonials } from '../features/admin/pages/AdminTestimonials';
import { AdminActivity } from '../features/admin/pages/AdminActivity';
function RequireRole({ role, children }) {
    const { user, authLoading } = useApp();
    const location = useLocation();
    if (authLoading)
        return <Loading />;
    if (!user || user.role !== role)
        return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} state={{ from: location.pathname }} replace/>;
    return children;
}
function NotFound() { return <div className="container notfound"><h1>404</h1><h2>That page isn't on our menu.</h2><p>Let's get you back to something delicious.</p><a className="btn btn-gold" href="/">Return Home</a></div>; }


export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="cart" element={<Cart />} />
            <Route
              path="checkout"
              element={
                <RequireRole role="customer">
                  <Checkout />
                </RequireRole>
              }
            />
            <Route
              path="account"
              element={
                <RequireRole role="customer">
                  <AccountLayout />
                </RequireRole>
              }
            >
              <Route index element={<AccountHome />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="bookings" element={<MyBookings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="admin/login" element={<AdminLogin />} />
          <Route
            path="admin"
            element={
              <RequireRole role="admin">
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="faqs" element={<AdminFaqs />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="activity" element={<AdminActivity />} />
          </Route>
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans,sans-serif',
              borderRadius: 12,
            },
          }}
        />

        <Analytics />
      </BrowserRouter>
    </AppProvider>
  );
}
