
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SurveyForm from "./pages/SurveyForm";
import SurveyReports from "./pages/reports/ResurveyReports";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import SurveyorLayout from "./layouts/SurveyorLayout";
import SurveyDashboard from "./pages/SurveyDashboard";
import DistrictReport from "./pages/reports/DistrictReports";
import Chitha from "./pages/Chitha";


function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/resurvey">
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
                  <Route path="/survey-reports" element={<SurveyReports />} />
                  <Route path="/survey-dashboard" element={<SurveyDashboard />} />
                  <Route path="/district-report/:dist_code" element={<DistrictReport />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
              <Route path="/chitha-view" element={<Chitha />} />
            </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
