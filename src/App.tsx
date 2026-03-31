import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ToastStack from "./components/Toast/Toast";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import AllTrips from "./pages/AllTrips/AllTrips";
import TripDetail from "./pages/TripDetail/TripDetail";
import About from "./pages/About/About";
import Interests from "./pages/Interests/Interests";
import Profile from "./pages/Profile/Profile";
import Stats from "./pages/Stats/Stats";
import MapView from "./pages/MapView/MapView";
import PublicLayout from "./pages/PublicLayout/PublicLayout";
import PublicHome from "./pages/PublicHome/PublicHome";
import PublicAllTrips from "./pages/PublicAllTrips/PublicAllTrips";
import PublicMapView from "./pages/PublicMapView/PublicMapView";
import PublicStats from "./pages/PublicStats/PublicStats";
import PublicAbout from "./pages/PublicAbout/PublicAbout";
import PublicInterests from "./pages/PublicInterests/PublicInterests";
import PublicTripDetail from "./pages/PublicTripDetail/PublicTripDetail";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const pageTransition = {
  duration: 0.28,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ minHeight: "100dvh" }}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/u/:username" element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="trips" element={<PublicAllTrips />} />
            <Route path="map" element={<PublicMapView />} />
            <Route path="stats" element={<PublicStats />} />
            <Route path="about" element={<PublicAbout />} />
            <Route path="interests" element={<PublicInterests />} />
            <Route path="trip/:tripId" element={<PublicTripDetail />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<AllTrips />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/interests" element={<Interests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/map" element={<MapView />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AnimatedRoutes />
            <ToastStack />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
