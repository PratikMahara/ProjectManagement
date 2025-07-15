import { Project } from "../models/project.models.js";
import { projectGlobal } from "../models/projectglobal.models.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const saveProject = asyncHandler(async (req, res) => {
  const { projectName, location, startDate, expectedEndDate, estimatedCost } =
    req.body;
if (
  [projectName, location, startDate, expectedEndDate].some(
    (field) => typeof field !== 'string' || field.trim() === ''
  ) || estimatedCost === undefined || estimatedCost === null || isNaN(estimatedCost)
) {
  throw new ApiError(400, "Please fill all the details");
}


  const project = await Project.create({
    projectName,
    location,
    startDate,
    expectedEndDate,
    estimatedCost,
  });
  if (!project) {
    throw new ApiError(500, "server error while saving project");
  }

  res
    .status(200)
    .json(new ApiResponse(200, project, "project created successfully"));
});

 const getAllProjects = async (req,res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

const saveProjects = asyncHandler(async (req, res) => {
  const {id, projectName, location, startDate, expectedEndDate, estimatedCost } =
    req.body;
if (
  [id,projectName, location, startDate, expectedEndDate].some(
    (field) => typeof field !== 'string' || field.trim() === ''
  ) || estimatedCost === undefined || estimatedCost === null || isNaN(estimatedCost)
) {
  throw new ApiError(400, "Please fill all the details");
}


  const project = await projectGlobal.create({
    id,
    projectName,
    location,
    startDate,
    expectedEndDate,
    estimatedCost,
  });
  if (!project) {
    throw new ApiError(500, "server error while saving project");
  }

  res
    .status(200)
    .json(new ApiResponse(200, project, "project created successfully"));
});

export {saveProject,getAllProjects,saveProjects};
