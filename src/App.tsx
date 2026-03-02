import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CRMLayout from "./layouts/CRMLayout";
import Index from "./pages/Index";
import Inbound from "./pages/Inbound";
import Eficacia from "./pages/Eficacia";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <CRMLayout>
                <Routes>
                  <Route path="/" element={<ProtectedRoute page="/"><Index /></ProtectedRoute>} />
                  <Route path="/inbound" element={<ProtectedRoute page="/inbound"><Inbound /></ProtectedRoute>} />
                  <Route path="/eficacia" element={<ProtectedRoute page="/eficacia"><Eficacia /></ProtectedRoute>} />
                  <Route path="/perfil" element={<ProtectedRoute page="/perfil"><Perfil /></ProtectedRoute>} />
                  <Route path="/configuracoes" element={<ProtectedRoute page="/perfil"><Configuracoes /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CRMLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
