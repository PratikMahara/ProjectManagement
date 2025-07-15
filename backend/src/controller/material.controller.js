import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Material } from "../models/material.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const saveMaterial = asyncHandler(async (req, res) => {
  const {
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

const getAllMaterial=asyncHandler(async(req,res)=>{

  const material=await Material.find();
  if(!material){
    throw new ApiError(401,"Nothing is fetched");
  }
try {
  res.
  status(200)
  .json({
  success:true,
  data:material
  })
} catch (error) {
  res.status(500).json({success:false,message:"cannot find material",error})
}


})
export { saveMaterial,getAllMaterial };
