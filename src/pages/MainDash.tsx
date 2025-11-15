

import { Navigate, Outlet } from "react-router-dom";
import StorageService from "../services/StorageService";
import Constants from "@/config/Constants";

const MainDash = () => {

    const user = StorageService.getJwtCookie();
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const usertype = params.get('usertype');

    if (id && usertype) {
        StorageService.jwtSave(id);

        if (usertype == "4") {
            return <Navigate to="/co-dashboard" replace />;
        }
        else if (usertype == "3") {
            return <Navigate to="/lm-dashboard" replace />;
        }
        else if (usertype == '5') {
            return <Navigate to="/sk-dashboard" replace />;
        }
        else if (usertype == '6') {
            return <Navigate to="/adc-dashboard" replace />;
        }
        else {
            window.location.href = Constants.SINGLESIGN_URL;
            return;
        }
    }
    else {
        const userData: any = StorageService.getJwtCookieData(user);
        if (userData.usertype == "4") {
            return <Navigate to="/co-dashboard" replace />;
        }
        else if (userData.usertype == "3") {
            return <Navigate to="/lm-dashboard" replace />;
        }
        else if (userData.usertype == '5') {
            return <Navigate to="/sk-dashboard" replace />;
        }
        else if (userData.usertype == '6') {
            return <Navigate to="/adc-dashboard" replace />;
        }
        else if(userData.usertype == '11' || userData.usertype == '1') {
            return <Navigate to="/reports" replace />;
        }
        else {
            return <Navigate to="/login" replace />;
            // window.location.href = Constants.SINGLESIGN_URL;
        }
    }

    
    // 

    
};

export default MainDash;