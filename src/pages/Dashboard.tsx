import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



const Dashboard = () => {
    // BASIC 
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if(location.pathname == '/dashboard') {
            
        }
    }, [location]);

    const goTo = (url: string) => {
        navigate(url);
    };
    // END BASIC

    return (
        <>

        </>
    );
};

export default Dashboard;