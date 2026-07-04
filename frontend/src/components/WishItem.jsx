import { useNavigate } from 'react-router-dom';
import COLORS from '../constants/colors';

export default function WishItem({ item, isFavorite, onToggleFavorite, onRemove }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${item.id}`);
  };

  const imageUrl = item.image || item.images?.[0]?.url;

  return (
    <div 
      className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      style={{ backgroundColor: COLORS.neutral.gray }}
      onClick={handleClick}
    >
      <div className="relative h-64">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>{item.title}</h3>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xl font-bold" style={{ color: COLORS.text.primary }}>{item.price}</p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
              className="transition-opacity hover:opacity-80"
              style={{ color: COLORS.primary.pink }}
              aria-label="Toggle favorite"
            >
              <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              className="transition-opacity hover:opacity-80"
              style={{ color: COLORS.text.secondary }}
              aria-label="Remove item"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-sm" style={{ color: COLORS.text.secondary }}>{item.seller}</p>
        <p className="text-xs" style={{ color: COLORS.text.secondary }}>{item.date}</p>
      </div>
    </div>
  );
}