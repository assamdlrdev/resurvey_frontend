import StorageService from "@/services/StorageService";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const CODashboard: React.FC = () => {

    const location = useLocation();

    useEffect(() => {
        if(location.pathname == '/co-dashboard') {
            const user = StorageService.getJwtCookie();
            console.log(user);
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            CO Dashboard
        </div>
    );
};

export default CODashboard;