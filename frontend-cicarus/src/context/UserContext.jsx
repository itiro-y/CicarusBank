import React, { createContext, useState, useEffect, useContext } from 'react';
import jwtDecode from '../utils/jwtDecode';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken && decodedToken.sub) { // 'sub' is typically the username/subject
                setUser({ name: decodedToken.sub }); // Assuming 'sub' contains the username/name
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
