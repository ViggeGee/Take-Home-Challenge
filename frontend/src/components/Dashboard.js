import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ user, onLogout }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [newBrand, setNewBrand] = useState({ name: '', prompt: '' });
  const navigate = useNavigate();

  // Load brands when component mounts
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await axios.get('/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.name.trim()) return;

    try {
      const response = await axios.post('/brands', newBrand);
      setBrands([response.data, ...brands]);
      setNewBrand({ name: '', prompt: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('Failed to add brand');
    }
  };

  const handleEditBrand = async (e) => {
    e.preventDefault();
    if (!editingBrand.name.trim()) return;

    try {
      const response = await axios.put(`/brands/${editingBrand.id}`, {
        name: editingBrand.name,
        prompt: editingBrand.prompt
      });
      setBrands(brands.map(brand => 
        brand.id === editingBrand.id ? response.data : brand
      ));
      setEditingBrand(null);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating brand:', error);
      alert('Failed to update brand');
    }
  };

  const startEdit = (brand) => {
    setEditingBrand({ ...brand });
    setShowEditForm(true);
  };

  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;

    try {
      await axios.delete(`/brands/${brandId}`);
      setBrands(brands.filter(brand => brand.id !== brandId));
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Failed to delete brand');
    }
  };

  if (loading) {
    return <div className="loading">Loading brands...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Model Monitor</h1>
          <div className="user-info">
            <span>Welcome, {user.email}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="section-header">
            <h2>Your Brands</h2>
            <button 
              onClick={() => setShowAddForm(true)} 
              className="add-btn"
            >
              + Add Brand
            </button>
          </div>

          {/* Add brand form */}
          {showAddForm && (
            <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Add New Brand</h3>
                <form onSubmit={handleAddBrand}>
                  <div className="form-group">
                    <label>Brand Name:</label>
                    <input
                      type="text"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                      placeholder="e.g., Nike, Apple, McDonald's"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Prompt (optional):</label>
                    <textarea
                      value={newBrand.prompt}
                      onChange={(e) => setNewBrand({...newBrand, prompt: e.target.value})}
                      placeholder="What should AI know about this brand?"
                      rows="3"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </button>
                    <button type="submit">Add Brand</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit brand form */}
          {showEditForm && editingBrand && (
            <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Brand</h3>
                <form onSubmit={handleEditBrand}>
                  <div className="form-group">
                    <label>Brand Name:</label>
                    <input
                      type="text"
                      value={editingBrand.name}
                      onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})}
                      placeholder="e.g., Nike, Apple, McDonald's"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Prompt (optional):</label>
                    <textarea
                      value={editingBrand.prompt || ''}
                      onChange={(e) => setEditingBrand({...editingBrand, prompt: e.target.value})}
                      placeholder="What should AI know about this brand?"
                      rows="3"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowEditForm(false)}>
                      Cancel
                    </button>
                    <button type="submit">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Brands list */}
          <div className="brands-grid">
            {brands.length === 0 ? (
              <div className="empty-state">
                <p>No brands yet. Add your first brand to get started!</p>
              </div>
            ) : (
              brands.map(brand => (
                <div key={brand.id} className="brand-card">
                  <div className="brand-header">
                    <h3>{brand.name}</h3>
                    <div className="brand-actions-header">
                      <button 
                        onClick={() => startEdit(brand)}
                        className="edit-btn"
                        title="Edit brand"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="delete-btn"
                        title="Delete brand"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  {brand.prompt && (
                    <p className="brand-prompt">{brand.prompt}</p>
                  )}
                  
                  <div className="brand-actions">
                    <button 
                      onClick={() => navigate(`/brand/${brand.id}`)}
                      className="view-btn"
                    >
                      View Responses
                    </button>
                  </div>
                  
                  <div className="brand-meta">
                    <small>Created: {new Date(brand.created_at).toLocaleDateString()}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;