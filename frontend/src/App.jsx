import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HomeAfterLogIn from './pages/HomeAfterLogIn';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';
import WishList from './pages/WishList'
import EditProfile from './pages/EditProfile';
import BrowseCategories from './pages/BrowseCategories';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/" element={<WishList />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/home-after-login" element={<HomeAfterLogIn />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishList" element={<WishList />} />
        <Route path="/browse-categories" element={<BrowseCategories />} />
      </Routes>
    </BrowserRouter>
  );
}