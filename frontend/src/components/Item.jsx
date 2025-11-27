export default function Item({ item, isFavorite, onToggleFavorite }) {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-56 object-cover"
          />
        </div>
  
        {/* Content */}
        <div className="p-5">
          {/* Price and Favorite Button */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-blue-600">{item.price}</h3>
            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg
                className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
  
          {/* Title */}
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {item.title}
          </h4>
  
          {/* Original Price */}
          <p className="text-sm text-gray-500 mb-3">{item.originalPrice}</p>
  
          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({item.rating} Reviews)
            </span>
          </div>
  
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {item.seller}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.date}
              </span>
            </div>
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all">
              Visit
            </button>
          </div>
        </div>
      </div>
    );
  }