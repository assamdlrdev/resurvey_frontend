import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, User, Mail, Lock, Calendar, Brain, Shield, ActivitySquare } from "lucide-react";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual signup logic
    toast({
      title: "Account created",
      description: "Please log in with your new account",
    });
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      {/* Left Side: Info Section */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-medical-50 to-medical-100 p-8 lg:p-16 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="Medical Technology"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-medical-700 mb-4">AI-Powered Healthcare</h1>
          <p className="text-medical-600 mb-12">
            Advanced disease prediction and treatment recommendations powered by blockchain technology
          </p>
          <div className="space-y-8">
            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-medical-100 rounded-lg">
                <Brain className="h-6 w-6 text-medical-500" />
              </div>
              <div>
                <h3 className="font-semibold text-medical-700 mb-1">AI Diagnosis</h3>
                <p className="text-medical-600">Advanced symptom analysis and disease prediction</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-medical-100 rounded-lg">
                <Shield className="h-6 w-6 text-medical-500" />
              </div>
              <div>
                <h3 className="font-semibold text-medical-700 mb-1">Secure Blockchain</h3>
                <p className="text-medical-600">Your medical data is encrypted and secure</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-medical-100 rounded-lg">
                <ActivitySquare className="h-6 w-6 text-medical-500" />
              </div>
              <div>
                <h3 className="font-semibold text-medical-700 mb-1">Treatment Tracking</h3>
                <p className="text-medical-600">Monitor your progress and medical history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-white relative overflow-hidden min-h-screen lg:min-h-0">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
            alt="Technology Background"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <Card className="w-full max-w-md p-8 space-y-6 relative z-10 bg-white/90 backdrop-blur-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h2>
            <p className="text-gray-500">Enter your details to get started</p>
          </div>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium text-gray-700">
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-medical-500 hover:bg-medical-600 text-white">
              <UserPlus className="mr-2 h-4 w-4" /> Create Account
            </Button>
          </form>
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-medical-600 hover:text-medical-700 text-sm transition-colors"
            >
              Already have an account? Log in
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
