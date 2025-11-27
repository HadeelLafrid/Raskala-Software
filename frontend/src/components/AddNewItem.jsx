import { useState } from 'react';

export default function AddNewItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: 5,
    location: ''
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert('You can only upload up to 10 images');
      return;
    }
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > 10) {
      alert('You can only upload up to 10 images');
      return;
    }
    
    const newImages = imageFiles.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    console.log('Images:', images);
    // Add the submission logic here - to do for backend Team
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Publish Items Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-pink-500 mb-3">Publish Items</h2>
            <p className="text-sm text-gray-600 mb-6">
            Fill out the details  bellow to put your item on the marketplace
            </p>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="text-l font-bold text-gray-900 mb-3">
                Add photos
              </label>
              <p className="text-sm text-gray-600 mb-6">
              Drag & drop up to 10 photos or browse your files. The first photo will be the main one
              </p>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-pink-500 bg-pink-100' 
                    : 'border-gray-300 bg-pink-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-600 mb-2">
                    <svg className="w-12 h-12 mx-auto mb-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-medium">Drag & drop your photos here</p>
                    <p className="text-xs text-gray-500 mt-1">Upload up to 10 Images ({images.length}/10)</p>
                  </div>
                  <button type="button" className="mt-3 bg-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors">
                    Choose File
                  </button>
                </label>
              </div>
              
              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img.url} 
                        alt={`Upload ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg" 
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* About The Item */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">About The Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  e.g., Meuble Salon
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Item title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50"
                />
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Description</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Include condition, features, reason for selling..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50"
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Category</h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50 appearance-none"
            >
              <option value="">Select a category</option>
              <option value="clothe">Clothes</option>
              <option value="informatique">Computer Science</option>
              <option value="sport">Sports</option>
              <option value="meuble">Furniture</option>
              <option value="electro">Household appliances</option>
              <option value="piece">Spare part</option>
            </select>
          </div>

          {/* Set Price & Condition */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Set Price & Condition</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asking Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  DZD
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Condition (1 = Poor, 10 = Brand New)
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">1</span>
                <input
                  type="range"
                  name="condition"
                  min="1"
                  max="10"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="flex-grow h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <span className="text-sm text-gray-600">10</span>
                <span className="ml-4 text-lg font-semibold text-pink-500 min-w-[2rem]">
                  {formData.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
            <p className="text-sm text-gray-600 mb-3">
              This is based on the location you've set up in your account
            </p>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50"
            />
          </div>

          {/* Submit Button */}
          
          <div className="flex justify-end mb-10">
          <button
              type="submit"
            //   className="bg-gradient-to-r from-gray-400 to-gray-500 text-black px-8 py-3 rounded-full font-semibold hover:from-green-500 hover:to-black-600 transition-all shadow-lg"
              className="bg-gradient-to-r text-black px-8 py-3 rounded-full font-semibold 
                        hover:from-gray-200 hover:to-gray-300 transition-all shadow-lg"

            >
              Save as draft
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg"
            >
              Publish item
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}