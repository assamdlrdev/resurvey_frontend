
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/symptoms");
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
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
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-medical-500 hover:bg-medical-600 text-white">
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Button>
      </form>
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
