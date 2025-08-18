
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Symptoms from "./pages/Symptoms";
import SurveyForm from "./pages/SurveyForm";
import DataDisplay from "./pages/DataDisplay";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import SurveyData from "./pages/SurveyForm";
import SurveyorLayout from "./layouts/SurveyorLayout";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <main className="flex-1 bg-medical-50">
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                {/* <Route path="/signup" element={<SignUp />} /> */}
              </Route>
              <Route element={<SurveyorLayout />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/survey-form" element={<SurveyForm />} />
                  <Route path="/survey-reports" element={<DataDisplay />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
