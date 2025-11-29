import { useState } from 'react';
import WishItem from './WishItem';
import itemImage from '../assets/images/item.png';
import COLORS from '../constants/colors';

export default function WishListItems() {
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
  const [wishlistItems, setWishlistItems] = useState(items);
  const [favorites, setFavorites] = useState({
    1: true,
    2: true,
    3: true,
    4: true
  });
  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,         
      [id]: !prev[id]    
    }));
  };

  const handleRemoveItem = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    setFavorites(prev => {
      const newFavorites = { ...prev };
      delete newFavorites[id];
      return newFavorites;
    });
    
    console.log('Removed item:', id);
  };

  return (
    <section id='wishlist-items' className="py-16" style={{ backgroundColor: COLORS.background.white}}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8" style={{ color: COLORS.text.primary }}>My Wishlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <WishItem
                key={item.id}
                item={item}
                isFavorite={favorites[item.id]}
                onToggleFavorite={toggleFavorite}
                onRemove={handleRemoveItem}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p style={{ color: COLORS.text.secondary }}>Your wishlist is empty</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}