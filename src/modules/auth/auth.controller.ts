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

// const loginUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
//   const result = await AuthService.loginUser(req.body);

//   res.cookie("accessToken",result.accessToken, {
//      httpOnly: true,
//      secure: false,
//      sameSite: "none",
//      maxAge: 1000 * 60 * 60 * 24 //1day
//    })

//    res.cookie("refreshToken", refreshToken, {
//   httpOnly: true,
//   secure: isProduction,
//   sameSite: isProduction ? "none" : "lax",
//   maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
// });
  
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User logged in successfully",
//     data: result,
//   });
// });


const loginUser = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await AuthService.loginUser(req.body);

    const { accessToken, refreshToken, user } = result;

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        user,
      },
    });
  },
);

const googleLogin = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await AuthService.googleLogin(req.body);

    const {
      accessToken,
      refreshToken,
      user,
    } = result;

    const isProduction =
      process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction
        ? "none"
        : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction
          ? "none"
          : "lax",
        maxAge:
          1000 *
          60 *
          60 *
          24 *
          7,
      },
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Google login successful",
      data: {
        accessToken,
        user,
      },
    });
  },
);

const refreshAccessToken = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const refreshToken = req.cookies?.refreshToken;

    const result =
      await AuthService.refreshAccessToken(refreshToken);

    const isProduction =
      process.env.NODE_ENV === "production";

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Access token generated successfully",
      data: result,
    });
  },
);

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
  googleLogin,
  getMe,
  refreshAccessToken
};