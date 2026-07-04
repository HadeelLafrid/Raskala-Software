import { Heart, User, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Item({ item, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();

const handleVisit = () => {
  navigate(`/product/${item.id}`); // ✅ Changed to lowercase to match route
};

  const getStatusBadge = (status) => {
    if (status === 'new') {
      return (
        <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
          New
        </span>
      );
    } else if (status === 'old') {
      return (
        <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
          Old
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {/* Heart Icon */}
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Price */}
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {item.price}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {item.title}
        </h3>

        {/* Original Price */}
        <p className="text-sm text-gray-500 line-through mb-3">
          {item.originalPrice}
        </p>

        {/* Status Badge */}
        <div className="mb-4">
          {getStatusBadge(item.status)}
        </div>

        {/* Divider Line */}
        <hr className="border-gray-200 mb-4" />

        {/* Seller and Date */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{item.seller}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{item.date}</span>
          </div>
        </div>

        {/* Location and Visit Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{item.location}</span>
          </div>
          
          {/* Visit Button with navigation */}
          <button 
            onClick={handleVisit}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-8 rounded-full transition-colors duration-300"
          >
            Visit
          </button>
        </div>
      </div>
    </div>
  );
}