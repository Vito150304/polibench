import {createContext, useContext} from "react";

export const AuthContext = createContext(null);

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("il contesto non è stato trovato.");
    }
    return context;
}
export default useAuth;
