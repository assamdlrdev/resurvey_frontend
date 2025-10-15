import { useEffect } from "react";
import { useLocation } from "react-router-dom";



const DeedDocument: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // getDeedPdf();
    }, [location]);




    return (<div>
        
    </div>);
};

export default DeedDocument;