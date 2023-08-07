import { createContext, useRef } from "react";
import { userModel } from "../scripts/data";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const authInit = userModel(0, '', '', [], []);
    const auth = useRef(authInit);
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;