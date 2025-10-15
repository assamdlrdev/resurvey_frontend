
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
import COLayout from "./layouts/COLayout";
import MainDash from "./pages/MainDash";
import CODashboard from "./pages/co/CODashboard";
import CoSurveyReport from "./pages/co/SurveyReports";
import DeedDocument from "./pages/DeedDocument";
import LMDashboard from "./pages/lm/LMDashboard";


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
                  <Route path="/deedDoc" element={<DeedDocument />} />
                </Route>
              </Route>

              <Route element={<COLayout />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/co-dashboard" element={<CODashboard />} />
                  <Route path="/co-survey-reports" element={<CoSurveyReport />} />
                </Route>
              </Route>
              <Route element={<DashboardLayout />}>
                <Route path="/lm-dashboard" element={<LMDashboard />} />
              </Route>
              <Route path="*" element={<NotFound />} />
              <Route path="/chitha-view" element={<Chitha />} />
              <Route path="/dashboard" element={<MainDash />} />
            </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
