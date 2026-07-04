import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCategories } from '../services/api';
import { useSearch } from '../contexts/SearchContext';

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateSearch } = useSearch();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSearch(query, category);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    updateSearch(searchQuery, selectedCategory);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearch(searchQuery, category);
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center gap-2">
      <select
        value={category}
        onChange={handleCategoryChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>
            {cat.category_name || cat.name}
          </option>
        ))}
      </select>
      
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchInput}
        placeholder="Search items..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
      
      <button
        type="submit"
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
      >
        Search
      </button>
    </form>
  );
}
