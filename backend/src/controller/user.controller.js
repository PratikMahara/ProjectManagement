import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token"
    );
  }
};
const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, "please fill all the credentials");
  }
  const user = await User.create({ username, password });
  if (!user) {
    throw new ApiError(500, "database error");
  }
  const createdUser = await User.findOne(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(404, "user doesnot exist in database");
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Please provide both username and password.");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  
  if (user.password !== password) {
    throw new ApiError(401, "Invalid credentials");
  }


  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

 
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 15, 
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, 
  });

  const userResponse = {
    _id: user._id,
    username: user.username,
    accessToken,
    refreshToken
   
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userResponse, "Login successful"));
});
const getUser=asyncHandler(async(req,res)=>{
  const user=req.user;
  if(!user){
    throw new ApiError(400," user not found");
  }
  // console.log(user);

  res.
  status(200)
  .json(new ApiResponse(200,user,"user found"));
})
export { register, loginUser, getUser };
