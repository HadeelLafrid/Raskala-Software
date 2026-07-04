import Header from "../components/HeaderLoggedIn";
import Footer from "../components/Footer";
import ProductDetails from "../components/productdetail";

export default function ProductDetailsPage() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-grow">
        <ProductDetails />
      </main>
      <Footer />
    </div>
  );
}