export default function wishItem({ item, isFavorite, onToggleFavorite }) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image section - no heart button */}
        <div className="relative h-64">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
          
          {/* Price line with heart and trash */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold text-gray-900">{item.price}</p>
            
            <div className="flex items-center gap-3">
              {/* Red heart button */}
              <button
                onClick={() => onToggleFavorite(item.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
                aria-label="Toggle favorite"
              >
                <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
  
              {/* Trash button */}
              <button
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Remove item"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
  
          <p className="text-sm text-gray-600">{item.seller}</p>
          <p className="text-xs text-gray-500">{item.date}</p>
        </div>
      </div>
    );
  }