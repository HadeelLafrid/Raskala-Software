import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../services/api';
import { useSearch } from '../contexts/SearchContext';
import Item from './Item';
import useFavorites from '../hooks/useFavorites';
import itemImage from '../assets/images/item.png';

const categoryIcons = {
  'Clothes': '👕',
  'Computer Science': '💻',
  'Sports': '⚽',
  'Spare part': '🔧',
  'Furniture': '🪑',
  'Household appliances': '🔌'
};

export default function Categories() {
    const { searchQuery, selectedCategory } = useSearch();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await getCategories();
          if (response.success && response.data) {
            setCategories(response.data);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    }, []);

    useEffect(() => {
      const fetchSearchResults = async () => {
        if (!searchQuery && selectedCategory === 'all') {
          setSearchResults([]);
          return;
        }

        try {
          setSearchLoading(true);
          
          const params = {
            sort: 'desc'
          };
          
          if (searchQuery.trim()) {
            params.search = searchQuery.trim();
          }
          
          if (selectedCategory && selectedCategory !== 'all') {
            params.category_id = selectedCategory;
          }
          
          const response = await getProducts(params);
          
          if (response.success && response.data) {
            const transformedProducts = response.data.map(product => ({
              id: product.id,
              price: `${product.price.toLocaleString()} DA`,
              title: product.title,
              originalPrice: '',
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
            
            setSearchResults(transformedProducts);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setSearchLoading(false);
        }
      };

      fetchSearchResults();
    }, [searchQuery, selectedCategory]);
  
    const hasSearchActive = searchQuery || selectedCategory !== 'all';
    const selectedCategoryName = categories.find(cat => cat.category_id === selectedCategory)?.category_name;

    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Search Results Section */}
          {hasSearchActive && (
            <div className="mb-16">
              {/* Search Header */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Search Results
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      {searchQuery && (
                        <span className="inline-flex items-center bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          "{searchQuery}"
                        </span>
                      )}
                      {selectedCategoryName && (
                        <span className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {selectedCategoryName}
                        </span>
                      )}
                    </div>
                  </div>
                  {!searchLoading && searchResults.length > 0 && (
                    <div className="text-gray-600 font-medium">
                      Found {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'}
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results Content */}
              {searchLoading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-pink-500 mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading search results...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((product) => (
                      <Item 
                        key={product.id} 
                        item={product}
                        isFavorite={isFavorite(product.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Items Found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any items matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear Search
                  </button>
                </div>
              )}
              
              {/* Divider */}
              <div className="mt-12 mb-8 border-t-2 border-gray-200"></div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Our Categories</h2>
            <div className="flex items-center justify-between">
              <span className="inline-block bg-pink-200 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold">
                Top Search Categories
              </span>
              <Link
                to="/browse-categories" 
                className="text-gray-600 hover:text-pink-400 flex items-center gap-2 font-medium"
              >
                Browse All Categories
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
  
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loading ? (
              <div className="col-span-3 text-center text-gray-500 py-8">Loading categories...</div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/browse-categories?category=${category.id}`}
                  className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white rounded-xl p-3 text-4xl">
                      {categoryIcons[category.name] || '📦'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                      <p className="text-gray-700">View products</p>
                    </div>
                  </div>
                  <svg 
                    className="w-6 h-6 text-gray-800 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ))
            )}
          </div>
  
          {/* Call to Action Banner */}
          <div className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 rounded-3xl p-12 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Give Your Items A Second Life<br />
              Shop Smart. Save Money. Reduce Waste.
            </h2>
          </div>
        </div>
      </section>
    );
  }