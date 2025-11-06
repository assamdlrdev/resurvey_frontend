import StorageService from "@/services/StorageService";
import { Navigate, Outlet } from "react-router-dom";


export default function SurveyorLayout() {

    const DEO_CODE = '00';                // 00 = DEO
    const ADMIN_CODE = '1';               // 1 = Admin User
    const SUPERADMIN_CODE = '2';          // 2 = Super Admin User
    const LM_CODE = '3';                  // 3 =  (LM)
    const CO_CODE = '4';                  // 4 = (CO)
    const SK_CODE = '5';                  // 5 =  (SK)
    const ADC_CODE = '6';                 // 6 =  (ADC)
    const DC_CODE = '7';                  // 7 =  (DC)
    const SDO_CODE = '8';                 // 8 =  (SDO)
    const GUEST_CODE = '9';               // 9 =  (Guest User)
    const SUPERVISOR_CODE = '10';         // 10 =  (Supervisor)
    const SURVEYOR_CODE = '11';           // 11 =  (Surveyor)
    const SPMU_CODE = '12';               // 12 =  (SPMU)
    const SURVEY_SUPER_ADMIN_CODE = '13'; // 13 =  (Survey Super Admin)
    const SURVEY_GIS_ASSISTANT_CODE = '14'; // 14 = GIS Assistant for Survey Operations

    const user = StorageService.getJwtCookie();
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const userData: any = StorageService.getJwtCookieData(user);



    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    const allowedUserTypes = [SURVEYOR_CODE, ADMIN_CODE, SURVEY_GIS_ASSISTANT_CODE, SUPERADMIN_CODE, GUEST_CODE, LM_CODE, ADC_CODE, DC_CODE, SDO_CODE];


    if (!allowedUserTypes.includes(userData.usertype)) {
        return <Navigate to="/login" replace />;
    }



    return (

        <Outlet />

    );



};