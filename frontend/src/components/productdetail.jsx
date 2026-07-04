import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Phone, MessageCircle, CheckCircle, Calendar, Truck, User, Facebook, Share2, Heart } from 'lucide-react';
import { getProduct } from '../services/api';
import api from '../api/axios';
import useFavorites from '../hooks/useFavorites';
import itemImage from '../assets/images/item.png';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingChat, setStartingChat] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Handle chat button click
  const handleChat = async () => {
    if (!product?.id) return; // ✅ FIXED: Changed from product_id to id
    
    setStartingChat(true);
    
    try {
      const response = await api.post('/chats/start', {
        product_id: product.id // ✅ FIXED: Changed from product.product_id to product.id
      });
      
      if (response.data.success) {
        navigate(`/messages?chatId=${response.data.chat_id}`);
      }
    } catch (err) {
      console.error('Failed to start chat:', err);
      
      if (err.response?.status === 422) {
        alert('You cannot chat with yourself on your own product');
      } else {
        alert('Failed to start chat. Please try again.');
      }
    } finally {
      setStartingChat(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(id);
        
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error || 'Product not found'}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const safetyTips = [
    'Meet in a safe, public location',
    'Check the item before purchase',
    'Never send money in advance',
    'Use secure payment methods',
    'Report suspicious activity'
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="mb-4">
                <img
                  src={product.images?.[selectedImage]?.url || itemImage}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              {product.images && product.images.length > 0 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-1 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-yellow-400' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="text-pink-500 text-sm font-semibold mb-2">
                {product.category || 'Uncategorized'}
              </div>
              
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">
                  {product.title}
                </h1>
                <button
                  onClick={() => toggleFavorite(id)}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110"
                  title={isFavorite(id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite(id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{product.location || 'Unknown'}</span>
              </div>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">
                  {product.price.toLocaleString()} DA
                </span>
              </div>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  <span className="text-sm">
                    <span className="font-semibold">Status:</span> {product.status}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm">Posted on {new Date(product.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-full flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Seller
                </button>
                <button 
                  onClick={handleChat}
                  disabled={startingChat}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {startingChat ? 'Starting...' : 'Chat'}
                </button>
              </div>
              
              {/* Seller Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
                <Link
                  to={product.user?.id ? `/profile/${product.user.id}` : '/profile'}
                  className="flex items-center hover:opacity-90 transition-opacity"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900">{product.user?.name || 'Anonymous'}</span>
                      <CheckCircle className="w-4 h-4 ml-1 text-blue-500" />
                    </div>
                    <div className="text-sm text-gray-600">
                      Member since {new Date(product.user?.created_at).getFullYear()}
                    </div>
                  </div>
                </Link>
              </div>
              
              {/* Safety Tips */}
              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Safety Tips</h3>
                </div>
                <ul className="space-y-1">
                  {safetyTips.map((tip, index) => (
                    <li key={index} className="text-xs text-gray-700">• {tip}</li>
                  ))}
                </ul>
              </div>
              
              {/* Share Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Share this product</h3>
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center transition-colors">
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </button>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center transition-colors">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}