import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import HomeAfterLogIn from './pages/HomeAfterLogIn';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';
import WishList from './pages/WishList'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<WishList />} />
        <Route path="/home" element={<HomeAfterLogIn />} />
        <Route path="/add-item" element={<AddItem />} />
      </Routes>
    </BrowserRouter>
  );
}