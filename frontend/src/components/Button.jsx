export function PrimaryButton({ children, onClick, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-lime-400 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:from-lime-500 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
export function SecondaryButton({ children, onClick, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-pink-400 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-500 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
export function OutlineButton({ children, onClick, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-transparent border-2 border-lime-500 text-lime-600 px-6 py-3 rounded-full font-semibold hover:bg-lime-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
export function TextButton({ children, onClick, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-gray-600 hover:text-lime-600 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
export function IconButton({ children, onClick, className = '', disabled = false, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-lime-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function FullWidthButton({ children, onClick, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r from-lime-400 to-green-500 text-white py-3 rounded-full font-semibold hover:from-lime-500 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function SmallButton({ children, onClick, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-lime-400 to-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm hover:from-lime-500 hover:to-green-600 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
export function LinkButton({ children, href, className = '' }) {
  return (
    
     <a href={href}
      className={`text-pink-500 hover:text-pink-600 font-semibold transition-colors duration-200 ${className}`}
    >
      {children}
    </a>
  );
}