// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useMemo,
// } from "react";
// import axios from "../lib/axios/axiosInstance";
// import Loader from "../components/common/Spinner"; // Loading spinner while auth check runs

// const UserContext = createContext();

// // Custom hook for consuming the context
// export const useUser = () => useContext(UserContext);

// // Default avatar fallback
// const DEFAULT_PROFILE_PIC = "https://i.ibb.co/2kR5zq0/default-avatar.png";

// // Provider component
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE_PIC);
//   const [displayName, setDisplayName] = useState("");
//   const [authChecked, setAuthChecked] = useState(false);

//   // Always send credentials (cookies, tokens)
//   axios.defaults.withCredentials = true;

//   const fetchUser = async () => {
//     try {
//       const res = await axios.get("/v1/users/me");
//       const data = res.data;

//       if (!data?.profile) throw new Error("User profile not found");

//       setUser(data);
//       setDisplayName(data.profile.name || "User");
//       setProfilePic(
//         `${data.profile.photoURL || DEFAULT_PROFILE_PIC}?t=${Date.now()}`
//       );
//     } catch (error) {
//       console.error("[UserContext] Failed to fetch user:", error);
//       setUser(null);
//       setDisplayName("");
//       setProfilePic(DEFAULT_PROFILE_PIC);
//     } finally {
//       setAuthChecked(true);
//     }
//   };

//   const logout1 = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     document.cookie =
//       "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     setUser(null);
//     setDisplayName("");
//     setProfilePic(DEFAULT_PROFILE_PIC);
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const value = useMemo(
//     () => ({
//       user,
//       profilePic,
//       displayName,
//       fetchUser,
//       logout1,
//       authChecked,
//     }),
//     [user, profilePic, displayName, authChecked]
//   );

//   return (
//     <UserContext.Provider value={value}>
//       {authChecked ? children : <Loader />}
//     </UserContext.Provider>
//   );
// };
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "../lib/axios/axiosInstance";
import Loader from "../components/common/Spinner"; // Add a simple spinner if missing

// Create context
const UserContext = createContext();

// Custom hook
export const useUser = () => useContext(UserContext);

// Default avatar
const DEFAULT_PROFILE_PIC = "https://i.ibb.co/2kR5zq0/default-avatar.png";

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE_PIC);
  const [authChecked, setAuthChecked] = useState(false);

  axios.defaults.withCredentials = true;

  const fetchUser = async () => {
    try {
      const res = await axios.get("/v1/users/me");
      const data = res.data;

      if (!data?.profile) throw new Error("No user profile");

      setUser(data);
      setDisplayName(data.profile.name || "User");
      setProfilePic(data.profile.photoURL || DEFAULT_PROFILE_PIC);
    } catch (err) {
      console.error("[UserContext] Error fetching user:", err);
      setUser(null);
      setDisplayName("");
      setProfilePic(DEFAULT_PROFILE_PIC);
    } finally {
      setAuthChecked(true);
    }
  };

  const logout1 = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setDisplayName("");
    setProfilePic(DEFAULT_PROFILE_PIC);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      displayName,
      profilePic,
      authChecked,
      fetchUser,
      logout1,
    }),
    [user, displayName, profilePic, authChecked]
  );

  return (
    <UserContext.Provider value={value}>
      {authChecked ? children : <Loader />}
    </UserContext.Provider>
  );
};
