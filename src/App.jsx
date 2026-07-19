import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Layout from './components/Layout/Layout';
import { CartProvider } from './Context/CartContext';
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/ui/PageLoader";
import {
  HomeSkeleton,
  ShopSkeleton,
  ShopAllSkeleton,
  ProductPageSkeleton,
  AboutSkeleton,
  ContactSkeleton,
  ServicesSkeleton,
  CartSkeleton,
  CheckoutSkeleton,
  TrackOrderSkeleton,
  TextPageSkeleton,
} from "./components/ui/Skeleton";

// Admin — small bundle, keep eager
import AdminLogin     from './Pages/Admin/AdminLogin';
import ProtectedRoute from './Pages/Admin/ProtectedRoute';
const Dashboard       = lazy(() => import('./Pages/Admin/Dashboard'));
const Orders          = lazy(() => import('./Pages/Admin/Orders'));
const AdminUsers      = lazy(() => import('./Pages/Admin/AdminUsers'));
const AdminProducts   = lazy(() => import('./Pages/Admin/AdminProducts'));
const AdminCategories = lazy(() => import('./Pages/Admin/AdminCategories'));
const AdminBanners    = lazy(() => import('./Pages/Admin/AdminBanners'));
const AdminScrolling  = lazy(() => import('./Pages/Admin/AdminScrollingText'));



// Public pages — lazy loaded
const Home          = lazy(() => import('./Pages/Home'));
const Shop           = lazy(() => import('./Pages/Shop'));
const ShopAll        = lazy(() => import('./components/products/ShopAll'));
const AboutUs        = lazy(() => import('./Pages/About'));
const ContactUs      = lazy(() => import('./Pages/Contact'));
const Reviews        = lazy(() => import('./Pages/Reviews'));
const ServiceDetail  = lazy(() => import('./Pages/Service'));
const Cart = lazy(() => import('./components/products/Cart'));
const CheckoutPage  = lazy(() => import('./components/products/CheckoutPage'));
const ProductPage    = lazy(() => import('./components/products/ProductPage'));
const PrivacyPolicy  = lazy(() => import('./Pages/PrivacyPolicy'));
const TermsOfUse     = lazy(() => import('./Pages/TermsOfUse'));
const TrackOrder     = lazy(() => import('./components/products/TrackOrder'));
const NotFound       = lazy(() => import('./Pages/NotFound'));

const AdminLoader = () => <PageLoader show={true} />;

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Admin routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard"      element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><Dashboard /></Suspense></ProtectedRoute>} />
          <Route path="/admin/orders"         element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><Orders /></Suspense></ProtectedRoute>} />
          <Route path="/admin/products"       element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminProducts /></Suspense></ProtectedRoute>} />
          <Route path="/admin/categories"     element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminCategories /></Suspense></ProtectedRoute>} />
          <Route path="/admin/banners"        element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminBanners /></Suspense></ProtectedRoute>} />
          <Route path="/admin/scrolling-text" element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminScrolling /></Suspense></ProtectedRoute>} />
          <Route path="/admin/users"          element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminUsers /></Suspense></ProtectedRoute>} />

          {/* ── Public routes ── */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={
                  <Suspense fallback={<HomeSkeleton />}><Home /></Suspense>
                } />
                <Route path="/shop" element={
                  <Suspense fallback={<ShopSkeleton />}><Shop /></Suspense>
                } />
                <Route path="/shop/all" element={
                  <Suspense fallback={<ShopAllSkeleton />}><ShopAll /></Suspense>
                } />
                <Route path="/product/:id" element={
                  <Suspense fallback={<ProductPageSkeleton />}><ProductPage /></Suspense>
                } />
                <Route path="/checkout" element={
                  <Suspense fallback={<CheckoutSkeleton />}><CheckoutPage /></Suspense>
                } />
                <Route path="/cart" element={
                  <Suspense fallback={<CartSkeleton />}><Cart /></Suspense>
                } />
                <Route path="/aboutus" element={
                  <Suspense fallback={<AboutSkeleton />}><AboutUs /></Suspense>
                } />
                <Route path="/services" element={
                  <Suspense fallback={<ServicesSkeleton />}><ServiceDetail /></Suspense>
                } />
                <Route path="/reviews" element={
                  <Suspense fallback={<HomeSkeleton />}><Reviews /></Suspense>
                } />
                <Route path="/contactus" element={
                  <Suspense fallback={<ContactSkeleton />}><ContactUs /></Suspense>
                } />
                <Route path="/privacy" element={
                  <Suspense fallback={<TextPageSkeleton />}><PrivacyPolicy /></Suspense>
                } />
                <Route path="/terms" element={
                  <Suspense fallback={<TextPageSkeleton />}><TermsOfUse /></Suspense>
                } />
                <Route path="/track-order" element={
                  <Suspense fallback={<TrackOrderSkeleton />}><TrackOrder /></Suspense>
                } />
                <Route path="*" element={
                  <Suspense fallback={null}><NotFound /></Suspense>
                } />
              </Routes>
            </Layout>
          } />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}