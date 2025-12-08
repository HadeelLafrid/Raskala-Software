import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AdminTemplate from './pages/admin/adminTemplate';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/" element={<WishList />} /> */}
        <Route path="/" element={<AdminTemplate/>} />
        <Route path="/home-after-login" element={<HomeAfterLogIn />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/wishList" element={<WishList />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/browse-categories" element={<BrowseCategories />} />
        {/* <Route path="/adminTemplate" element={<AdminTemplate />} /> */}
      </Routes>
    </BrowserRouter>

  );
}