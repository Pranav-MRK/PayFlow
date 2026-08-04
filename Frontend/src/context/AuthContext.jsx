import { useState,useMemo,useCallback,useContext,createContext } from "react";

const AuthContext = createContext(null);

const getstoredAuth = ()=>{
    try {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth):null;
    } catch (error) {
        localStorage.removeItem("auth");
        return null;
    }

}

export function AuthProvider({ children }) {
    const[auth,setAuth] = useState(getstoredAuth);
    const setSession = useCallback((loginResponse)=>{
        const session ={
            token:loginResponse.token,
            user:loginResponse.user,
        }

        localStorage.setItem('auth',JSON.stringify(session));
        setAuth(session);

    },[])

    const logOut = useCallback(()=>{
        localStorage.removeItem('auth');
        setAuth(null);
    },[])
    const value = useMemo(()=>({
        auth,
        isAuthenticated :Boolean(auth?.token),
        setSession,
        logOut,

    }),[auth,logOut,setSession])
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}