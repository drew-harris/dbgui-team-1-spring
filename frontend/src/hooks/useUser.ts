import { decodeJwt } from "../utils/jwt";

export const useUser = () => {
    const user = decodeJwt();
    return user;
    }