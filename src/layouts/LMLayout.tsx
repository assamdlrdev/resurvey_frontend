import Constants from "@/config/Constants";
import StorageService from "@/services/StorageService";
import { Navigate, Outlet } from "react-router-dom";


export default function LMLayout() {

    const user = StorageService.getJwtCookie();
    
    if(!user) {
        // return <Navigate to="/login" replace />;
        window.location.href = Constants.SINGLESIGN_URL;
        return;
    }

    const userData: any = StorageService.getJwtCookieData(user);

    // console.log(userData);

    

    if(!userData) {
        // return <Navigate to="/login" replace />;
        window.location.href = Constants.SINGLESIGN_URL;
        return;
    }

    // if(userData.usertype == )
    if(userData.usertype != '3')  {
        // return <Navigate to="/login" replace />;
        window.location.href = Constants.SINGLESIGN_URL;
        return;
    }


    return (
        <Outlet />
    );
};