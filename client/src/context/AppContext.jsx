import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Create a new context object that can be used to share data across components
export const AppContent = createContext();

// Define a Context Provider component — this is the "house" where your shared data lives.
export const AppContextProvider = (props) =>{

    // Get the backend URL from your .env file (Vite environment variable)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    //  Define states that will be shared across your app
    const [isLoggedin,setIsLoggedIn] = useState(false);
    const [userData,setUserData] = useState(null);

    const getUserData = async()=>{
        try{
            const {data} = await axios.get(`${backendUrl}/api/user/data`);
            data.success ? setUserData(data.userData) : toast.error(data.message)
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }
    
    // Bundle all shared data and functions into a single object
    const value = {
        backendUrl,
        isLoggedin,setIsLoggedIn,
        userData,setUserData,
        getUserData
    }
    
 return(
    // Any child component wrapped inside <AppContextProvider> will get access to the above values
    // The AppContent.Provider works like a router that sends data signals to all its child components.
    // AppContextProvider = the house where your data is stored and shared.
    <AppContent.Provider value={value}>
        {props.children}
    </AppContent.Provider>
 )
}

// Now go to main.jsx file


// Working of above code
// In AppContext.jsx, the shared data like isLoggedin, userData, and backendUrl is stored inside the AppContextProvider component, 
// which we can think of as a “house.” Inside this house, <AppContent.Provider> acts like a router that sends the data to any component that wants it. 
// When we go to main.jsx, we wrap our <App /> inside <AppContextProvider>, which means the entire app is now inside the house. 
// Every component inside <App /> can then access or update the shared data by connecting to the router using useContext(AppContent). So, the data itself lives in the house (AppContextProvider), 
// and the AppContent.Provider ensures that all components inside the house can receive and use that data whenever they need it.