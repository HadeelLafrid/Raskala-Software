import { useState, useEffect } from 'react';
import Item from './Item';
import { getProducts } from '../services/api';
import useFavorites from '../hooks/useFavorites';
import { useSearch } from '../contexts/SearchContext';
import itemImage from '../assets/images/item.png';

export default function PopularItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { searchQuery, selectedCategory } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build params based on search context
        const params = { sort: 'desc' };
        
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        
        if (selectedCategory !== 'all') {
          params.category_id = selectedCategory;
        }
        
        const response = await getProducts(params);
        
        if (response.success && response.data) {
          // Transform backend data to match Item component format
          const transformedProducts = response.data.map(product => ({
            id: product.id,
            price: `${product.price.toLocaleString()} DA`,
            title: product.title,
            originalPrice: '', // Can be calculated if needed
            status: product.condition >= 8 ? 'new' : 'old',
            seller: `by ${product.user?.name || 'Unknown'}`,
            date: new Date(product.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            location: product.location || 'Unknown',
            image: product.images?.[0]?.url || itemImage,
            allImages: product.images || [],
            description: product.description,
            category: product.category,
            likes: product.likes || 0
          }));
          
          setItems(transformedProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Our Most Popular Items
          </h2>
          <div className="text-center text-gray-500">Loading products...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Our Most Popular Items
          </h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  const getSectionTitle = () => {
    if (searchQuery.trim()) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'Our Most Popular Items';
  };

  return (
    <section id='popular-items' className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          {getSectionTitle()}
        </h2>

        {items.length === 0 ? (
          <div className="text-center text-gray-500">
            {searchQuery.trim() ? `No products found matching "${searchQuery}"` : 'No products available yet'}
          </div>
        ) : (
          /* Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Item
                key={item.id}
                item={item}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}