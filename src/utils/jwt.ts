
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


const verifyToken=(token: string, secret: string)=>{

   try {
     const verifiedToken=jwt.verify(token, secret);

    return verifiedToken;
   } catch (error:any) {
    throw new Error(error.message);
   }
}

export const jwtUtils = {
  CreateToken,
  verifyToken
};