
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { toast, Toaster } from "react-hot-toast";
import Constants from "@/config/Constants";
import ApiService from "@/services/ApiService";
import StorageService from "@/services/StorageService";
import Loader from "../Loader";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  // const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<string>('');

  useEffect(() => {
        if(location.pathname == '/login') {
            loadCaptchaEnginge(6);
        }
  }, [location]);

  const reset = () => {
      setUsername('');
      setPassword('');
  };

  const goTo = (url: string) => {
      navigate(url);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if(username == '' || username == undefined || password == '' || password == undefined) {
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
        user_name: username,
        password: password
    };
    setLoading(true);
    const response = await ApiService.get('login', JSON.stringify(data));
    setLoading(false);

    if(response.status !== 'y') {
        toast.error(response.msg);
        reset();
        return;
    }
    StorageService.jwtSave(response.data);
    toast.success(response.msg);
    goTo('/survey-data');
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-6 relative z-10 bg-white/90 backdrop-blur-sm">
      {/* ...form content unchanged... */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
        <p className="text-gray-500">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        {/* ...inputs and button unchanged... */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            id="use_name"
            type="text"
            placeholder="Enter Username"
            value={username}
            onInput={(e) => setUsername(e.currentTarget.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="captcha" className="text-sm font-medium text-gray-700">
            Captcha
          </label>
          <LoadCanvasTemplate />
          <Input
            id="captcha"
            type="text"
            placeholder="Enter Username"
            value={captcha}
            onInput={(e) => setCaptcha(e.currentTarget.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-medical-500 hover:bg-medical-600 text-white">
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Button>
      </form>
      <Loader loading={loading} />
      <Toaster position="top-center" />
      {/* <div className="text-center">
        <button
          onClick={() => navigate("/signup")}
          className="text-medical-600 hover:text-medical-700 text-sm transition-colors"
        >
          Don't have an account? Sign up
        </button>
      </div> */}
    </Card>
  );
}
