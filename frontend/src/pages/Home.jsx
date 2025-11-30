import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import PopularItems from '../components/PopularItems';
import Publicity from '../components/Publicity';
import WelcomeModal from '../components/WelcomeModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <main className="flex-grow">
      <Header/>
      <Hero />
      <Categories />
      <Publicity />
      <PopularItems />
      <Footer/>
      <WelcomeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  ); 
}