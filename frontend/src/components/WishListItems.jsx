import { useState } from 'react';
import WishItem from './WishItem';
import itemImage from '../assets/images/item.png';

export default function WishListItems() {
  // Array of wishlist items data
  const items = [
    {
      id: 1,
      price: '5000 DA',
      title: 'Meuble Salon',
      originalPrice: 'était 8670',
      rating: 4.8,
      reviews: 73,
      seller: 'by Admin',
      date: '20 July, 2024',
      image: itemImage
    },
    {
      id: 2,
      price: '5000 DA',
      title: 'Meuble Salon',
      originalPrice: 'était 8670',
      rating: 4.8,
      reviews: 73,
      seller: 'by Amine',
      date: '20 July, 2024',
      image: itemImage
    },
    {
      id: 3,
      price: '5000 DA',
      title: 'Meuble Salon',
      originalPrice: 'était 8670',
      rating: 4.8,
      reviews: 73,
      seller: 'by Admin',
      date: '20 July, 2024',
      image: itemImage
    },
    {
      id: 4,
      price: '5000 DA',
      title: 'Meuble Salon',
      originalPrice: 'était 8670',
      rating: 4.8,
      reviews: 73,
      seller: 'by Amine',
      date: '20 July, 2024',
      image: itemImage
    }
  ];

  // State to track favorited items by id - all items favorited by default
  const [favorites, setFavorites] = useState({
    1: true,
    2: true,
    3: true,
    4: true
  });

  // Toggle favorite status for specific item
  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,           // Spread existing favorites
      [id]: !prev[id]    // Toggle the specific item's favorite status
    }));
  };

  // Handler for removing item from wishlist
  const handleRemoveItem = (id) => {
    // Add remove logic here (e.g., filter items array or call API)
    console.log('Remove item:', id);
  };

  return (
    <section id='wishlist-items' className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h2>
        
        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <WishItem
              key={item.id}
              item={item}
              isFavorite={favorites[item.id]}
              onToggleFavorite={toggleFavorite}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
}