import { ThemeProvider } from 'styled-components';
import { Toaster as HotToaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyles, theme } from './styles/GlobalStyles';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { PartnersPage } from './pages/PartnersPage';
import { PartnerDetailsPage } from './pages/PartnerDetailsPage';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <HotToaster position="top-right" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
        <Route path="/partners" element={<ProtectedRoute><PartnersPage /></ProtectedRoute>} />
        <Route path="/partners/:partnerId" element={<ProtectedRoute><PartnerDetailsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
