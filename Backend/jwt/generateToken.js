import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (userId, role, res) => {
  const token = jwt.sign(
    { userId, role },
    process.env.USER_JWT_SECRET_KEY,

    {
      expiresIn: "30d",
    }
  );
    console.log(token)
    
  res.cookie("jwtuser", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 1000,
  });

  return token;
};

export default generateToken;
