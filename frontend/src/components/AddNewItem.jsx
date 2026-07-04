import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// API functions
const getLocations = async () => {
  const response = await api.get('/locations');
  return response.data;
};

const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

const createProduct = async (formData) => {
  const response = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default function AddNewItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    categoryId: '',
    price: '',
    condition: 5,
    location: '',
    locationId: ''
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const fileInputRef = useRef(null);

  // Fetch locations and categories on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await getLocations();
        if (response.success && response.data) {
          console.log('Loaded locations:', response.data);
          console.log('Sample location structure:', response.data[0]);
          setLocations(response.data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getCategories();
        if (response.success && response.data) {
          console.log('Loaded categories:', response.data);
          console.log('Sample category structure:', response.data[0]);
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchLocations();
    fetchCategories();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        if (value.trim().length > 100) return 'Title must not exceed 100 characters';
        return '';
      
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 10) return 'Description must be at least 10 characters';
        if (value.trim().length > 1000) return 'Description must not exceed 1000 characters';
        return '';
      
      case 'category':
        if (!formData.categoryId) return 'Please select a category';
        return '';
      
      case 'price':
        if (!value) return 'Price is required';
        if (isNaN(value) || parseFloat(value) <= 0) return 'Price must be a positive number';
        if (parseFloat(value) > 999999999) return 'Price is too high';
        return '';
      
      case 'location':
        if (!formData.locationId) return 'Please select a location';
        return '';
      
      default:
        return '';
    }
  };

  const validateImages = () => {
    if (images.length === 0) return 'At least one image is required';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'condition') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    const imageError = validateImages();
    if (imageError) newErrors.images = imageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
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
    setImages(prev => {
      const updated = [...prev, ...newImages];
      if (updated.length > 0 && errors.images) {
        setErrors(prev => ({
          ...prev,
          images: ''
        }));
      }
      return updated;
    });
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
    setImages(prev => {
      const updated = [...prev, ...newImages];
      if (updated.length > 0 && errors.images) {
        setErrors(prev => ({
          ...prev,
          images: ''
        }));
      }
      return updated;
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setErrors(prevErrors => ({
          ...prevErrors,
          images: 'At least one image is required'
        }));
      }
      return updated;
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      categoryId: '',
      price: '',
      condition: 5,
      location: '',
      locationId: ''
    });
    setImages([]);
    setErrors({});
    setTouched({});
  };

  const navigate = useNavigate();

  const handleSubmit = async (isDraft = false) => {
    if (isSubmitting) return;

    // Validate form before submission
    setTouched({
      title: true,
      description: true,
      category: true,
      price: true,
      location: true,
      images: true
    });

    if (!validateForm()) {
      alert('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate required fields before creating FormData
      if (!formData.categoryId || formData.categoryId.trim() === '') {
        alert('Please select a category');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.locationId || formData.locationId.trim() === '') {
        alert('Please select a location');
        setIsSubmitting(false);
        return;
      }
      
      if (images.length === 0) {
        alert('Please add at least one image');
        setIsSubmitting(false);
        return;
      }

      // Validate that we have valid UUIDs (not names)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      console.log('=== UUID Validation Debug ===');
      console.log('categoryId:', formData.categoryId);
      console.log('locationId:', formData.locationId);
      console.log('categoryId is UUID:', uuidRegex.test(formData.categoryId));
      console.log('locationId is UUID:', uuidRegex.test(formData.locationId));
      
      if (!uuidRegex.test(formData.categoryId)) {
        alert('Invalid category selected. Please refresh the page and try again.');
        console.error('Category ID validation failed:', formData.categoryId);
        setIsSubmitting(false);
        return;
      }
      
      if (!uuidRegex.test(formData.locationId)) {
        alert('Invalid location selected. The location appears to be a name instead of an ID. Please refresh the page and try selecting the location again.');
        console.error('Location ID validation failed:', formData.locationId);
        setIsSubmitting(false);
        return;
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category_id', formData.categoryId.trim());
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('location_id', formData.locationId.trim());
      formDataToSend.append('status', isDraft ? 'draft' : 'pending');

      // Append image files
      images.forEach((img, index) => {
        formDataToSend.append('images[]', img.file);
      });

      // Debug: Log FormData contents
      console.log('=== FormData Debug ===');
      console.log('title:', formData.title);
      console.log('description:', formData.description);
      console.log('category_id:', formData.categoryId);
      console.log('price:', formData.price);
      console.log('location_id:', formData.locationId);
      console.log('status:', isDraft ? 'draft' : 'pending');
      console.log('images count:', images.length);
      console.log('categoryId empty?', !formData.categoryId);
      console.log('locationId empty?', !formData.locationId);
      
      // Log all FormData entries
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], ':', pair[1]);
      }
      console.log('=== End Debug ===');

      // Send to backend
      const response = await createProduct(formDataToSend);
      
      if (response.success) {
        const newProduct = response.data;
        setProducts(prev => [...prev, newProduct]);
        
        const message = isDraft ? 'Item saved as draft!' : 'Item published successfully!';
        alert(message);
        console.log('Product created:', newProduct);
        
        resetForm();
        
        // Redirect to profile after publishing
        if (!isDraft) {
          setTimeout(() => {
            navigate('/profile');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error submitting item:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error('Validation errors:', validationErrors);
        
        // Show specific validation errors
        let errorMessage = 'Validation failed:\n';
        Object.keys(validationErrors).forEach(key => {
          errorMessage += `- ${key}: ${validationErrors[key][0]}\n`;
        });
        alert(errorMessage);
        
        // Set errors in state
        setErrors(prevErrors => ({
          ...prevErrors,
          ...validationErrors
        }));
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to submit item. Please try again.';
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-6">
            
            {/* Publish Items Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-pink-500 mb-3">Publish Items</h2>
              <p className="text-sm text-gray-600 mb-6">
                Fill out the details below to put your item on the marketplace
              </p>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="text-l font-bold text-gray-900 mb-3">
                  Add photos <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-6">
                  Drag & drop up to 10 photos or browse your files. The first photo will be the main one
                </p>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-pink-500 bg-pink-100' 
                      : errors.images && touched.images
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-pink-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-add"
                  />
                  <label
                    htmlFor="image-upload-add"
                    className="cursor-pointer"
                    onClick={(e) => {
                      if (fileInputRef && fileInputRef.current) fileInputRef.current.click();
                    }}
                  >
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
                
                {errors.images && touched.images && (
                  <p className="text-red-500 text-sm mt-2">{errors.images}</p>
                )}
                
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
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Meuble Salon"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.title && touched.title
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-pink-500 bg-pink-50'
                    }`}
                  />
                  {errors.title && touched.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Detailed Description <span className="text-red-500">*</span>
              </h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Include condition, features, reason for selling..."
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description && touched.description
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-pink-500 bg-pink-50'
                }`}
              />
              {errors.description && touched.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Category <span className="text-red-500">*</span>
              </h3>
              <select
                name="category"
                value={formData.categoryId}
                onChange={(e) => {
                  const selectedCategoryId = e.target.value;
                  console.log('=== Category Selection Debug ===');
                  console.log('Selected value from dropdown:', selectedCategoryId);
                  console.log('Available categories:', categories);
                  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
                  console.log('Found category object:', selectedCategory);
                  console.log('Category ID being set:', selectedCategoryId);
                  console.log('Category name being set:', selectedCategory?.name || '');
                  console.log('=== End Category Debug ===');
                  setFormData(prev => ({
                    ...prev,
                    category: selectedCategory?.name || '',
                    categoryId: selectedCategoryId
                  }));
                  
                  setTouched(prev => ({ ...prev, category: true }));
                  const error = validateField('category', selectedCategoryId);
                  setErrors(prev => ({ ...prev, category: error }));
                }}
                onBlur={handleBlur}
                disabled={loadingCategories}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 appearance-none ${
                  errors.category && touched.category
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-pink-500 bg-pink-50'
                }`}
              >
                <option value="">{loadingCategories ? 'Loading categories...' : 'Select a category'}</option>
                {categories && categories.length > 0 && categories.map((category, index) => (
                  <option key={category.id || `category-${index}`} value={category.id}>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && touched.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Set Price & Condition */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Set Price & Condition</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asking Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.price && touched.price
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-pink-500 bg-pink-50'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    DZD
                  </span>
                </div>
                {errors.price && touched.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Location (Wilaya) <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Select your wilaya from the list
              </p>
              {loadingLocations ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500">Loading wilayas...</p>
                </div>
              ) : (
                <select
                  name="locationId"
                  value={formData.locationId}
                  onChange={(e) => {
                    const selectedLocationId = e.target.value;
                    console.log('=== Location Selection Debug ===');
                    console.log('Selected value from dropdown:', selectedLocationId);
                    console.log('Available locations:', locations);
                    const selectedLocation = locations.find(loc => loc.location_id === selectedLocationId);
                    console.log('Found location object:', selectedLocation);
                    console.log('Location ID being set:', selectedLocationId);
                    console.log('Location name being set:', selectedLocation?.wilaya || '');
                    console.log('=== End Location Debug ===');
                    setFormData(prev => ({
                      ...prev,
                      location: selectedLocation?.wilaya || '',
                      locationId: selectedLocationId
                    }));
                    setTouched(prev => ({ ...prev, location: true }));
                    const error = validateField('location', selectedLocationId);
                    setErrors(prev => ({
                      ...prev,
                      location: error
                    }));
                  }}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 appearance-none ${
                    errors.location && touched.location
                      ? 'border-red-300 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-pink-500 bg-pink-50'
                  }`}
                >
                  <option value="">Select your wilaya</option>
                  {locations && locations.length > 0 && locations.map((location, index) => (
                    <option key={location?.location_id || `location-${index}`} value={location.location_id}>
                      {location.wilaya}
                    </option>
                  ))}
                </select>
              )}
              {errors.location && touched.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 mb-10">
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-gray-200 to-gray-300 text-black px-8 py-3 rounded-full font-semibold hover:from-gray-300 hover:to-gray-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save as draft
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publishing...' : 'Publish item'}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Products List Section */}
      {products.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Products ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    {product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'published' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-black'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-500 font-bold text-xl">{product.price} DZD</span>
                      <span className="text-gray-500 text-sm">{product.category}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>📍 {product.location}</span>
                      <span>Condition: {product.condition}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}