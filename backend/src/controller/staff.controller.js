import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Staff } from "../models/staff.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const addStaff = asyncHandler(async (req, res) => {
  const {
    projectId,
    serialNumber,
    role,
    fullName,
    workProgress,
    salary,
    startDate,
    status,
  } = req.body;
  if (
    !projectId ||
    !serialNumber ||
    !role ||
    !fullName ||
    workProgress === undefined ||
    salary === undefined ||
    !startDate ||
    !status
  ) {
    throw new ApiError(400, "Please fill all credentials");
  }
  const existingStaff = await Staff.findOne({ serialNumber, projectId });
  if (existingStaff) {
    throw new ApiError(400, "Staff is already in the team");
  }

  const staff = Staff.create({
    projectId,
    serialNumber,
    role,
    fullName,
    workProgress,
    salary,
    startDate,
    status,
  });
  if (!staff) {
    throw new ApiError(500, "Server Error to create a Staff");
  }

  res.status(201).json(
    new ApiResponse(201, staff, "Staff added successfully")
  )
});
const getAllStaff= asyncHandler(async (req, res) => {
  const staff= await Staff.find().populate(
    "projectId",
    "_id projectName"
  );
  if (!staff) {
    throw new ApiError(401, "Nothing is fetched");
  }
  try {
    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Cannot find material", error });
  }
});

const deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, " Id not found");
  }
  const deletestaff = await Staff.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  if (!deletestaff) {
    throw new ApiError(400, "material cannot be deleted");
  }
  res.status(200).json({
    success: true,

    message: "Material Deleted Successfully",
  });
});

const updateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "Id not found");
  }

  const updated = await Staff.findByIdAndUpdate(id, req.body, { new: true });

  if (!updated) {
    throw new ApiError(400, "Staff cannot be updated");
  }

  res.status(200).json({
    success: true,
    message: "Staff Updated Successfully",
    data: updated,
  });
});

export {addStaff,getAllStaff,deleteStaff,updateStaff};