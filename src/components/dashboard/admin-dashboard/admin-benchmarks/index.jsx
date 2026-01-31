import React, { useState, useEffect } from 'react';
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import Footer from "../common/Footer";
import { api } from '@/utils/apiProvider';
import { toast } from 'react-toastify';

/* ============================================================================
   📌 ADMIN BENCHMARKS MANAGEMENT
   ============================================================================
   
   PURPOSE: Assign skills to roles with importance and weight
   
   THIS IS THE HEART OF ADMIN WORK:
   - Select a role
   - See all assigned skills (benchmarks)
   - Add new skills to role
   - Set importance (required/optional)
   - Set weight (numeric)
   - Activate/deactivate benchmarks
   
   CHANGES HERE IMMEDIATELY AFFECT:
   - Readiness calculation
   - Roadmap generation
   - Validation context
   
   ============================================================================ */

const AdminBenchmarksPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [validation, setValidation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBenchmarks, setIsLoadingBenchmarks] = useState(false);
  
  // Add skill modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkillToAdd, setSelectedSkillToAdd] = useState(null);
  const [addFormData, setAddFormData] = useState({
    importance: 'optional',
    weight: 1
  });
  
  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBenchmark, setEditingBenchmark] = useState(null);
  const [editFormData, setEditFormData] = useState({
    importance: 'optional',
    weight: 1
  });
  
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    fetchRoles();
  }, []);
  
  useEffect(() => {
    if (selectedRole) {
      fetchBenchmarks(selectedRole.category_id);
      validateRole(selectedRole.category_id);
    }
  }, [selectedRole]);
  
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${api}/api/admin/roles`);
      const data = await response.json();
      if (data.success) {
        setRoles(data.roles.filter(r => r.is_active));
      }
    } catch (error) {
      toast.error('Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchBenchmarks = async (roleId) => {
    setIsLoadingBenchmarks(true);
    try {
      const response = await fetch(`${api}/api/admin/benchmarks/${roleId}`);
      const data = await response.json();
      if (data.success) {
        setBenchmarks(data.benchmarks);
        setSummary(data.summary);
      }
    } catch (error) {
      toast.error('Failed to load benchmarks');
    } finally {
      setIsLoadingBenchmarks(false);
    }
  };
  
  const validateRole = async (roleId) => {
    try {
      const response = await fetch(`${api}/api/admin/validate/role/${roleId}`);
      const data = await response.json();
      if (data.success) {
        setValidation(data);
      }
    } catch (error) {
      console.error('Validation check failed:', error);
    }
  };
  
  const fetchAvailableSkills = async (search = '') => {
    if (!selectedRole) return;
    
    try {
      const url = `${api}/api/admin/skills/available/${selectedRole.category_id}${search ? `?search=${search}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setAvailableSkills(data.skills);
      }
    } catch (error) {
      console.error('Failed to fetch available skills:', error);
    }
  };
  
  const handleAddSkill = async (e) => {
    e.preventDefault();
    
    if (!selectedSkillToAdd) {
      toast.error('Please select a skill');
      return;
    }
    
    try {
      const response = await fetch(`${api}/api/admin/benchmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: selectedRole.category_id,
          skill_id: selectedSkillToAdd.skill_id,
          importance: addFormData.importance,
          weight: parseFloat(addFormData.weight),
          admin_id: user?.user_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Skill added to role!');
        setShowAddModal(false);
        setSelectedSkillToAdd(null);
        setAddFormData({ importance: 'optional', weight: 1 });
        fetchBenchmarks(selectedRole.category_id);
        validateRole(selectedRole.category_id);
      } else {
        toast.error(data.message || 'Failed to add skill');
      }
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };
  
  const handleEditBenchmark = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${api}/api/admin/benchmarks/${editingBenchmark.benchmark_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          importance: editFormData.importance,
          weight: parseFloat(editFormData.weight),
          admin_id: user?.user_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Benchmark updated!');
        setShowEditModal(false);
        setEditingBenchmark(null);
        fetchBenchmarks(selectedRole.category_id);
        validateRole(selectedRole.category_id);
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('Failed to update benchmark');
    }
  };
  
  const toggleBenchmarkStatus = async (benchmark) => {
    try {
      const response = await fetch(`${api}/api/admin/benchmarks/${benchmark.benchmark_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: !benchmark.is_active,
          admin_id: user?.user_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchBenchmarks(selectedRole.category_id);
        validateRole(selectedRole.category_id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };
  
  const deleteBenchmark = async (benchmark) => {
    if (!confirm(`Remove "${benchmark.skill_name}" from this role?`)) return;
    
    try {
      const response = await fetch(`${api}/api/admin/benchmarks/${benchmark.benchmark_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: user?.user_id,
          hard_delete: true
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Skill removed from role');
        fetchBenchmarks(selectedRole.category_id);
        validateRole(selectedRole.category_id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to remove skill');
    }
  };
  
  const openEditModal = (benchmark) => {
    setEditingBenchmark(benchmark);
    setEditFormData({
      importance: benchmark.importance,
      weight: benchmark.weight
    });
    setShowEditModal(true);
  };
  
  const openAddModal = () => {
    setSkillSearch('');
    setSelectedSkillToAdd(null);
    setAddFormData({ importance: 'optional', weight: 1 });
    fetchAvailableSkills();
    setShowAddModal(true);
  };
  
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
            <div className="row y-gap-20 justify-between items-end pb-30">
              <div className="col-auto">
                <h1 className="text-30 lh-14 fw-600">📌 Benchmarks Management</h1>
                <div className="text-15 text-light-1">
                  Assign skills to roles with importance and weight
                </div>
              </div>
            </div>
            
            {/* Role Selector */}
            <div className="py-20 px-30 rounded-4 bg-white shadow-3 mb-4">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <label className="form-label fw-600">Select Role:</label>
                  <select
                    className="form-select form-select-lg"
                    value={selectedRole?.category_id || ''}
                    onChange={(e) => {
                      const role = roles.find(r => r.category_id === parseInt(e.target.value));
                      setSelectedRole(role);
                    }}
                  >
                    <option value="">Choose a role...</option>
                    {roles.map(role => (
                      <option key={role.category_id} value={role.category_id}>
                        {role.category_name} ({role.skill_count} skills)
                      </option>
                    ))}
                  </select>
                </div>
                
                {summary && (
                  <div className="col-md-8">
                    <div className="d-flex gap-4 justify-content-end flex-wrap">
                      <div className="text-center">
                        <div className="text-24 fw-600 text-primary">{summary.total}</div>
                        <div className="text-12 text-muted">Total Skills</div>
                      </div>
                      <div className="text-center">
                        <div className="text-24 fw-600 text-danger">{summary.required}</div>
                        <div className="text-12 text-muted">Required</div>
                      </div>
                      <div className="text-center">
                        <div className="text-24 fw-600 text-secondary">{summary.optional}</div>
                        <div className="text-12 text-muted">Optional</div>
                      </div>
                      <div className="text-center">
                        <div className="text-24 fw-600 text-success">{summary.total_weight}</div>
                        <div className="text-12 text-muted">Total Weight</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Validation Warnings */}
            {validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
              <div className="mb-4">
                {validation.errors.map((err, i) => (
                  <div key={i} className="alert alert-danger d-flex align-items-center">
                    <span className="me-2">❌</span>
                    <div>
                      <strong>{err.code}</strong>: {err.message}
                    </div>
                  </div>
                ))}
                {validation.warnings.map((warn, i) => (
                  <div key={i} className="alert alert-warning d-flex align-items-center">
                    <span className="me-2">⚠️</span>
                    <div>
                      <strong>{warn.code}</strong>: {warn.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Benchmarks Table */}
            {selectedRole ? (
              <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">
                    Skills for <strong>{selectedRole.category_name}</strong>
                  </h5>
                  <button 
                    className="btn btn-primary"
                    onClick={openAddModal}
                  >
                    + Add Skill to Role
                  </button>
                </div>
                
                {isLoadingBenchmarks ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Skill Name</th>
                          <th>Domain</th>
                          <th className="text-center">Importance</th>
                          <th className="text-center">Weight</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {benchmarks.map(b => (
                          <tr key={b.benchmark_id} className={!b.is_active ? 'table-secondary' : ''}>
                            <td>
                              <strong>{b.skill_name}</strong>
                              {!b.skill_is_active && (
                                <span className="badge bg-warning ms-2">Skill Inactive</span>
                              )}
                            </td>
                            <td>
                              {b.skill_domain ? (
                                <span className="badge bg-secondary">{b.skill_domain}</span>
                              ) : '—'}
                            </td>
                            <td className="text-center">
                              <span className={`badge ${b.importance === 'required' ? 'bg-danger' : 'bg-secondary'}`}>
                                {b.importance}
                              </span>
                            </td>
                            <td className="text-center">
                              <strong>{b.weight}</strong>
                            </td>
                            <td className="text-center">
                              <span className={`badge ${b.is_active ? 'bg-success' : 'bg-danger'}`}>
                                {b.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => openEditModal(b)}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className={`btn btn-sm ${b.is_active ? 'btn-outline-warning' : 'btn-outline-success'} me-1`}
                                onClick={() => toggleBenchmarkStatus(b)}
                                title={b.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {b.is_active ? '🚫' : '✅'}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteBenchmark(b)}
                                title="Remove"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {benchmarks.length === 0 && (
                      <div className="text-center py-4 text-muted">
                        No skills assigned to this role yet. Click "Add Skill to Role" to get started.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-30 px-30 rounded-4 bg-white shadow-3 text-center">
                <div className="py-5">
                  <div className="text-40 mb-3">📋</div>
                  <h4>Select a Role</h4>
                  <p className="text-muted">Choose a role from the dropdown above to manage its skill benchmarks</p>
                </div>
              </div>
            )}
            
            <Footer />
          </div>
        </div>
      </div>
      
      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Skill to {selectedRole?.category_name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSkill}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Search & Select Skill *</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Type to search skills..."
                      value={skillSearch}
                      onChange={(e) => {
                        setSkillSearch(e.target.value);
                        fetchAvailableSkills(e.target.value);
                      }}
                    />
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
                      {availableSkills.length > 0 ? (
                        availableSkills.map(skill => (
                          <div
                            key={skill.skill_id}
                            className={`p-2 cursor-pointer ${selectedSkillToAdd?.skill_id === skill.skill_id ? 'bg-primary text-white' : 'hover-bg-light'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedSkillToAdd(skill)}
                          >
                            <strong>{skill.name}</strong>
                            {skill.domain && (
                              <span className="ms-2 badge bg-secondary">{skill.domain}</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-muted">
                          {skillSearch ? 'No matching skills found' : 'All skills already assigned'}
                        </div>
                      )}
                    </div>
                    {selectedSkillToAdd && (
                      <div className="mt-2 alert alert-info py-2">
                        Selected: <strong>{selectedSkillToAdd.name}</strong>
                      </div>
                    )}
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Importance *</label>
                      <select
                        className="form-select"
                        value={addFormData.importance}
                        onChange={(e) => setAddFormData({...addFormData, importance: e.target.value})}
                      >
                        <option value="required">Required</option>
                        <option value="optional">Optional</option>
                      </select>
                      <small className="text-muted">
                        Required skills affect "Not Ready" status
                      </small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Weight *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={addFormData.weight}
                        onChange={(e) => setAddFormData({...addFormData, weight: e.target.value})}
                        min="0"
                        step="0.5"
                        required
                      />
                      <small className="text-muted">
                        Higher weight = more impact on score
                      </small>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={!selectedSkillToAdd}>
                    Add to Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Benchmark Modal */}
      {showEditModal && editingBenchmark && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit: {editingBenchmark.skill_name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditBenchmark}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Importance</label>
                    <select
                      className="form-select"
                      value={editFormData.importance}
                      onChange={(e) => setEditFormData({...editFormData, importance: e.target.value})}
                    >
                      <option value="required">Required</option>
                      <option value="optional">Optional</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Weight</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editFormData.weight}
                      onChange={(e) => setEditFormData({...editFormData, weight: e.target.value})}
                      min="0"
                      step="0.5"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
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

export default AdminBenchmarksPage;
