
import { createContext, useReducer,useContext } from "react";


export const authReducer = (state,action)=>{
    switch(action.type){
        case 'GET_USER':
            
                return { ...state, user: action.payload };
        case 'UPDATE_USER':
            
                return { ...state, user: action.payload };

        case 'LOGOUT_USER':
            return {
                user: null
            };

        default:
            return state
    }
}


export const DashboardUserContext = createContext(); 


export default function DashboardUserContextProvider({children}) {
    const [state,dispatch] = useReducer(authReducer , {user:null})


  return (
   <DashboardUserContext.Provider value={{...state,dispatch}}>
          {children}
   </DashboardUserContext.Provider>
  )
}


export const useDasboardHook = () => useContext(DashboardUserContext);