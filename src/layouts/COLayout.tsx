import Constants from "@/config/Constants";
import StorageService from "@/services/StorageService";
import { Navigate, Outlet } from "react-router-dom";


export default function COLayout() {

    const user = StorageService.getJwtCookie();
    
    if(!user) {
        // return <Navigate to="/login" replace />;
        window.location.href = Constants.SINGLESIGN_URL;
        return;
    }

    const userData: any = StorageService.getJwtCookieData(user);

    

    if(!userData) {
        // return <Navigate to="/login" replace />;
        window.location.href = Constants.SINGLESIGN_URL;
        return;
    }

    // if(userData.usertype == )
    if(userData.usertype != '4')  {
        // return <Navigate to="/login" replace />;
        window.location.href = Constants.SINGLESIGN_URL;
        return;
    }


    return (
        <Outlet />
    );
};