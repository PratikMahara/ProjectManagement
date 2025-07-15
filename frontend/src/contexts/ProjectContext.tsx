import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { Project, Material, Staff } from "../types";

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  materials: Material[];
  staff: Staff[];

  createProject: (project: Omit<Project, "id" | "createdAt">) => Promise<void>;
  selectProject: (projectId: string) => void;

  addMaterial: (
    material: Omit<
      Material,
      "id" | "availableStock" | "totalCost" | "stockStatus"
    >
  ) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
fetchAllMaterials: () => Promise<void>;

  addStaff: (staff: Omit<Staff, "id">) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  // 📦 Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/projects/getproject"
        );
        // console.log(res.data.data)
        const fetched: Project[] = res.data.data.map((p: any) => ({
          id: p._id,
          projectName: p.projectName,
          location: p.location,
          startDate: p.startDate,
          expectedEndDate: p.expectedEndDate,
          estimatedCost: p.estimatedCost,
          createdAt: p.createdAt,
        }));
        
        setProjects(fetched);


        if (fetched.length > 0) {
          // console.log("Auto-selecting first project:", fetched[0]);
          setCurrentProject(fetched[0]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    fetchProjects();
  }, []);
useEffect(() => {
  if (currentProject) {
    fetchAllMaterials();
  }
}, [currentProject]);

  // 📦 Create new project
  const createProject = async (
    projectData: Omit<Project, "id" | "createdAt">
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/projects/save",
        projectData
      );
      const created = res.data.data;

      const newProject: Project = {
        id: created._id,
        projectName: created.projectName,
        location: created.location,
        startDate: created.startDate,
        expectedEndDate: created.expectedEndDate,
        estimatedCost: created.estimatedCost,
        createdAt: created.createdAt,
      };

      // console.log("New Project created & set as current:", newProject);

      setProjects((prev) => [newProject, ...prev]);
      setCurrentProject(newProject);
    } catch (err) {
      console.error("Failed to create project:", err);
      throw err;
    }
  };

  // 📦 Select existing project
  const selectProject = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      // console.log("Selected existing project:", found);
      setCurrentProject(found);
    } else {
      console.warn(`Project with id ${projectId} not found`);
    }
  };

  // 📦 Stock status helper
  const calculateStockStatus = (
    available: number,
    total: number
  ): "critical" | "warning" | "good" => {
    const pct = (available / total) * 100;
    if (pct <= 20) return "critical";
    if (pct <= 50) return "warning";
    return "good";
  };
const fetchAllMaterials = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/material/getmat");
    if(!res.data || !res.data.data) {
      console.error("Invalid response structure:", res.data);
      return;
    }
    const data = res.data.data;
console.log(data);
    const fetchedMaterials: Material[] = data.map((m: any) => {
      const availableStock = m.actualStock - m.usedStock;
      const totalCost = m.actualStock * m.costPerUnit;
      const stockStatus = calculateStockStatus(availableStock, m.actualStock);

       return {
    id: m._id,
    serialNumber: m.serialNumber,
    materialName: m.materialName,
    siteName: m.siteName,
    actualStock: m.actualStock,
    usedStock: m.usedStock,
    costPerUnit: m.costPerUnit,
    buyDate: m.buyDate,
    availableStock,
    totalCost,
    stockStatus,
    projectId: typeof m.projectId === 'object' ? m.projectId.id : m.projectId // ✅ fix here
  };
    });

    setMaterials(fetchedMaterials);
  } catch (err) {
    console.error("Failed to fetch materials:", err);
  }
};

  // 📦 Add Material
  const addMaterial = async (
  materialData: Omit<Material, "id" | "availableStock" | "totalCost" | "stockStatus">
) => {
  try {
    
    const response = await axios.post(
      "http://localhost:5000/api/material/savemat",
      materialData
    );
    const saved = response.data.data;

   console.log(saved)
    const availableStock = saved.actualStock - saved.usedStock;
    const totalCost = saved.actualStock * saved.costUnit; 
    const stockStatus = calculateStockStatus(availableStock, saved.actualStock);

    
    const newMaterial: Material = {
      ...saved,
      id: saved._id, 
      availableStock,
      totalCost,
      stockStatus,
    };

    setMaterials((prev) => [...prev, newMaterial]);
  } catch (error) {
    console.error("Failed to add material:", error);
    throw error;
  }
};

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials((prev) =>
      prev.map((material) => {
        if (material.id === id) {
          const updated = { ...material, ...updates };
          updated.availableStock =
            updated.actualStock - updated.usedStock;
          updated.totalCost =
            updated.actualStock * updated.costPerUnit;
          updated.stockStatus = calculateStockStatus(
            updated.availableStock,
            updated.actualStock
          );
          return updated;
        }
        return material;
      })
    );
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const addStaff = (staffData: Omit<Staff, "id">) => {
    const newStaff: Staff = {
      ...staffData,
      id: Date.now().toString(),
    };
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        materials,
        staff,

        createProject,
        selectProject,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        fetchAllMaterials,
        addStaff,
        updateStaff,
        deleteStaff,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
