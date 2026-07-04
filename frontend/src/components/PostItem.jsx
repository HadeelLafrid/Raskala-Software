import hero from '../assets/images/hero.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import COLORS from '../constants/colors';
import { likeProduct, deleteProduct } from '../services/api';
import useFavorites from '../hooks/useFavorites';

export default function PostItem({ post, isOwnProfile = false, onPostUpdate, onPostDelete }) {
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(post);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    id,
    image,
    title,
    description,
    status,
    likes = 0,
    createdAt,
    user
  } = currentPost || {};
  const imageUrl = image || currentPost?.images?.[0]?.url || '/src/assets/images/default-post.png';
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await likeProduct(id);
      if (response.success) {
        const updatedPost = {
          ...currentPost,
          likes: response.data.likes || (currentPost.likes || 0) + 1,
          isLiked: true
        };
        setCurrentPost(updatedPost);
        if (onPostUpdate) {
          onPostUpdate(updatedPost);
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };
  const handleView = () => {
    navigate(`/product/${id}`);
  };

  const handleEdit = () => {
    window.location.href = `/edit-product/${id}`;
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        if (onPostDelete) {
          onPostDelete(id);
        }
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.message || 'Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  const getStatusStyles = (status) => {
    switch (status) {
      case 'active':
        return { 
          backgroundColor: COLORS.primary.lime + '33', 
          color: COLORS.text.primary 
        };
      case 'expired':
        return { 
          backgroundColor: COLORS.primary.pink + '33', 
          color: COLORS.text.primary 
        };
      case 'draft':
        return { 
          backgroundColor: COLORS.neutral.gray, 
          color: COLORS.text.secondary 
        };
      case 'sold':
        return { 
          backgroundColor: COLORS.primary.yellow + '33', 
          color: COLORS.text.primary 
        };
      default:
        return { 
          backgroundColor: COLORS.neutral.gray, 
          color: COLORS.text.secondary 
        };
    }
  };
  return (
    <div 
      className="flex gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
      style={{ 
        backgroundColor: COLORS.neutral.gray,
        borderColor: COLORS.neutral.gray 
      }}
    >
      <div className="w-24 h-24 flex-shrink-0 relative">
        <img
          src={imageUrl}
          alt={title || 'Post image'}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => { e.target.src = '/src/assets/images/default-post.png'; }}
        />
        {/* Heart/Wishlist Button */}
        <button
          onClick={() => toggleFavorite(id)}
          className="absolute top-1 right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          title={isFavorite(id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite(id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <h3 
          className="mb-2 font-medium truncate"
          style={{ color: COLORS.primary.orange }}
        >
          {title || 'Untitled Post'}
        </h3>
        <p 
          className="text-sm mb-3 line-clamp-2"
          style={{ color: COLORS.text.secondary }}
        >
          {description || 'No description available'}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          
          {status && (
            <span 
              className="px-2 py-1 rounded text-xs"
              style={getStatusStyles(status)}
            >
              {status.toUpperCase()}
            </span>
          )}
          <div className="flex gap-2 ml-auto">
            {isOwnProfile && (
              <>
                <button 
                  onClick={handleEdit}
                  className="px-4 py-1 rounded text-sm transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.primary.yellow,
                    color: COLORS.text.primary
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-1 rounded text-sm transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: isDeleting ? COLORS.primary.pink + '80' : COLORS.primary.pink,
                    color: COLORS.neutral.white,
                    cursor: isDeleting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
            <button 
              onClick={handleView}
              className="px-4 py-1 rounded text-sm transition-opacity hover:opacity-90"
              style={{
                backgroundColor: COLORS.neutral.gray,
                color: COLORS.text.primary
              }}
            >
              View
            </button>
          </div>
        </div>
        {createdAt && (
          <div 
            className="mt-2 text-xs"
            style={{ color: COLORS.text.secondary }}
          >
            Posted on {new Date(createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}