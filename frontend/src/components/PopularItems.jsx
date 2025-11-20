import { useState } from 'react';
import Item from './Item';
import itemImage from '../assets/images/item.png';

export default function PopularItems() {
  const items = [
    {
      id: 1,
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
      id: 2,
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
    },
    {
      id: 5,
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
      id: 6,
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

  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id='popular-items' className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Our Most Popular Items
        </h2>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
              isFavorite={favorites[item.id]}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
}