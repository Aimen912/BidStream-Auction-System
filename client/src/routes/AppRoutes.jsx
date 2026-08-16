import { Routes, Route, Navigate } from 'react-router-dom';

import Landing from '../pages/landing/Landing';
import HowItWorksPage from '../pages/landing/HowItWorksPage';

import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

import Dashboard from '../pages/dashboard/Dashboard';
import Auctions from '../pages/auctions/Auctions';
import AuctionDetail from '../pages/auctions/AuctionDetail';
import MyBids from '../pages/bids/MyBids';
import BuyerOrders from '../pages/orders/BuyerOrders';
import Watchlist from '../pages/watchlist/Watchlist';
import Messages from '../pages/messages/Messages';
import Notifications from '../pages/notifications/Notifications';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';

// ── Seller ────────────────────────────────────────────────────────────────
import SellerDashboard from '../pages/seller/Dashboard';
import SellerMyAuctions from '../pages/seller/MyAuctions';
import CreateAuction from '../pages/seller/CreateAuction';
import EditAuction from '../pages/seller/EditAuction';
import SellerOrders from '../pages/seller/Orders';
import SellerAnalytics from '../pages/seller/Analytics';
import SellerNotifications from '../pages/seller/Notifications';
import SellerMessages from '../pages/seller/Messages';
import SellerProfile from '../pages/seller/Profile';
import SellerSettings from '../pages/seller/Settings';

// ── Admin ────────────────────────────────────────────────────────────────
import AdminLogin       from '../pages/admin/Login';
import AdminDashboard   from '../pages/admin/Dashboard';
import AdminUsers       from '../pages/admin/Users';
import AdminAuctions    from '../pages/admin/Auctions';
import AdminCategories  from '../pages/admin/Categories';
import AdminReports     from '../pages/admin/Reports';
import AdminDisputes    from '../pages/admin/Disputes';
import AdminAnalytics   from '../pages/admin/Analytics';
import AdminSettings    from '../pages/admin/Settings';
import LiveAuctions        from '../pages/live/LiveAuctions';
import LiveAuctionRoom     from '../pages/live/LiveAuctionRoom';
import SellerLiveMonitor   from '../pages/live/SellerLiveMonitor';
import WaitingRoom         from '../pages/live/WaitingRoom';
import AdminNotifications from '../pages/notifications/Notifications';
import { PublicOnly, RequireAuth } from '../components/auth/RouteGuards';

function AppRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Landing />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
      </Route>

      {/* Buyer */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<RequireAuth roles={['buyer']}><Dashboard /></RequireAuth>} />
        <Route path="/auctions" element={<RequireAuth roles={['buyer', 'seller', 'admin']}><Auctions /></RequireAuth>} />
        <Route path="/auctions/:id" element={<RequireAuth roles={['buyer', 'seller', 'admin']}><AuctionDetail /></RequireAuth>} />
        <Route path="/bids"    element={<RequireAuth roles={['buyer']}><MyBids /></RequireAuth>} />
        <Route path="/orders"  element={<RequireAuth roles={['buyer']}><BuyerOrders /></RequireAuth>} />
        <Route path="/watchlist" element={<RequireAuth roles={['buyer']}><Watchlist /></RequireAuth>} />
        <Route path="/messages" element={<RequireAuth roles={['buyer']}><Messages /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth roles={['buyer']}><Notifications /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth roles={['buyer', 'seller', 'admin']}><Profile /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth roles={['buyer', 'seller', 'admin']}><Settings /></RequireAuth>} />
        {/* Live Auctions — Buyer */}
        <Route path="/live"              element={<RequireAuth roles={['buyer']}><LiveAuctions /></RequireAuth>} />
        <Route path="/live/:id"          element={<RequireAuth roles={['buyer']}><LiveAuctionRoom /></RequireAuth>} />
        <Route path="/waiting/:id"       element={<RequireAuth roles={['buyer']}><WaitingRoom /></RequireAuth>} />
      </Route>

      {/* Seller */}
      <Route element={<MainLayout />}>
        <Route path="/seller/dashboard" element={<RequireAuth roles={['seller']}><SellerDashboard /></RequireAuth>} />
        <Route path="/seller/my-auctions" element={<RequireAuth roles={['seller']}><SellerMyAuctions /></RequireAuth>} />
        <Route path="/seller/create-auction" element={<RequireAuth roles={['seller']}><CreateAuction /></RequireAuth>} />
        <Route path="/seller/edit-auction/:id" element={<RequireAuth roles={['seller']}><EditAuction /></RequireAuth>} />
        <Route path="/seller/auctions/:id" element={<RequireAuth roles={['seller']}><AuctionDetail /></RequireAuth>} />
        <Route path="/seller/orders" element={<RequireAuth roles={['seller']}><SellerOrders /></RequireAuth>} />
        <Route path="/seller/analytics" element={<RequireAuth roles={['seller']}><SellerAnalytics /></RequireAuth>} />
        <Route path="/seller/notifications" element={<RequireAuth roles={['seller']}><SellerNotifications /></RequireAuth>} />
        <Route path="/seller/messages" element={<RequireAuth roles={['seller']}><SellerMessages /></RequireAuth>} />
        <Route path="/seller/profile" element={<RequireAuth roles={['seller']}><SellerProfile /></RequireAuth>} />
        <Route path="/seller/settings" element={<RequireAuth roles={['seller']}><SellerSettings /></RequireAuth>} />
        {/* Live Auctions — Seller */}
        <Route path="/seller/live"           element={<RequireAuth roles={['seller']}><LiveAuctions /></RequireAuth>} />
        <Route path="/seller/live/:id"       element={<RequireAuth roles={['seller']}><SellerLiveMonitor /></RequireAuth>} />
        <Route path="/seller/waiting/:id"    element={<RequireAuth roles={['seller']}><WaitingRoom /></RequireAuth>} />
      </Route>

      {/* Admin Login (No Layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard"  element={<RequireAuth roles={['admin']}><AdminDashboard /></RequireAuth>}  />
        <Route path="/admin/users"      element={<RequireAuth roles={['admin']}><AdminUsers /></RequireAuth>}      />
        <Route path="/admin/auctions"   element={<RequireAuth roles={['admin']}><AdminAuctions /></RequireAuth>}   />
        <Route path="/admin/categories" element={<RequireAuth roles={['admin']}><AdminCategories /></RequireAuth>} />
        <Route path="/admin/reports"    element={<RequireAuth roles={['admin']}><AdminReports /></RequireAuth>}    />
        <Route path="/admin/disputes"   element={<RequireAuth roles={['admin']}><AdminDisputes /></RequireAuth>}   />
        <Route path="/admin/analytics"      element={<RequireAuth roles={['admin']}><AdminAnalytics /></RequireAuth>}      />
        <Route path="/admin/settings"        element={<RequireAuth roles={['admin']}><AdminSettings /></RequireAuth>}        />
        <Route path="/admin/notifications"   element={<RequireAuth roles={['admin']}><AdminNotifications /></RequireAuth>}   />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;