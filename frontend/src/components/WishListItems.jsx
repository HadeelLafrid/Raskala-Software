import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WishItem from './WishItem';
import { getFavorites, removeFromFavorites } from '../services/api';
import itemImage from '../assets/images/item.png';
import COLORS from '../constants/colors';

export default function WishListItems() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError('Please log in to view your wishlist');
        return;
      }

      try {
        setLoading(true);
        const response = await getFavorites();
        
        if (response.success && response.favorites) {
          // Transform backend data to match WishItem component format
          const transformedItems = response.favorites.map(product => ({
            id: product.id,
            price: `${product.price.toLocaleString()} DA`,
            title: product.title,
            originalPrice: '',
            seller: `by ${product.user?.name || 'Unknown'}`,
            date: new Date(product.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            image: product.images?.[0]?.url || itemImage,
            location: product.location || 'Unknown',
            status: product.status,
            description: product.description,
            category: product.category
          }));
          
          setWishlistItems(transformedItems);
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        if (err.response?.status === 401) {
          // User is not authenticated, redirect to login
          alert('Please log in to view your wishlist');
          navigate('/LoginPage');
        } else {
          setError('Failed to load wishlist');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate, isAuthenticated]);
  const handleRemoveItem = async (id) => {
    try {
      await removeFromFavorites(id);
      // Remove from local state after successful API call
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

  if (loading) {
    return (
      <section id='wishlist-items' className="py-16" style={{ backgroundColor: COLORS.background.white}}>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p style={{ color: COLORS.text.secondary }}>Loading your wishlist...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id='wishlist-items' className="py-16" style={{ backgroundColor: COLORS.background.white}}>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p style={{ color: COLORS.primary.pink }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id='wishlist-items' className="py-16" style={{ backgroundColor: COLORS.background.white}}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <WishItem
                key={item.id}
                item={item}
                isFavorite={true}
                onToggleFavorite={handleRemoveItem}
                onRemove={handleRemoveItem}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p style={{ color: COLORS.text.secondary }}>Your wishlist is empty</p>
              <button
                onClick={() => navigate('/browse-categories')}
                className="mt-4 px-6 py-2 rounded-full font-semibold transition-colors"
                style={{ 
                  backgroundColor: COLORS.primary.pink,
                  color: COLORS.neutral.white
                }}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}