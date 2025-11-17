import Home from "./pages/Home";
import AboutHall from "./pages/AboutHall";
import Contact from "./pages/Contact";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <AboutHall /> },
  { path: "/contact", element: <Contact /> },


  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },
];