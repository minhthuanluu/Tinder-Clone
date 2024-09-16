import { useContext,createContext,useEffect,useState, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { StatusBar } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState();
    const [loadingInitial,setLoadingInitial] = useState();
    const [loading,setLoading]=useState();

    useEffect(()=>{
       const onSubscribe = onAuthStateChanged(auth,(user)=>{
            if(user){
                setUser(user);
            }else{
                setUser(null);
            }
            setLoading(false);
            setLoadingInitial(false);
        });

        return onSubscribe;
    },[]);

    const logout=()=>{
        signOut(auth).then(()=>{
            setUser(null);
        });
    };

    const methodValue=useMemo(()=>{
        return {user,setUser,loading,setLoading,logout};
    },[user,loading]);

    return <AuthContext.Provider value={methodValue}><StatusBar backgroundColor={"transparent"}/>{!loadingInitial && children}</AuthContext.Provider>
}

export default function useAuth(){
    return useContext(AuthContext)
}