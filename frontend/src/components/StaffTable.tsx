import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Plus, Edit2, Trash2, AlertCircle, Users } from 'lucide-react';
import { Staff } from '../types';

const StaffTable: React.FC = () => {
  const { currentProject, staff, addStaff, updateStaff, deleteStaff } = useProject();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    serialNumber: '',
    role: '',
    name: '',
    salary: '',
    workProgress: '',
    startDate: '',
    status: 'active' as 'active' | 'inactive'
  });

  if (!currentProject) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Project Selected</h2>
        <p className="text-gray-600">Please select a project to manage staff.</p>
      </div>
    );
  }

  const projectStaff = staff.filter(s => s.projectId === currentProject.id);

  const resetForm = () => {
    setFormData({
      serialNumber: '',
      role: '',
      name: '',
      salary: '',
      workProgress: '',
      startDate: '',
      status: 'active'
    });
    setEditingStaff(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
    } else {
      addStaff({
        ...formData,
       salary: Number(formData.salary) || 0,
       workProgress: Number(formData.workProgress) || 0,
        projectId: currentProject.id
      });
    }
    
    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      serialNumber: staffMember.serialNumber,
      role: staffMember.role,
      name: staffMember.name,
      salary: staffMember.salary.toString(),
      workProgress: staffMember.workProgress.toString(),
      startDate: staffMember.startDate,
      status: staffMember.status
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      deleteStaff(id);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressTextColor = (progress: number) => {
    if (progress < 30) return 'text-red-700';
    if (progress < 70) return 'text-yellow-700';
    return 'text-green-700';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Site Engineer">Site Engineer</option>
                  <option value="Foreman">Foreman</option>
                  <option value="Mason">Mason</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Laborer">Laborer</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  step="1"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Progress (%)
                </label>
                <input
                  type="number"
                  value={formData.workProgress}
                  onChange={(e) => setFormData({ ...formData, workProgress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="100"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">SN</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Salary</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Work Progress</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectStaff.map((staffMember, index) => (
              <tr key={staffMember.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {staffMember.role}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{staffMember.name}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{formatCurrency(staffMember.salary)}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(staffMember.workProgress)}`}
                        style={{ width: `${staffMember.workProgress}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${getProgressTextColor(staffMember.workProgress)}`}>
                      {staffMember.workProgress}%
                    </span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  {new Date(staffMember.startDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    staffMember.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {staffMember.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(staffMember)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(staffMember.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projectStaff.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No staff members found for this project. Add some staff to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffTable;