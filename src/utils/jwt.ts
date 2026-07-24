
import jwt, { SignOptions } from "jsonwebtoken";

type TJwtPayload = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const CreateToken = (
  payload: TJwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {

 const token=jwt.sign(payload,
        secret,
     {expiresIn}as SignOptions)

     return token;
};

export const jwtUtils = {
  CreateToken,
};