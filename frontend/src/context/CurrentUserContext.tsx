import { createContext, Dispatch, SetStateAction, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Verwende useNavigate statt history

type User = { username: string } | null;
type SetUser = Dispatch<SetStateAction<User>>;

export const CurrentUserContext = createContext<User>(null);
export const SetCurrentUserContext = createContext<SetUser>(() => {});

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(null);
  const navigate = useNavigate(); // Erstelle den navigate-Hook für die Weiterleitung

  const handleMount = async () => {
    try {
      const { data } = await axios.get("/dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useEffect(() => {
    // Axios-Interceptors
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        try {
          await axios.post("/dj-rest-auth/token/refresh/");
        } catch (err) {
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              navigate("/signin");  // Verwende navigate statt history.push
            }
            return null;
          });
          return config;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                navigate("/signin");  
              }
              return null;
            });
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      }
    );

    
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]); 

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

