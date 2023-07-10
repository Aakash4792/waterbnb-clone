import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
export const UserContext = createContext({});

async function loginHandler() {
  try {
    const response = await fetch(
      "https://backend-water-bnb.onrender.com/login",
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log("data from server : ", data);
    return data;
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
