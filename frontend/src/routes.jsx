import Home from "./pages/public/Home";
import AboutHall from "./pages/public/AboutHall";
import Contact from "./pages/public/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentMeal from "./pages/student/StudentMeal";
import CanteenManagerDashboard from "./pages/canteen/CanteenManagerDashboard";
import Complaint from "./pages/student/Complaint";
import Notification from "./pages/student/Notification";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import HallInfo from "./pages/hall/HallInfo";
import Profile from "./pages/student/Profile";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <AboutHall /> },
  { path: "/contact", element: <Contact /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { 
    path: "/admin", 
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ) 
  },
  {
    path: "/admin-complaints",
    element: (
      <ProtectedRoute>
        <AdminComplaints />
      </ProtectedRoute>
    ),
  },
  {
    path: "/submit-complaint",
    element: (
      <ProtectedRoute>
        <SubmitComplaint />
      </ProtectedRoute>
    ),
  },
  { 
    path: "/dashboard", 
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ) 
  },
  {
  path: "/meals",
  element: (
    <ProtectedRoute>
      <StudentMeal />
    </ProtectedRoute>
  )
},
  { 
    path: "/complaints", 
    element: (
      <ProtectedRoute>
        <Complaint />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/notification", 
    element: (
      <ProtectedRoute>
        <Notification />
      </ProtectedRoute>
    ) 
  },
  {
    path: "/hall-info",
    element: (
      <ProtectedRoute>
        <HallInfo />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
  path: "/canteen-dashboard",
  element: (
    <ProtectedRoute allowedRoles={["CANTEEN_MANAGER"]}>
      <CanteenManagerDashboard />
    </ProtectedRoute>
  )
}
];