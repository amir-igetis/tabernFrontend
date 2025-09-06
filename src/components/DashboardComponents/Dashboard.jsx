// components/DashboardComponents/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Plus, ShoppingCart, Users } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Categories', value: '24', icon: Grid, color: 'bg-blue-500' },
    { label: 'Total Products', value: '156', icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Total Customers', value: '892', icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/categories"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <div className="p-2 bg-indigo-100 rounded-lg mr-4">
              <Grid size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Manage Categories</h3>
              <p className="text-sm text-gray-600">Add or edit categories</p>
            </div>
          </Link>

          <Link
            to="/categories"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <Plus size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Add Category</h3>
              <p className="text-sm text-gray-600">Create new category</p>
            </div>
          </Link>

          <Link
            to="/products"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <ShoppingCart size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Manage Products</h3>
              <p className="text-sm text-gray-600">Add or edit products</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;