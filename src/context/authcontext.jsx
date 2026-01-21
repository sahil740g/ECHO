import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Default to null (logged out)
    const [user, setUser] = useState(null);

    const login = () => {
        // Simulating a login
        setUser({
            id: "curr_user",
            name: "Current User",
            handle: "@currentuser",
            avatar: null // or a default image URL
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
