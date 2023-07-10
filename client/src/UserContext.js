import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
export const UserContext = createContext({});

async function loginHandler() {
  try {
    const response = await axios.get(
      "https://backend-water-bnb.onrender.com/login"
    );
    // fetch(
    //   "https://backend-water-bnb.onrender.com/login",
    //   {
    //     credentials: "include",
    //   }
    // );
    console.log("data from server : ", response.data);
    return response.data;
  } catch (err) {
    console.log("Fetch failed");
  }
}

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      loginHandler().then((data) => {
        setUser(data);
        setReady(true);
      });
    }
  }, [setUser, user]);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
