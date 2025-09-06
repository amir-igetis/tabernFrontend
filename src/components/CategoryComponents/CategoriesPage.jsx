import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryForm from './CategoryForm';
import { Plus } from 'lucide-react';

const CategoriesPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/categories');
      const data = response.data;
      setCategories(data);
      
      // Filter parent categories (categories without parent)
      const parentCats = data.filter(cat => !cat.parentCategory);
      setParentCategories(parentCats);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await axios.post('/api/categories', categoryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const newCategory = response.data;
      setCategories(prev => [...prev, newCategory]);
      
      // Refresh parent categories list
      fetchCategories();
      
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.message || error.response.data || 'Failed to create category');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message || 'Failed to create category');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Category
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchCategories}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No categories found. Create your first category!</p>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Your Categories</h2>
              {/* Categories list would be rendered here */}
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="p-3 border rounded-md">
                    <h3 className="font-medium">{category.name}</h3>
                    {category.parentCategory && (
                      <p className="text-sm text-gray-600">
                        Parent: {category.parentCategory.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Form Modal */}
        {isFormOpen && (
          <CategoryForm
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleCreateCategory}
            parentCategories={parentCategories}
          />
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;