import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { useLocation } from 'react-router-dom'

const MainLayout = () => {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div style={{ position: 'relative' }}>
      <Navbar transparent={isHome} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
