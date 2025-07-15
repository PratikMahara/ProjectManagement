import React, { useState } from 'react';
import { Plus, FolderOpen, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

const ProjectSelector: React.FC = () => {
  const {
    projects,
    currentProject,
    selectProject,
    createProject
  } = useProject();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    startDate: '',
    expectedEndDate: '',
    estimatedCost: ''
  });
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject({
        projectName: formData.projectName,
        location: formData.location,
        startDate: formData.startDate,
        expectedEndDate: formData.expectedEndDate,
        estimatedCost: Number(formData.estimatedCost)
      });

      setShowCreateForm(false);
      setFormData({
        projectName: '',
        location: '',
        startDate: '',
        expectedEndDate: '',
        estimatedCost: ''
      });
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to create project');
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              {['projectName', 'location', 'startDate', 'expectedEndDate', 'estimatedCost'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === 'projectName'
                      ? 'Project Name'
                      : field === 'expectedEndDate'
                      ? 'Expected End Date'
                      : field
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <input
                    type={field.includes('Date') ? 'date' : field === 'estimatedCost' ? 'number' : 'text'}
                    name={field}
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentProject && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Current Project</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700">
                Name: <span className="font-medium">{currentProject.projectName}</span>
              </p>
              <p className="text-sm text-blue-700 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {currentProject.location}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-700 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(currentProject.startDate).toLocaleDateString()} -{' '}
                {new Date(currentProject.expectedEndDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-blue-700 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatCurrency(currentProject.estimatedCost)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              currentProject?.id === project.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => selectProject(project.id)} // ✅ use context
          >
            <h4 className="font-semibold text-gray-900 mb-2">{project.projectName}</h4>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {project.location}
            </p>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(project.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {formatCurrency(project.estimatedCost)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSelector;
