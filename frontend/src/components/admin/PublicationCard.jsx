const PublicationCard = ({ publication }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex p-4 gap-4">
        {/* Image */}
        <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={publication.imageUrl}
            alt={publication.title}
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Middle content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            {publication.title}
          </h3>
          <div className="mt-1 text-blue-600 font-bold text-sm">
            {publication.price}
          </div>
  
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span>📱 {publication.category}</span>
            <span>👤 {publication.seller}</span>
          </div>
  
          <div className="mt-2 text-xs text-gray-400">
            {publication.postedAgo}
          </div>
        </div>
  
        {/* Right badge */}
        <div className="flex items-start">
          <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
            {publication.urgency}
          </span>
        </div>
      </div>
    );
  };
  
  export default PublicationCard;
  