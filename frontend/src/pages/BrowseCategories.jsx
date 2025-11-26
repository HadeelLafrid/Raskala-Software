import { useState } from 'react';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';

// Sample category data - replace with actual data from API
const categories = [
  { id: 1, name: 'Electronics', icon: '📱', itemCount: 1234 },
  { id: 2, name: 'Furniture', icon: '🛋️', itemCount: 856 },
  { id: 3, name: 'Clothing', icon: '👕', itemCount: 2341 },
  { id: 4, name: 'Books', icon: '📚', itemCount: 567 },
  { id: 5, name: 'Sports', icon: '⚽', itemCount: 432 },
  { id: 6, name: 'Toys', icon: '🧸', itemCount: 789 },
  { id: 7, name: 'Home & Garden', icon: '🏡', itemCount: 654 },
  { id: 8, name: 'Automotive', icon: '🚗', itemCount: 321 },
  { id: 9, name: 'Music', icon: '🎵', itemCount: 445 },
  { id: 10, name: 'Art', icon: '🎨', itemCount: 234 },
  { id: 11, name: 'Kitchen', icon: '🍳', itemCount: 567 },
  { id: 12, name: 'Beauty', icon: '💄', itemCount: 890 },
];

export default function BrowseCategories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'items') {
      return b.itemCount - a.itemCount;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderLoggedIn />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-400 to-orange-400 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse All Categories
          </h1>
          <p className="text-white text-lg md:text-xl">
            Explore {categories.length} categories with thousands of items
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <span className="text-gray-600 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="name">Name</option>
                <option value="items">Item Count</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {sortedCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">No categories found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {sortedCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.itemCount.toLocaleString()} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
