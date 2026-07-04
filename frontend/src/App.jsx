import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext';
import { UserProvider } from './contexts/UserContext';
import Home from './pages/Home';
import HomeAfterLogIn from './pages/HomeAfterLogIn';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import WishList from './pages/WishList'
import EditProfile from './pages/EditProfile';
import BrowseCategories from './pages/BrowseCategories';
import Messages from './pages/messages';
import AdminUsers from './pages/admin/adminUsers';
import AdminReviews from './pages/admin/AdminPublicationReviews';
import AdminSettings from './pages/admin/AdminSettings';
 import ProductDetailsPage from './pages/productdetails'; // ✅ Use the one with handleChat
import AdminDashboard from "./pages/admin/AdminDashboard";
import EditProduct from './components/EditProduct';

export default function App() {
  return (
    <UserProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home-after-login" element={<HomeAfterLogIn />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/SignUpPage" element={<SignUpPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/browse-categories" element={<BrowseCategories />} />
            <Route path="/messages" element={<Messages />} />
            
            {/* ✅ FIX: Use ONE route for product details */}
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/AdminReviews" element={<AdminReviews />} />
            <Route path="/AdminSettings" element={<AdminSettings />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </UserProvider>
  );
}