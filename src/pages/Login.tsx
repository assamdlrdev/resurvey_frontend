import { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import Constants from "../config/Constants";
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast, Toaster } from "react-hot-toast";
import StorageService from "../services/StorageService";


const Login = () => {
    // BASIC 
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if(location.pathname == '/login') {
            loadCaptchaEnginge(6);
        }
    }, [location]);

    const goTo = (url: string) => {
        navigate(url);
    };

    // END BASIC

    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [captcha, setCaptcha] = useState<string>('');


    const reset = () => {
        setUserName('');
        setPassword('');
    };


    const submit = async () => {
        if(userName == '' || userName == undefined || password == '' || password == undefined) {
            toast.error("Inputs not set!");
            return;
        }
        if(!validateCaptcha(captcha)) {
            toast.error("Captcha does not match!");
            return;
        }
        loadCaptchaEnginge(6);
        setCaptcha('');
        
        
        const data = {
            api_key:Constants.API_SECRET,
            user_name: userName,
            password: password
        };
        setLoading(true);
        const response = await ApiService.get('login', JSON.stringify(data));
        setLoading(false);

        if(response.status !== 'SUCCESS' || response.responseType !== 2) {
            toast.error(response.msg);
            reset();
            return;
        }
        StorageService.jwtSave(response.data);
        toast.success(response.msg);
        goTo('/dashboard');

        
    };

    return (
        <div className="w-screen h-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

                <form className="space-y-5">
                    <div>
                        <label className="block text-gray-600 mb-1">Username</label>
                        <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="deepak"
                        value={userName}
                        onChange={(e: any) => setUserName(e.currentTarget.value)}
                        onInput={(e: any) => setUserName(e.currentTarget.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Password</label>
                        <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e: any) => setPassword(e.currentTarget.value)}
                        onInput={(e: any) => setPassword(e.currentTarget.value)}
                        />
                    </div>

                    <div>
                        <LoadCanvasTemplate />
                        <input type="text" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Captcha" value={captcha} onChange={(e: any) => setCaptcha(e.currentTarget.value)} onInput={(e: any) => setCaptcha(e.currentTarget.value)} />
                    </div>

                   <button className="w-100 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" type="button" onClick={submit}>
                    <strong>Submit</strong>
                    </button>
                </form>
            </div>
            <Loader loading={loading} />
            <Toaster position="top-center" />
            
        </div>
        
    );
};

export default Login;

