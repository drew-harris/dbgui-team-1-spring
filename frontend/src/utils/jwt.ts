export const setJwt = (token) => {
    console.log("setJwt", token);
    window.localStorage.setItem("jwt", token);
  };

export const deleteJwt = () => {
    console.log("deleteJwt");
    window.localStorage.removeItem("jwt");
  };
  