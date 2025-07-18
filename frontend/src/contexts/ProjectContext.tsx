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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "https://projectmanagement-wouh.onrender.com/api/projects/getproject"
        );
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
useEffect(() => {
  fetchAllStaff();
}, []);
  const createProject = async (
    projectData: Omit<Project, "id" | "createdAt">
  ) => {
    try {
      const res = await axios.post(
        "https://projectmanagement-wouh.onrender.com/api/projects/save",
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

      setProjects((prev) => [newProject, ...prev]);
      setCurrentProject(newProject);
    } catch (err) {
      console.error("Failed to create project:", err);
      throw err;
    }
  };

  const selectProject = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setCurrentProject(found);
    } else {
      console.warn(`Project with id ${projectId} not found`);
    }
  };

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
      const res = await axios.get("https://projectmanagement-wouh.onrender.com/api/material/getmat");
      if (!res.data || !res.data.data) {
        console.error("Invalid response structure:", res.data);
        return;
      }
      const data = res.data.data;
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
         projectId: typeof m.projectId === 'object' ? m.projectId._id : m.projectId

        };
      });

      setMaterials(fetchedMaterials);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    }
  };

  const addMaterial = async (
    materialData: Omit<Material, "id" | "availableStock" | "totalCost" | "stockStatus">
  ) => {
    try {
      const response = await axios.post(
        "https://projectmanagement-wouh.onrender.com/api/material/savemat",
        materialData
      );
      const saved = response.data.data;

      const availableStock = saved.actualStock - saved.usedStock;
      const totalCost = saved.actualStock * saved.costPerUnit;
      const stockStatus = calculateStockStatus(availableStock, saved.actualStock);

      const newMaterial: Material = {
        ...saved,
        id: saved._id,
        projectId: materialData.projectId, // ✅ explicitly set projectId
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
  axios
    .put(`https://projectmanagement-wouh.onrender.com/api/material/updatemat/${id}`, updates)
    .then((response) => {
      const updatedMaterial = response.data.material;

      // Now update the local state using the updated data
      setMaterials((prev) =>
        prev.map((material) => {
          if (material.id === id) {
            const updated = {
              ...material,
              ...updatedMaterial,
            };
            return updated;
          }
          return material;
        })
      );
    })
    .catch((error) => {
      console.error("Failed to update material:", error);
    });
};


  const deleteMaterial = (id: string) => {
    axios
      .delete(`https://projectmanagement-wouh.onrender.com/api/material/delmat/${id}`)
      .then(() => {
        console.log("Material deleted successfully");
      })
      .catch((error) => {
        console.error("Failed to delete material:", error);
      });
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

const addStaff = async (staffData: Omit<Staff, "id">) => {
  try {
    const res = await axios.post("https://projectmanagement-wouh.onrender.com/api/staff/addstaff", staffData);
    const saved = res.data.data;

    const newStaff: Staff = {
      id: saved._id,
      projectId: saved.projectId,
      serialNumber: saved.serialNumber,
      role: saved.role,
      name: saved.fullName, // Ensure frontend uses `name` mapped from `fullName`
      salary: saved.salary,
      workProgress: saved.workProgress,
      startDate: saved.startDate,
      status: saved.status,
    };

    setStaff((prev) => [...prev, newStaff]);
  } catch (err) {
    console.error("Failed to add staff:", err);
    throw err;
  }
};
const fetchAllStaff = async () => {
  try {
    const res = await axios.get("https://projectmanagement-wouh.onrender.com/api/staff/getstaff");
    if (!res.data || !res.data.data) {
      console.error("Invalid response structure:", res.data);
      return;
    }

    const data = res.data.data;

    const fetchedStaff: Staff[] = data.map((s: any) => ({
      id: s._id,
      serialNumber: s.serialNumber,
      role: s.role,
      name: s.fullName || s.name, // in case backend sends fullName
      salary: s.salary,
      workProgress: s.workProgress,
      startDate: s.startDate,
      status: s.status,
      projectId: typeof s.projectId === 'object' ? s.projectId._id : s.projectId,
    }));

    setStaff(fetchedStaff);
  } catch (err) {
    console.error("Failed to fetch staff:", err);
  }
};

 const updateStaff = async (id: string, updates: Partial<Staff>) => {
  try {
    // call backend API
    await axios.put(`https://projectmanagement-wouh.onrender.com/api/staff/updatestaff/${id}`, updates);

    // update state
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  } catch (err) {
    console.error("Failed to update staff:", err);
    alert("Failed to update staff. Please try again.");
  }
};


const deleteStaff = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this staff member?")) {
    return;
  }

  try {
    await axios.delete(`https://projectmanagement-wouh.onrender.com/api/staff/deletestaff/${id}`);
    setStaff((prev) => prev.filter((member) => member.id !== id));
  } catch (err) {
    console.error("Failed to delete staff:", err);
    alert("Failed to delete staff. Please try again.");
  }
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
