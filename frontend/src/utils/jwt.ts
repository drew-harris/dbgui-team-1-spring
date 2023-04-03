// utils/jwt.ts
import jwtDecode from "jwt-decode";

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  type: string;
}

export const getJwt = () => {
  const jwt = window.localStorage.getItem("jwt");
  console.log("jwt", jwt);
  return jwt;
};

export const validateJwt = async (
  token: string
): Promise<JwtPayload | null> => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // Add any additional validations or checks as needed.
    console.log("decoded", decoded);
    return decoded;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
};

export const setJwt = (token) => {
  console.log("setJwt", token);
  window.localStorage.setItem("jwt", token);
};
