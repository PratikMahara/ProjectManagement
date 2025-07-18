import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Material } from "../models/material.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
const calculateStockStatus = (available, total) => {
  const pct = (available / total) * 100;
  if (pct <= 20) return "critical";
  if (pct <= 50) return "warning";
  return "good";
};
const saveMaterial = asyncHandler(async (req, res) => {
  const {
    projectId,
    serialNumber,
    materialName,
    siteName,
    actualStock,
    usedStock,
    costPerUnit,
    buyDate,
  } = req.body;
  if (
    [serialNumber, materialName, siteName].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all the credentials");
  }

  if (
    [actualStock, usedStock, costPerUnit].some(
      (field) => typeof field !== "number" || isNaN(field)
    )
  ) {
    throw new ApiError(400, "Stock and cost fields must be valid numbers");
  }
  const material = await Material.create({
    projectId,
    serialNumber,
    materialName,
    siteName,
    actualStock,
    usedStock,
    costPerUnit,
    buyDate,
  });
  if (!material) {
    throw new ApiError(500, "cannot able to save it into database");
  }
  console.log(material);

  res
    .status(200)
    .json(new ApiResponse(200, material, "Material saved to DB successfully"));
});

const getAllMaterial = asyncHandler(async (req, res) => {
  const material = await Material.find().populate(
    "projectId",
    "_id projectName"
  );
  if (!material) {
    throw new ApiError(401, "Nothing is fetched");
  }
  try {
    res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Cannot find material", error });
  }
});

const deleteMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, " Id not found");
  }
  const deleteMat = await Material.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  if (!deleteMat) {
    throw new ApiError(400, "material cannot be deleted");
  }
  res.status(200).json({
    success: true,

    message: "Material Deleted Successfully",
  });
});
const updateMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id) {
    throw new ApiError(404, "ID not provided");
  }

  // Optional: Validate input fields
  const { actualStock, usedStock, costPerUnit } = updates;

  if (
    actualStock === undefined ||
    usedStock === undefined ||
    costPerUnit === undefined
  ) {
    throw new ApiError(
      400,
      "Missing required fields: actualStock, usedStock, or costPerUnit"
    );
  }

  const availableStock = actualStock - usedStock;
  const totalCost = actualStock * costPerUnit;
  const stockStatus = calculateStockStatus(availableStock, actualStock);

  const updatedMat = await Material.findByIdAndUpdate(
    id,
    {
      ...updates,
      availableStock,
      totalCost,
      stockStatus,
    },
    { new: true }
  );

  if (!updatedMat) {
    throw new ApiError(400, "Material not found or not updated");
  }

  res.status(200).json({
    success: true,
    message: "Material updated successfully",
    material: updatedMat,
  });
});

export { saveMaterial, getAllMaterial, deleteMaterial, updateMaterial };
