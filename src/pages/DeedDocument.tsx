import Loader from "@/components/Loader";
import Constants from "@/config/Constants";
import ApiService from "@/services/ApiService";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";



const DeedDocument: React.FC = () => {
    const [pdf, setPdf] = useState<string>('');
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if(location.pathname == '/deedDoc') {
            getDeedPdf();
        }
    }, [location]);

    const getDeedPdf = async () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        const idArr = id.split('-');
        const unique_id = idArr[0];
        const dbname = idArr[1];
        const from_epanjeeyan_ngdrs = idArr[2];

        var data = {
            unique_id: unique_id,
            dbname: dbname,
            from_epanjeeyan_ngdrs: from_epanjeeyan_ngdrs
        };

        setLoading(true);
        var response = await ApiService.get('get_deed', JSON.stringify(data));
        setLoading(false);
        

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        setPdf(response.data);

    };




    return (<div>
        {pdf ? (<embed type="application/pdf" width="100%" height="900px" src={`${Constants.API_BASE_URL_ASSET + pdf}`} />) : (
            <p>Loading ...</p>
        )}

        {/* {pdf && <a
            href={`${Constants.API_BASE_URL_ASSET + pdf}`}
            target=""
            rel="noopener noreferrer"
            className="text-blue-600 underline"
        >
            View
        </a>} */}

        
        <Toaster position="top-center" />
        <Loader loading={loading} />
    </div>);
};

export default DeedDocument;