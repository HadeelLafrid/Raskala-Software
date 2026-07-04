import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import Item from '../components/Item';
import { getCategories, getProducts } from '../services/api';
import { useSearch } from '../contexts/SearchContext';
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

export default function BrowseCategories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery: globalSearchQuery, selectedCategory: globalSelectedCategory } = useSearch();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
          
          // Check if there's a category param in URL
          const categoryId = searchParams.get('category');
          const searchParam = searchParams.get('search');
          
          if (categoryId) {
            const category = response.data.find(cat => cat.id === categoryId);
            if (category) {
              setSelectedCategory(category);
            }
          }
          
          // Set search keyword from URL if present
          if (searchParam) {
            setSearchKeyword(searchParam);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [searchParams]);

  // Sync global search context with local state
  useEffect(() => {
    if (globalSearchQuery) {
      setSearchKeyword(globalSearchQuery);
    }
  }, [globalSearchQuery]);

  useEffect(() => {
    if (globalSelectedCategory && globalSelectedCategory !== 'all') {
      const category = categories.find(cat => cat.category_id === globalSelectedCategory || cat.id === globalSelectedCategory);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [globalSelectedCategory, categories]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) {
        setProducts([]);
        return;
      }

      try {
        setProductsLoading(true);
        
        const params = {
          category_id: selectedCategory.id || selectedCategory.category_id,
          sort: sortOrder
        };
        
        if (searchKeyword.trim()) {
          params.search = searchKeyword.trim();
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
          
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchKeyword, sortOrder]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category: category.id });
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSearchParams({});
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderLoggedIn />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-400 to-orange-400 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {selectedCategory ? selectedCategory.name : 'Browse All Categories'}
          </h1>
          <p className="text-white text-lg md:text-xl">
            {selectedCategory 
              ? `Showing products in ${selectedCategory.name}` 
              : `Explore ${categories.length} categories with thousands of items`}
          </p>
          {selectedCategory && (
            <button
              onClick={handleClearCategory}
              className="mt-4 bg-white text-pink-500 px-6 py-2 rounded-full font-semibold hover:bg-pink-50 transition-colors"
            >
              ← Back to All Categories
            </button>
          )}
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          {selectedCategory ? (
            // Filters for Product View
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="w-full md:flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium whitespace-nowrap">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>

              {/* Results Count */}
              {!productsLoading && (
                <div className="text-gray-600 text-sm whitespace-nowrap">
                  {products.length} {products.length === 1 ? 'result' : 'results'} found
                </div>
              )}
            </div>
          ) : (
            // Search for Categories
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="w-full md:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">Loading...</p>
            </div>
          ) : selectedCategory ? (
            // Show Products for Selected Category
            <div>
              {productsLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-xl">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-xl">
                    {searchKeyword ? `No products found matching "${searchKeyword}"` : 'No products found in this category'}
                  </p>
                  {searchKeyword && (
                    <button
                      onClick={() => setSearchKeyword('')}
                      className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((item) => (
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
          ) : (
            // Show Categories Grid
            <>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-xl">No categories found matching "{categorySearchTerm}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group"
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {categoryIcons[category.name] || '📦'}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          View products
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
