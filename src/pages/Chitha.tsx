import ApiService from "@/services/ApiService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";


const Chitha: React.FC = () => {
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if(location.pathname == '/chitha-view') {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            getChithaData(id);
        }
        
    }, [location]);

    const getChithaData = async (id: string) => {
        if(!id || id == '' && id == undefined) {
            return;
        }
        const data = {
            id: id
        };
        setLoading(true);
        const response = await ApiService.get('get_chitha_data', JSON.stringify(data));
        setLoading(false);

         if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }
        console.log(response);
        
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-medical-900 mb-2">Chitha</h1>
                </div>
            </div>
            
        </div>
    );
};

export default Chitha;