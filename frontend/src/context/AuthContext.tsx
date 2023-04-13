import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import jwtDecode from "jwt-decode";

interface User {
  id: string;
  username: string;
  email: string;
  type: string;
}

interface JwtPayload extends User {}

interface AuthContextProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<{
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  // eslint-disable-next-line no-unused-vars
  updateToken: (token: string) => Promise<void>;
}>({
  user: null,
  setUser: () => {},
  updateToken: async () => {},
});

const validateJwt = async (token: string): Promise<JwtPayload | null> => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
};

const getUserFromJwt = async (): Promise<User | null> => {
  const token = window.localStorage.getItem("jwt");
  if (!token) {
    return null;
  }
  const decoded = await validateJwt(token);
  return decoded;
};

export default function AuthContextProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromJwt();
      setUser(user);
    };
    fetchUser();
  }, []);

  const updateToken = async (token: string) => {
    const validatedPayload = await validateJwt(token);

    if (validatedPayload) {
      window.localStorage.setItem("jwt", token);
      setUser(validatedPayload);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
}
