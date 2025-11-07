

import { Navigate, Outlet } from "react-router-dom";
import StorageService from "../services/StorageService";
import Constants from "@/config/Constants";

const MainDash = () => {

    const user = StorageService.getJwtCookie();
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const usertype = params.get('usertype');

    if (id && usertype) {
        if (!id) {
            // return <Navigate to="/login" replace />;
            window.location.href = Constants.SINGLESIGN_URL;
            return;
        }
        StorageService.jwtSave(id);
        return <Navigate to="/reports" replace />;

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

    const userData: any = StorageService.getJwtCookieData(user);
    return <Navigate to="/reports" replace />;

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
    else {
        // return <Navigate to="/login" replace />;
        // window.location.href = Constants.SINGLESIGN_URL;
        console.log(userData);
        return;
    }
};

export default MainDash;