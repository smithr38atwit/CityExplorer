import { createContext, useState } from "react";
import { authModel } from "../scripts/data";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const authInit = authModel(0, '', '', []);
    const [auth, setAuth] = useState(authInit);
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;