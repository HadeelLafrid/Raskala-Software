import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct, getLocations, getCategories } from '../services/api';
import HeaderLoggedIn from './HeaderLoggedIn';
import Footer from './Footer';
import { X, Upload } from 'lucide-react';

export default function EditProduct() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    categoryId: '',
    price: '',
    condition: 5,
    location: '',
    locationId: '',
    status: 'active'
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch product, locations and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productResponse = await getProduct(productId);
        if (productResponse.success && productResponse.data) {
          const product = productResponse.data;
          setFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            categoryId: product.category_id,
            price: product.price.toString(),
            condition: product.condition,
            location: product.location,
            locationId: product.location_id,
            status: product.status
          });
          setExistingImages(product.images || []);
        }

        // Fetch locations
        const locationsResponse = await getLocations();
        if (locationsResponse.success && locationsResponse.data) {
          setLocations(locationsResponse.data);
        }

        // Fetch categories
        const categoriesResponse = await getCategories();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        setLoadingLocations(false);
        setLoadingCategories(false);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          alert('Please log in to edit products');
          navigate('/login');
        } else if (error.response?.status === 403) {
          alert('You do not have permission to edit this product');
          navigate('/profile');
        } else if (error.response?.status === 404) {
          alert('Product not found');
          navigate('/profile');
        } else {
          alert('Failed to load product details');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, navigate]);

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
    const totalImages = existingImages.length - imagesToRemove.length + newImages.length;
    if (totalImages === 0) return 'At least one image is required';
    if (totalImages > 10) return 'Maximum 10 images allowed';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = categories.find(cat => cat.id === selectedId);
    
    setFormData(prev => ({
      ...prev,
      categoryId: selectedId,
      category: selectedCategory ? selectedCategory.name : ''
    }));
    
    setTouched(prev => ({ ...prev, category: true }));
    const error = validateField('category', selectedId);
    setErrors(prev => ({ ...prev, category: error }));
  };

  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    const selectedLocation = locations.find(loc => loc.location_id === selectedId);
    
    setFormData(prev => ({
      ...prev,
      locationId: selectedId,
      location: selectedLocation ? selectedLocation.wilaya : ''
    }));
    
    setTouched(prev => ({ ...prev, location: true }));
    const error = validateField('location', selectedId);
    setErrors(prev => ({ ...prev, location: error }));
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const totalImages = existingImages.length - imagesToRemove.length + newImages.length + fileArray.length;
    
    if (totalImages > 10) {
      setErrors(prev => ({ ...prev, images: 'Maximum 10 images allowed' }));
      return;
    }

    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors(prev => ({ ...prev, images: 'Each image must not exceed 5MB' }));
        return false;
      }
      return true;
    });

    setNewImages(prev => [...prev, ...validFiles]);
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  const removeExistingImage = (imageId) => {
    setImagesToRemove(prev => [...prev, imageId]);
    const imageError = validateImages();
    setErrors(prev => ({ ...prev, images: imageError }));
  };

  const undoRemoveExistingImage = (imageId) => {
    setImagesToRemove(prev => prev.filter(id => id !== imageId));
    const imageError = validateImages();
    setErrors(prev => ({ ...prev, images: imageError }));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    const imageError = validateImages();
    setErrors(prev => ({ ...prev, images: imageError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      category: true,
      price: true,
      location: true,
      condition: true
    });

    // Validate all fields
    const newErrors = {
      title: validateField('title', formData.title),
      description: validateField('description', formData.description),
      category: validateField('category', formData.category),
      price: validateField('price', formData.price),
      location: validateField('location', formData.location),
      images: validateImages()
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      console.log('Validation errors:', newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('category_id', formData.categoryId);
      submitFormData.append('price', formData.price);
      submitFormData.append('location_id', formData.locationId);
      submitFormData.append('status', formData.status);

      // Add images to remove
      if (imagesToRemove.length > 0) {
        imagesToRemove.forEach((imageId, index) => {
          submitFormData.append(`remove_images[${index}]`, imageId);
        });
      }

      // Add new images
      newImages.forEach((image, index) => {
        submitFormData.append('images[]', image);
      });

      const response = await updateProduct(productId, submitFormData);

      if (response.success) {
        alert('Product updated successfully!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      
      if (error.response?.data?.errors) {
        const serverErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          serverErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(serverErrors);
      } else {
        alert(error.response?.data?.message || 'Failed to update product. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <HeaderLoggedIn />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayedExistingImages = existingImages.filter(img => !imagesToRemove.includes(img.id));
  const totalImages = displayedExistingImages.length + newImages.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderLoggedIn />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  touched.title && errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product title"
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  touched.description && errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your product"
              />
              {touched.description && errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  disabled={loadingCategories}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.category && errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {touched.category && errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (DA) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.price && errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {touched.price && errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Location and Condition Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Wilaya) *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.locationId}
                  onChange={handleLocationChange}
                  disabled={loadingLocations}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.location && errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc.location_id} value={loc.location_id}>
                      {loc.wilaya}
                    </option>
                  ))}
                </select>
                {touched.location && errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Condition: {formData.condition}/10
                </label>
                <input
                  type="range"
                  id="condition"
                  name="condition"
                  min="1"
                  max="10"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images * ({totalImages}/10)
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt="Product"
                          className={`w-full h-32 object-cover rounded-lg ${
                            imagesToRemove.includes(image.id) ? 'opacity-50' : ''
                          }`}
                        />
                        {imagesToRemove.includes(image.id) ? (
                          <button
                            type="button"
                            onClick={() => undoRemoveExistingImage(image.id)}
                            className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full hover:bg-green-600"
                          >
                            <span className="text-xs">Undo</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {newImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">New Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              {totalImages < 10 && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : errors.images
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag & drop images here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Maximum 10 images, 5MB each (JPEG, PNG, JPG, GIF, WebP)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload-edit"
                  />
                  <label
                    htmlFor="image-upload-edit"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const inputEl = document.getElementById('image-upload-edit');
                      if (inputEl) inputEl.click();
                    }}
                  >
                    Select Images
                  </label>
                </div>
              )}

              {errors.images && (
                <p className="mt-2 text-sm text-red-600">{errors.images}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-gray-200 to-gray-300 text-black px-8 py-3 rounded-full font-semibold hover:from-gray-300 hover:to-gray-400 transition-all shadow-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating Product...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
