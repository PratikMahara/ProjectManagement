import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Material } from '../types';

const MaterialsTable: React.FC = () => {
  
  const { currentProject, materials, addMaterial, updateMaterial, deleteMaterial } = useProject();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    serialNumber: '',
    materialName: '',
    siteName: '',
    actualStock: '',
    usedStock: '',
    costPerUnit: '',
    buyDate: ''
  });

  if (!currentProject) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Project Selected</h2>
        <p className="text-gray-600">Please select a project to manage materials.</p>
      </div>
    );
  }
console.log("Current Project ID:", currentProject.id);
console.log("All Materials:", materials.map(m => m.projectId));

const projectMaterials = materials.filter(m => m.projectId === currentProject.id);

console.log("All Materials:", materials.map(m => m.projectId));

  const resetForm = () => {
    setFormData({
      serialNumber: '',
      materialName: '',
      siteName: '',
      actualStock: '',
      usedStock: '',
      costPerUnit: '',
      buyDate: ''
    });
    setEditingMaterial(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actualStock = Number(formData.actualStock) || 0;
    const usedStock = Number(formData.usedStock) || 0;
    const costPerUnit = Number(formData.costPerUnit) || 0;
console.log(typeof actualStock, typeof usedStock, typeof costPerUnit)
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, {
        ...formData,
        actualStock,
        usedStock,
        costPerUnit,
      });
    } else {
      addMaterial({
        ...formData,
        actualStock,
        usedStock,
        costPerUnit,
        projectId: currentProject.id,
      });
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      serialNumber: material.serialNumber,
      materialName: material.materialName,
      siteName: material.siteName,
      actualStock: material.actualStock.toString(),
      usedStock: material.usedStock.toString(),
      costPerUnit: material.costPerUnit.toString(),
      buyDate: material.buyDate
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-50 text-green-800 border-green-200';
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Materials Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingMaterial ? 'Edit Material' : 'Add New Material'}
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
                  Material Name
                </label>
                <input
                  type="text"
                  value={formData.materialName}
                  onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Stock
                </label>
                <input
                  type="number"
                  value={formData.actualStock}
                  onChange={(e) => setFormData({ ...formData, actualStock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Used Stock
                </label>
                <input
                  type="number"
                  value={formData.usedStock}
                  onChange={(e) => setFormData({ ...formData, usedStock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max={Number(formData.actualStock) || 0}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost per Unit
                </label>
                <input
                  type="number"
                  value={formData.costPerUnit}
                  onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  step="1"
                  placeholder="0"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buy Date
                </label>
                <input
                  type="date"
                  value={formData.buyDate}
                  onChange={(e) => setFormData({ ...formData, buyDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingMaterial ? 'Update Material' : 'Add Material'}
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
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Material Name</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Site Name</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Actual Stock</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Used Stock</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Available Stock</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Cost/Unit</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Total Cost</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Buy Date</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectMaterials.map((material, index) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{material.materialName}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{material.siteName}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{material.actualStock}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{material.usedStock}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(material.stockStatus)}`}>
                    {material.availableStock}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{formatCurrency(material.costPerUnit)}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{formatCurrency(material.totalCost)}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  {new Date(material.buyDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(material.stockStatus)}
                    <span className="capitalize">{material.stockStatus}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
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
        {projectMaterials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No materials found for this project. Add some materials to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsTable;