import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Material, Staff } from '../types';
import axios from 'axios';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  materials: Material[];
  staff: Staff[];
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  selectProject: (projectId: string) => void;
  addMaterial: (material: Omit<Material, 'id' | 'availableStock' | 'totalCost' | 'stockStatus'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  // Fetch projects from backend on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects/getproject');
        const fetchedProjects: Project[] = res.data.data.map((p: any) => ({
          id: p._id,
          projectName: p.projectName,
          location: p.location,
          startDate: p.startDate,
          expectedEndDate: p.expectedEndDate,
          estimatedCost: p.estimatedCost,
          createdAt: p.createdAt
        }));
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const res = await axios.post('/api/projects', projectData);
      const created = res.data.data;
      const newProject: Project = {
        id: created._id,
        projectName: created.projectName,
        location: created.location,
        startDate: created.startDate,
        expectedEndDate: created.expectedEndDate,
        estimatedCost: created.estimatedCost,
        createdAt: created.createdAt
      };
      setProjects(prev => [...prev, newProject]);
      setCurrentProject(newProject);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const selectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  };

  const calculateStockStatus = (available: number, total: number): 'critical' | 'warning' | 'good' => {
    const percentage = (available / total) * 100;
    if (percentage <= 20) return 'critical';
    if (percentage <= 50) return 'warning';
    return 'good';
  };

  const addMaterial = (materialData: Omit<Material, 'id' | 'availableStock' | 'totalCost' | 'stockStatus'>) => {
    const availableStock = materialData.actualStock - materialData.usedStock;
    const totalCost = materialData.actualStock * materialData.costPerUnit;
    const stockStatus = calculateStockStatus(availableStock, materialData.actualStock);

    const newMaterial: Material = {
      ...materialData,
      id: Date.now().toString(),
      availableStock,
      totalCost,
      stockStatus
    };
    setMaterials(prev => [...prev, newMaterial]);
  };

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(material => {
      if (material.id === id) {
        const updated = { ...material, ...updates };
        updated.availableStock = updated.actualStock - updated.usedStock;
        updated.totalCost = updated.actualStock * updated.costPerUnit;
        updated.stockStatus = calculateStockStatus(updated.availableStock, updated.actualStock);
        return updated;
      }
      return material;
    }));
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  const addStaff = (staffData: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: Date.now().toString()
    };
    setStaff(prev => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(member =>
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(member => member.id !== id));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      materials,
      staff,
      createProject,
      selectProject,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      addStaff,
      updateStaff,
      deleteStaff
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
