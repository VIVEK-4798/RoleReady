import React, { useState, useEffect } from 'react';
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import Footer from "../common/Footer";
import { api } from '@/utils/apiProvider';
import { toast } from 'react-toastify';

/* ============================================================================
   📌 ADMIN SKILLS MANAGEMENT
   ============================================================================
   
   PURPOSE: Manage the master skills list
   
   FEATURES:
   - View all skills with usage statistics
   - Create new skills
   - Edit skill name/domain
   - Activate/deactivate skills
   - Filter by domain, active status
   - Search skills
   
   ============================================================================ */

const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: ''
  });
  
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    fetchSkills();
  }, [domainFilter, statusFilter]);
  
  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      let url = `${api}/api/admin/skills?`;
      if (domainFilter) url += `domain=${domainFilter}&`;
      if (statusFilter) url += `is_active=${statusFilter}&`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setSkills(data.skills);
        setDomains(data.domains || []);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingSkill 
        ? `${api}/api/admin/skills/${editingSkill.skill_id}`
        : `${api}/api/admin/skills`;
      
      const response = await fetch(url, {
        method: editingSkill ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          admin_id: user?.user_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(editingSkill ? 'Skill updated!' : 'Skill created!');
        setShowModal(false);
        setEditingSkill(null);
        setFormData({ name: '', domain: '' });
        fetchSkills();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Failed to save skill');
    }
  };
  
  const toggleStatus = async (skill) => {
    try {
      const response = await fetch(`${api}/api/admin/skills/${skill.skill_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: !skill.is_active,
          admin_id: user?.user_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchSkills();
      } else {
        // Show warning with details if skill is in use
        if (data.error === 'SKILL_IN_USE') {
          toast.warning(
            <div>
              <strong>{data.message}</strong>
              <ul className="mb-0 mt-2">
                {data.roles?.slice(0, 3).map((r, i) => (
                  <li key={i}>{r.role} ({r.importance})</li>
                ))}
              </ul>
            </div>,
            { autoClose: 8000 }
          );
        } else {
          toast.error(data.message || 'Failed to update status');
        }
      }
    } catch (error) {
      toast.error('Failed to update skill status');
    }
  };
  
  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      domain: skill.domain || ''
    });
    setShowModal(true);
  };
  
  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({ name: '', domain: '' });
    setShowModal(true);
  };
  
  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.normalized_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const domainOptions = [
    'frontend',
    'backend', 
    'database',
    'devops',
    'tools',
    'soft-skills',
    'design',
    'mobile',
    'testing',
    'security',
    'data-science',
    'other'
  ];
  
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
                <h1 className="text-30 lh-14 fw-600">📌 Skills Management</h1>
                <div className="text-15 text-light-1">
                  Master list of all skills available for benchmarks
                </div>
              </div>
              
              <div className="col-auto d-flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{ width: '180px' }}
                />
                <select
                  className="form-select"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="">All Domains</option>
                  {domains.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '120px' }}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <button 
                  className="btn btn-primary"
                  onClick={openCreateModal}
                >
                  + Add Skill
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
                <>
                  <div className="mb-3 text-muted">
                    Showing {filteredSkills.length} of {skills.length} skills
                  </div>
                  
                  <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <table className="table table-hover table-sm">
                      <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff' }}>
                        <tr>
                          <th>Skill Name</th>
                          <th>Domain</th>
                          <th className="text-center">Used In Roles</th>
                          <th className="text-center">Users Have</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSkills.map(skill => (
                          <tr key={skill.skill_id}>
                            <td>
                              <strong>{skill.name}</strong>
                            </td>
                            <td>
                              {skill.domain ? (
                                <span className="badge bg-secondary">{skill.domain}</span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td className="text-center">
                              <span className="badge bg-info">
                                {skill.role_count} roles
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-primary">
                                {skill.user_count} users
                              </span>
                            </td>
                            <td className="text-center">
                              <span className={`badge ${skill.is_active ? 'bg-success' : 'bg-danger'}`}>
                                {skill.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => openEditModal(skill)}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className={`btn btn-sm ${skill.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                onClick={() => toggleStatus(skill)}
                                title={skill.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {skill.is_active ? '🚫' : '✅'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredSkills.length === 0 && (
                    <div className="text-center py-4 text-muted">
                      No skills found
                    </div>
                  )}
                </>
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
                  {editingSkill ? 'Edit Skill' : 'Create New Skill'}
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
                    <label className="form-label">Skill Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="e.g., React.js"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Domain</label>
                    <select
                      className="form-select"
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    >
                      <option value="">Select domain...</option>
                      {domainOptions.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
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
                    {editingSkill ? 'Update' : 'Create'}
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

export default AdminSkillsPage;
