import { useState, useEffect } from 'react';
import { getFavoriteIds, addToFavorites, removeFromFavorites } from '../services/api';

/**
 * Custom hook for managing product favorites/wishlist
 * Handles fetching favorite IDs, toggling favorites, and managing state
 */
export default function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Fetch user's favorite IDs on mount
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getFavoriteIds();
        if (response.success && response.favorite_ids) {
          setFavoriteIds(new Set(response.favorite_ids));
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteIds();
  }, [isAuthenticated]);

  // Check if a product is favorited
  const isFavorite = (productId) => {
    return favoriteIds.has(productId);
  };

  // Toggle favorite status
  const toggleFavorite = async (productId) => {
    // Require authentication
    if (!isAuthenticated) {
      alert('Please log in to add items to your wishlist');
      return;
    }

    const wasFavorite = favoriteIds.has(productId);

    // Optimistic update
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (wasFavorite) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    try {
      if (wasFavorite) {
        await removeFromFavorites(productId);
      } else {
        await addToFavorites(productId);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert optimistic update on error
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        if (wasFavorite) {
          newSet.add(productId);
        } else {
          newSet.delete(productId);
        }
        return newSet;
      });
      
      // Show error message
      if (err.response?.status === 401) {
        alert('Please log in to manage your wishlist');
      } else {
        alert('Failed to update wishlist. Please try again.');
      }
    }
  };

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    loading,
    error,
    isAuthenticated
  };
}
