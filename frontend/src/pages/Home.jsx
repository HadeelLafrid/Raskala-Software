import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import PopularItems from '../components/PopularItems';
import Publicity from '../components/Publicity';
// import ContactSection from '../components/ContactSection';

export default function Home() {
  return (
    <main className="flex-grow">
      <Header/>
      <Hero />
      <Categories />
      <Publicity />
      <PopularItems />
      <Footer/>
      {/* <ContactSection /> */}
    </main>
  ); 
}