import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentProject, materials, staff } = useProject();

  if (!currentProject) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Project Selected</h2>
        <p className="text-gray-600">Please select or create a project to view the dashboard.</p>
      </div>
    );
  }

  const projectMaterials = materials.filter(m => m.projectId === currentProject.id);
  const projectStaff = staff.filter(s => s.projectId === currentProject.id);

  // Calculate metrics
  const totalMaterialCost = projectMaterials.reduce((sum, m) => sum + m.totalCost, 0);
  const totalStaffCost = projectStaff.reduce((sum, s) => sum + s.salary, 0);
  const totalSpent = totalMaterialCost + totalStaffCost;
  const averageProgress = projectStaff.length > 0 
    ? projectStaff.reduce((sum, s) => sum + s.workProgress, 0) / projectStaff.length 
    : 0;

  const criticalMaterials = projectMaterials.filter(m => m.stockStatus === 'critical');
  const warningMaterials = projectMaterials.filter(m => m.stockStatus === 'warning');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCostTrackingColor = (spent: number, estimated: number) => {
    const percentage = (spent / estimated) * 100;
    if (percentage > 90) return 'text-red-600';
    if (percentage > 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Dashboard</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(currentProject.estimatedCost)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Spent</p>
                <p className={`text-2xl font-bold ${getCostTrackingColor(totalSpent, currentProject.estimatedCost)}`}>
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Staff Members</p>
                <p className="text-2xl font-bold text-purple-900">{projectStaff.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Materials</p>
                <p className="text-2xl font-bold text-orange-900">{projectMaterials.length}</p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Progress and Cost Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Project Progress</span>
                  <span className="text-sm font-medium text-gray-700">{averageProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(averageProgress)}`}
                    style={{ width: `${averageProgress}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                  <span className="text-sm font-medium text-gray-700">
                    {((totalSpent / currentProject.estimatedCost) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      (totalSpent / currentProject.estimatedCost) * 100 > 90 ? 'bg-red-500' :
                      (totalSpent / currentProject.estimatedCost) * 100 > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((totalSpent / currentProject.estimatedCost) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Materials</span>
                <span className="font-medium text-gray-900">{formatCurrency(totalMaterialCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Staff Salaries</span>
                <span className="font-medium text-gray-900">{formatCurrency(totalStaffCost)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Total Spent</span>
                  <span className="font-bold text-gray-900">{formatCurrency(totalSpent)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining Budget</span>
                <span className={`font-medium ${
                  currentProject.estimatedCost - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(currentProject.estimatedCost - totalSpent)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Critical Alerts</h3>
            </div>
            <div className="space-y-2">
              {criticalMaterials.length > 0 ? (
                criticalMaterials.map(material => (
                  <div key={material.id} className="bg-white rounded p-3 border border-red-200">
                    <p className="text-sm font-medium text-red-900">{material.materialName}</p>
                    <p className="text-xs text-red-700">
                      Only {material.availableStock} units left ({material.siteName})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-red-700">No critical alerts</p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-900">Warnings</h3>
            </div>
            <div className="space-y-2">
              {warningMaterials.length > 0 ? (
                warningMaterials.map(material => (
                  <div key={material.id} className="bg-white rounded p-3 border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-900">{material.materialName}</p>
                    <p className="text-xs text-yellow-700">
                      {material.availableStock} units remaining ({material.siteName})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-yellow-700">No warnings</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;