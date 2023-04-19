import jwt_decode from "jwt-decode";

export const setJwt = (token) => {
    console.log("setJwt", token);
    window.localStorage.setItem("jwt", token);
  };

export const deleteJwt = () => {
    window.localStorage.removeItem("jwt");
  };

export const getJwt = () => {
    return window.localStorage.getItem("jwt");
  };

export const decodeJwt = () => {
    const jwt = getJwt();
    if (jwt) {
      return jwt_decode(jwt);
    }
    return null;
  }
