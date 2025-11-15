import Home from "./pages/Home";
import AboutHall from "./pages/AboutHall";
import Contact from "./pages/Contact";
import SHPH from "./pages/halls/SHPH";
import B24H from "./pages/halls/B24H";
import SMAH from "./pages/halls/SMAH";
import ASH from "./pages/halls/ASH";
import BSCH from "./pages/halls/BSCH";
import FTZH from "./pages/halls/FTZH";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <AboutHall /> },
  { path: "/contact", element: <Contact /> },

  { path: "/halls/shph", element: <SHPH /> },
  { path: "/halls/b24h", element: <B24H /> },
  { path: "/halls/smah", element: <SMAH /> },
  { path: "/halls/ash", element: <ASH /> },
  { path: "/halls/bsch", element: <BSCH /> },
  { path: "/halls/ftzh", element: <FTZH /> },

  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },
];