
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
import LMLayout from "./layouts/LMLayout";
import LMMutation from "./pages/lm/LMMutation";
import LMMutationCases from "./pages/lm/LMMutationCases";
import CoMutation from "./pages/co/CoMutation";
import CoMutDetails from "./pages/co/CoMutDetails";
import PartDagView from "./pages/reports/PartDagView";
import Report from "./pages/reports/Report";
import UserCreate from "./pages/usermanagement/UserCreate";
import UserList from "./pages/usermanagement/UserList";
import UserUpdate from "./pages/usermanagement/UserUpdate";
import AreaReport from "./pages/reports/AreaDiffReport";
import VillageMap from "./pages/VillageMap";
import LMStrikeout from "./pages/lm/LMStrikeout";
import LMStrikeoutCases from "./pages/lm/LMStrikeoutCases";
import COStrikeout from "./pages/co/COStrikeout";
import COStrikeoutDetails from "./pages/co/COStrikeoutDetails";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import ResurveyReports from "./pages/reports/ResurveyReports";

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
                  <Route path="/part-dag-view" element={<PartDagView />} />
                  <Route path="/deedDoc" element={<DeedDocument />} />
                  <Route path="/reports" element={<Report />} />
                  <Route path="/user-create" element={
                    <ProtectedRoute><UserCreate /></ProtectedRoute>
                  }/>
                  <Route path="/user-list" element={
                     <ProtectedRoute><UserList /></ProtectedRoute>
                    } />
                  <Route path="/user-update/:id" element={
                    <ProtectedRoute><UserUpdate /></ProtectedRoute>
                    } />
                  <Route path="/area-difference-report" element={<AreaReport />} />
                  <Route path="/village-map" element={<VillageMap />} />
                  <Route path="/my-reports" element={<ResurveyReports />} />
                </Route>
              </Route>

              <Route element={<COLayout />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/co-dashboard" element={<CODashboard />} />
                  <Route path="/co-survey-reports" element={<CoSurveyReport />} />
                  <Route path="/co-mutation" element={<CoMutation />} />
                  <Route path="/co-mut-details" element={<CoMutDetails />} />
                  <Route path="/co-strikeout" element={<COStrikeout />} />
                  <Route path="/co-strikeout-details" element={<COStrikeoutDetails />} />
                </Route>
              </Route>
              <Route element={<LMLayout />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/lm-dashboard" element={<LMDashboard />} />
                  <Route path="/lm-mutation" element={<LMMutation />} />
                  <Route path="/lm-mutation-cases" element={<LMMutationCases />} />
                  <Route path="/lm-strikeout" element={<LMStrikeout />} />
                  <Route path="/lm-strikeout-cases" element={<LMStrikeoutCases />} />
                  <Route path="/part-dag-view" element={<PartDagView />} />
                </Route>
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
