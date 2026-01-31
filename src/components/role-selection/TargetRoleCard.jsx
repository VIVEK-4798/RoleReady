import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '@/utils/apiProvider';

/* ============================================================================
   🎯 TARGET ROLE CARD
   ============================================================================
   
   PURPOSE: Show user's current target role and allow changes
   
   DISPLAYS:
   - Current target role name & description
   - Skills required for this role
   - Last readiness check date
   - "Change Role" button
   
   ON CHANGE:
   - Shows impact warning modal
   - Confirms before switching
   - Clears roadmap (new one generated on demand)
   - Does NOT auto-calculate readiness
   
   ============================================================================ */

const TargetRoleCard = ({ onRoleChange }) => {
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [impactPreview, setImpactPreview] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user?.user_id;
  
  useEffect(() => {
    if (user_id) {
      fetchTargetRole();
    }
  }, [user_id]);
  
  const fetchTargetRole = async () => {
    try {
      const response = await fetch(`${api}/api/role-selection/target-role/${user_id}`);
      const data = await response.json();
      if (data.success) {
        setTargetRole(data.target_role);
      }
    } catch (error) {
      console.error('Error fetching target role:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAvailableRoles = async () => {
    try {
      const response = await fetch(`${api}/api/role-selection/available-roles`);
      const data = await response.json();
      if (data.success) {
        setAvailableRoles(data.roles);
      }
    } catch (error) {
      console.error('Error fetching available roles:', error);
    }
  };
  
  const fetchImpactPreview = async (roleId) => {
    try {
      const response = await fetch(`${api}/api/role-selection/impact-preview/${user_id}/${roleId}`);
      const data = await response.json();
      if (data.success) {
        setImpactPreview(data);
      }
    } catch (error) {
      console.error('Error fetching impact preview:', error);
    }
  };
  
  const handleOpenChangeModal = () => {
    fetchAvailableRoles();
    setShowChangeModal(true);
  };
  
  const handleSelectRole = async (role) => {
    if (role.category_id === targetRole?.category_id) {
      toast.info('This is already your target role');
      return;
    }
    
    setSelectedRole(role);
    await fetchImpactPreview(role.category_id);
    setShowChangeModal(false);
    setShowConfirmModal(true);
  };
  
  const handleConfirmChange = async () => {
    if (!selectedRole) return;
    
    setIsChanging(true);
    try {
      const response = await fetch(`${api}/api/role-selection/change-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          new_role_id: selectedRole.category_id,
          changed_by: 'self'
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.changed) {
        toast.success(`🎯 Target role changed to "${selectedRole.name}"!`);
        setTargetRole({
          category_id: selectedRole.category_id,
          name: selectedRole.name,
          description: selectedRole.description,
          required_skills_count: selectedRole.skill_count,
          set_at: new Date().toISOString(),
          set_by: 'self',
          last_readiness_check: null
        });
        setShowConfirmModal(false);
        
        // Notify parent component
        if (onRoleChange) {
          onRoleChange(selectedRole);
        }
        
        // Prompt to calculate readiness
        toast.info(
          <div>
            <span>📊 Calculate readiness for your new role?</span>
            <button
              className="btn btn-sm btn-primary ms-2"
              onClick={() => navigate('/readiness')}
            >
              Go to Readiness
            </button>
          </div>,
          { autoClose: 8000 }
        );
      } else {
        toast.error(data.message || 'Failed to change role');
      }
    } catch (error) {
      toast.error('Failed to change role');
    } finally {
      setIsChanging(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-30 px-30 rounded-4 bg-white shadow-3">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="py-30 px-30 rounded-4 bg-white shadow-3">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="mb-0">🎯 Target Role</h5>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={handleOpenChangeModal}
          >
            {targetRole ? 'Change Role' : 'Select Role'}
          </button>
        </div>
        
        {targetRole ? (
          <div>
            <div className="d-flex align-items-center mb-2">
              <h4 className="mb-0 text-primary">{targetRole.name}</h4>
              {!targetRole.is_active && (
                <span className="badge bg-warning ms-2">Role Inactive</span>
              )}
            </div>
            
            {targetRole.description && (
              <p className="text-muted mb-3">{targetRole.description}</p>
            )}
            
            <div className="row g-3">
              <div className="col-auto">
                <div className="d-flex align-items-center text-muted">
                  <span className="me-2">📚</span>
                  <span>{targetRole.required_skills_count || 0} skills required</span>
                </div>
              </div>
              
              {targetRole.last_readiness_check && (
                <div className="col-auto">
                  <div className="d-flex align-items-center text-muted">
                    <span className="me-2">🕐</span>
                    <span>Last check: {new Date(targetRole.last_readiness_check).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              {targetRole.set_at && (
                <div className="col-auto">
                  <div className="d-flex align-items-center text-muted">
                    <span className="me-2">📅</span>
                    <span>Selected: {new Date(targetRole.set_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-40 mb-3">🎯</div>
            <h5>No Target Role Selected</h5>
            <p className="text-muted mb-3">
              Select a target role to start tracking your readiness
            </p>
            <button 
              className="btn btn-primary"
              onClick={handleOpenChangeModal}
            >
              Select Target Role
            </button>
          </div>
        )}
      </div>
      
      {/* Role Selection Modal */}
      {showChangeModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Target Role</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowChangeModal(false)}
                />
              </div>
              <div className="modal-body">
                <p className="text-muted mb-4">
                  Choose the role you want to prepare for. Your readiness will be evaluated against this role's requirements.
                </p>
                
                <div className="row g-3">
                  {availableRoles.map(role => (
                    <div key={role.category_id} className="col-md-6">
                      <div 
                        className={`p-3 border rounded cursor-pointer ${
                          targetRole?.category_id === role.category_id 
                            ? 'border-primary bg-light' 
                            : 'hover-border-primary'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => handleSelectRole(role)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="mb-1">{role.name}</h6>
                          {targetRole?.category_id === role.category_id && (
                            <span className="badge bg-primary">Current</span>
                          )}
                        </div>
                        {role.description && (
                          <p className="text-muted small mb-2">{role.description}</p>
                        )}
                        <div className="d-flex gap-3 text-muted small">
                          <span>📚 {role.skill_count} skills</span>
                          <span>⭐ {role.required_count} required</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {availableRoles.length === 0 && (
                  <div className="text-center py-4 text-muted">
                    No roles available. Please contact an administrator.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowChangeModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal with Impact Warning */}
      {showConfirmModal && selectedRole && impactPreview && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning-subtle">
                <h5 className="modal-title">⚠️ Confirm Role Change</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowConfirmModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="alert alert-warning mb-4">
                  <strong>Changing your target role will:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Reset your readiness context</li>
                    <li>Generate a new roadmap for the selected role</li>
                    <li>Your past readiness history will remain available</li>
                  </ul>
                </div>
                
                <div className="row g-3 mb-4">
                  {impactPreview.current_role && (
                    <div className="col-6">
                      <div className="p-3 bg-light rounded">
                        <div className="text-muted small mb-1">Current Role</div>
                        <div className="fw-bold">{impactPreview.current_role.name}</div>
                        {impactPreview.current_role.readiness_score !== null && (
                          <div className="text-success small">
                            Score: {Math.round(impactPreview.current_role.readiness_score)}%
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className={impactPreview.current_role ? 'col-6' : 'col-12'}>
                    <div className="p-3 bg-primary-subtle rounded">
                      <div className="text-muted small mb-1">New Role</div>
                      <div className="fw-bold text-primary">{impactPreview.new_role.name}</div>
                      <div className="small">
                        {impactPreview.new_role.total_skills} skills • 
                        {impactPreview.new_role.required_skills} required
                      </div>
                      <div className="text-muted small">
                        You have {impactPreview.new_role.user_matching_skills} matching skills 
                        (~{impactPreview.new_role.estimated_match_percent}%)
                      </div>
                    </div>
                  </div>
                </div>
                
                {impactPreview.previous_attempt && (
                  <div className="alert alert-info">
                    <small>
                      📊 You previously calculated readiness for this role on{' '}
                      {new Date(impactPreview.previous_attempt.calculated_at).toLocaleDateString()}{' '}
                      with a score of {Math.round(impactPreview.previous_attempt.readiness_score)}%
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isChanging}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleConfirmChange}
                  disabled={isChanging}
                >
                  {isChanging ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Switching...
                    </>
                  ) : (
                    'Confirm & Switch'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TargetRoleCard;
