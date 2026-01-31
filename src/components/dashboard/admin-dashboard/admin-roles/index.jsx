import React, { useState, useEffect } from 'react';
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import Footer from "../common/Footer";
import { api } from '@/utils/apiProvider';
import { toast } from 'react-toastify';

/* ============================================================================
   📌 ADMIN ROLES MANAGEMENT
   ============================================================================
   
   PURPOSE: Manage roles (categories) that define what readiness is measured against
   
   FEATURES:
   - View all roles with statistics
   - Create new roles
   - Edit role name/description
   - Activate/deactivate roles
   - See user count per role
   
   ============================================================================ */

const AdminRolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
    category_color_class: 'bg-blue-1'
  });
  
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    fetchRoles();
  }, []);
  
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${api}/api/admin/roles`);
      const data = await response.json();
      if (data.success) {
        setRoles(data.roles);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingRole 
        ? `${api}/api/admin/roles/${editingRole.category_id}`
        : `${api}/api/admin/roles`;
      
      const response = await fetch(url, {
        method: editingRole ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          admin_id: user?.user_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(editingRole ? 'Role updated!' : 'Role created!');
        setShowModal(false);
        setEditingRole(null);
        setFormData({ category_name: '', description: '', category_color_class: 'bg-blue-1' });
        fetchRoles();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Failed to save role');
    }
  };
  
  const toggleStatus = async (role) => {
    try {
      const response = await fetch(`${api}/api/admin/roles/${role.category_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: !role.is_active,
          admin_id: user?.user_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchRoles();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update role status');
    }
  };
  
  const openEditModal = (role) => {
    setEditingRole(role);
    setFormData({
      category_name: role.category_name,
      description: role.description || '',
      category_color_class: role.category_color_class || 'bg-blue-1'
    });
    setShowModal(true);
  };
  
  const openCreateModal = () => {
    setEditingRole(null);
    setFormData({ category_name: '', description: '', category_color_class: 'bg-blue-1' });
    setShowModal(true);
  };
  
  const filteredRoles = roles.filter(role => 
    role.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="header-margin"></div>
      <Header />
      
      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>
        
        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-auto">
                <h1 className="text-30 lh-14 fw-600">📌 Roles Management</h1>
                <div className="text-15 text-light-1">
                  Define roles that users can target for readiness evaluation
                </div>
              </div>
              
              <div className="col-auto d-flex gap-2">
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{ width: '200px' }}
                />
                <button 
                  className="btn btn-primary"
                  onClick={openCreateModal}
                >
                  + Add Role
                </button>
              </div>
            </div>
            
            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th className="text-center">Skills</th>
                        <th className="text-center">Users</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Last Updated</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoles.map(role => (
                        <tr key={role.category_id}>
                          <td>
                            <strong>{role.category_name}</strong>
                          </td>
                          <td>
                            <span className="text-muted">
                              {role.description || '—'}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-primary me-1">
                              {role.required_count} req
                            </span>
                            <span className="badge bg-secondary">
                              {role.optional_count} opt
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-info">
                              {role.user_count} users
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={`badge ${role.is_active ? 'bg-success' : 'bg-danger'}`}>
                              {role.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="text-center">
                            <small className="text-muted">
                              {role.updated_at 
                                ? new Date(role.updated_at).toLocaleDateString()
                                : '—'}
                            </small>
                            {role.updated_by_name && (
                              <div><small className="text-muted">by {role.updated_by_name}</small></div>
                            )}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => openEditModal(role)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className={`btn btn-sm ${role.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => toggleStatus(role)}
                              title={role.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {role.is_active ? '🚫' : '✅'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredRoles.length === 0 && (
                    <div className="text-center py-4 text-muted">
                      No roles found
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Footer />
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.category_name}
                      onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                      required
                      placeholder="e.g., Frontend Developer Intern"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      placeholder="Brief description of this role..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingRole ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminRolesPage;
