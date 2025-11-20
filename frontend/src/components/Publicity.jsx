import pubImage from '../assets/images/pub.png';

export default function Publicity() {
  return (
    <section  className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Publicity</h2>
        
        {/* Scrolling Banner */}
        <div className="relative overflow-hidden bg-gray-100 rounded-lg py-4">
          <div className="flex animate-scroll">
            {/* Repeat images for continuous scroll effect */}
            {[...Array(20)].map((_, index) => (
              <div key={index} className="shrink-0 px-2">
                <img 
                  src={pubImage}
                  alt="Advertisement" 
                  className="h-24 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* it is supposed to be in index.css, but i prefered here for more clean code */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          display: flex;
          animation: scroll 30s linear infinite;
          width: fit-content;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}