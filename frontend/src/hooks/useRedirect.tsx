import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


type UserAuthStatus = "loggedIn" | "loggedOut";

export const useRedirect = (userAuthStatus: UserAuthStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");
        
        if (userAuthStatus === "loggedIn") {
          navigate("/");
        }
      } catch (err) {
       
        if (userAuthStatus === "loggedOut") {
          navigate("/");
        }
      }
    };

    handleMount();
  }, [navigate, userAuthStatus]);
};
