import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout"
import Dashboard from "./pages/Dashboard";
import PurchasePlan from "./pages/PurchasePlan";
import DepositeBalance from "./pages/DepositeBalance";
import Page404 from "./pages/Page404";
import Checkout from "./pages/Checkout";
import ProxyComponent from "./pages/ProxyPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PurchasePlan />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="deposit-balance" element={<DepositeBalance />} />
          <Route path="*" element= {<Page404/>}/>
          <Route path="checkout" element={<Checkout />} />
          <Route path="proxy-page" element={<ProxyComponent/>} />
        </Route>
      </Routes>
    </Router>
  );
}
