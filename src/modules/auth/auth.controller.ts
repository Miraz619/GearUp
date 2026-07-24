import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
  statusCode: httpStatus.CREATED,
  success: true,
  message: "User registered successfully",
  data: result,
});
});

const loginUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const result = await AuthService.loginUser(req.body);

  res.cookie("accessToken",result.accessToken, {
     httpOnly: true,
     secure: false,
     sameSite: "none",
     maxAge: 1000 * 60 * 60 * 24 //1day
   })
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  const result = await AuthService.getMe(req.user?.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  getMe
};