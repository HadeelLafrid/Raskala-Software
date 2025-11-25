import sponsorImage from '../assets/images/sponsor.png';

export default function Sponsored() {
  const sponsoredItems = [
    {
      id: 1,
      image: sponsorImage,
      date: '20 July, 2024',
      title: 'Residence el Qods , chraga alger Location des appartement',
      author: 'Admin',
      buttonColor: 'bg-lime-400 hover:bg-lime-500'
    },
    {
      id: 2,
      image: sponsorImage,
      date: '20 July, 2024',
      title: 'Residence el Qods , chraga alger Location des appartement',
      author: 'Admin',
      buttonColor: 'bg-orange-400 hover:bg-orange-500'
    },
    {
      id: 3,
      image: sponsorImage,
      date: '20 July, 2024',
      title: 'Residence el Qods , chraga alger Location des appartement',
      author: 'Admin',
      buttonColor: 'bg-pink-400 hover:bg-pink-500'
    },
    {
      id: 4,
      image: sponsorImage,
      date: '20 July, 2024',
      title: 'Residence el Qods , chraga alger Location des appartement',
      author: 'Admin',
      buttonColor: 'bg-cyan-400 hover:bg-cyan-500'
    },
    {
      id: 5,
      image: sponsorImage,
      date: '20 July, 2024',
      title: 'Residence el Qods , chraga alger Location des appartement',
      author: 'Admin',
      buttonColor: 'bg-yellow-400 hover:bg-yellow-500'
    },
    {
      id: 6,
      image: sponsorImage,
      date: '20 July, 2024',
      title: 'Residence el Qods , chraga alger Location des appartement',
      author: 'Admin',
      buttonColor: 'bg-cyan-400 hover:bg-cyan-500'
    },
    {
      id: 7,
      image: sponsorImage,
      date: '20 July, 2024',
      title: 'Residence el Qods , chraga alger Location des appartement',
      author: 'Admin',
      buttonColor: 'bg-purple-400 hover:bg-purple-500'
    },
    {
      id: 8,
      image: sponsorImage,
      date: '20 July, 2024',
      title: 'Residence el Qods , chraga alger Location des appartement',
      author: 'Admin',
      buttonColor: 'bg-red-400 hover:bg-red-500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        
          <h2 className="text-4xl text-center mb-12 font-bold text-gray-900">Sponsored</h2>

        {/* Horizontal Scrollable Container */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide hover:scrollbar-show scroll-smooth">
            {sponsoredItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 snap-start"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{item.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-medium text-gray-900 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {item.title}
                  </h3>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {/* Author */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <span>by {item.author}</span>
                    </div>

                    {/* Visit Button */}
                    <button
                      className={`${item.buttonColor} text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors`}
                    >
                      Visite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .hover:scrollbar-show:hover {
          scrollbar-width: thin;
        }
        
        .hover:scrollbar-show:hover::-webkit-scrollbar {
          display: block;
          height: 8px;
        }
        
        .hover:scrollbar-show:hover::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .hover:scrollbar-show:hover::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .hover:scrollbar-show:hover::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </section>
  );
}