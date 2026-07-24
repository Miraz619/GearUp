
import { Response } from "express";

interface IMetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface ISendResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  metaData?: IMetaData;
}

export const sendResponse = <T>(
  res: Response,
  responseData: ISendResponse<T>,
) => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    statusCode: responseData.statusCode,
    message: responseData.message,
    metaData: responseData.metaData,
    data: responseData.data,
  });
};