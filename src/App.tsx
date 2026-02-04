import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AssetTypes from "./pages/AssetTypes";
import FormBuilder from "./pages/studio/FormBuilder";
import EntityDesigner from "./pages/studio/EntityDesigner";
import RulesDesigner from "./pages/studio/RulesDesigner";
import PermissionsDesigner from "./pages/studio/PermissionsDesigner";
import DataSources from "./pages/DataSources";
import AuditLog from "./pages/AuditLog";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/asset-types" element={<AssetTypes />} />
            
            {/* Studio Routes */}
            <Route path="/studio/entities" element={<EntityDesigner />} />
            <Route path="/studio/forms" element={<FormBuilder />} />
            <Route path="/studio/rules" element={<RulesDesigner />} />
            <Route path="/studio/permissions" element={<PermissionsDesigner />} />
            
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
