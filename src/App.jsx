import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <div className="app-content">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
