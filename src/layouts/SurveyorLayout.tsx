import StorageService from "@/services/StorageService";
import { Navigate, Outlet } from "react-router-dom";


export default function SurveyorLayout() {

    const user = StorageService.getJwtCookie();

    
    
    if(!user) {
        return <Navigate to="/login" replace />;
    }

    const userData: any = StorageService.getJwtCookieData(user);

    

    if(!userData) {
        return <Navigate to="/login" replace />;
    }

    // if(userData.usertype == )
    if (userData.usertype !== '11' && userData.usertype !== '1' && userData.usertype !== '14' && userData.usertype !== '2' && userData.usertype !== '9') {
        return <Navigate to="/login" replace />;
    }


    return (
        
        <Outlet />
        
    );
};