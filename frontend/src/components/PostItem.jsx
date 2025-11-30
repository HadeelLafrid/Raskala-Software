import hero from '../assets/images/hero.png';
import { useState } from 'react';
import COLORS from '../constants/colors';
export default function PostItem({ post, isOwnProfile = false, onPostUpdate, onPostDelete }) {
  const [currentPost, setCurrentPost] = useState(post);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedPost = {
        ...currentPost,
        likes: (currentPost.likes || 0) + 1,
        isLiked: true
      };
      setCurrentPost(updatedPost);
      if (onPostUpdate) {
        onPostUpdate(updatedPost);
      }  
      console.log('Liked post:', id);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };
  const handleEdit = async () => {
    try {
      window.location.href = `/edit-post/${id}`;
      console.log('Edit post:', id);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };
  const handleDelete = async () => {
    if (isDeleting) return;
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (onPostDelete) {
        onPostDelete(id);
      }
      console.log('Deleted post:', id);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
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
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={image || '/src/assets/images/default-post.png'}
          alt={title || 'Post image'}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.src = '/src/assets/images/default-post.png';
          }}
        />
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
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className="px-4 py-1 rounded text-sm transition-opacity flex items-center gap-1 hover:opacity-90"
            style={{
              backgroundColor: isLiking ? COLORS.primary.lime + '80' : COLORS.primary.lime,
              color: COLORS.text.primary,
              cursor: isLiking ? 'not-allowed' : 'pointer'
            }}
          >
            {isLiking ? (
              <>
                <span>Liking...</span>
                <div 
                  className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: COLORS.text.primary }}
                ></div>
              </>
            ) : (
              <>
                <span>Like</span>
                {likes > 0 && (
                  <span className="text-xs">({likes})</span>
                )}
              </>
            )}
          </button>
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