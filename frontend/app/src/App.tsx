
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import UploadForm from "./components/UploadForm";
import { AuthProvider } from "./hooks/useAuth";
import ProductDetail from './pages/ProductDetail';
import MyAccount from './pages/MyAccount';
import EditForm from "@/components/EditForm.tsx";
import DeveloperQuickStart from './pages/DeveloperQuickStart';
import ApiDocumentation from './pages/ApiDocumentation';
import UserGetStarted from './pages/UserGetStarted';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/edit-product/:id" element={<EditForm />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/developer-guide" element={<DeveloperQuickStart />} />
            <Route path="/api-documentation" element={<ApiDocumentation />} />
            <Route path="/api-docs" element={<ApiDocumentation />} />
            <Route path="/get-started" element={<UserGetStarted />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
