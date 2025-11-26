import { Link } from 'react-router-dom';

export default function Categories() {
    const categories = [
      { name: 'Clothes', pubs: 129, image: '👕' },
      { name: 'Computer Science', pubs: 95, image: '💻' },
      { name: 'Sports', pubs: 75, image: '⚽' },
      { name: 'Spare part', pubs: 64, image: '🔧' },
      { name: 'Furniture', pubs: 80, image: '🪑' },
      { name: 'Household appliances', pubs: 58, image: '🔌' }
    ];
  
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
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
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-xl p-3 text-4xl">
                    {category.image}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-gray-700">{category.pubs} pub</p>
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
              </div>
            ))}
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