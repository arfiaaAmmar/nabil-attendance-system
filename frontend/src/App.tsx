import "tailwindcss/tailwind.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import React, { useEffect, useState } from "react";
import { adminRoutes } from "./components/routes";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AttendanceSystem from "./pages/AttendanceSystem";
import Sidebar from "./components/Sidebar";
import StudentDatabase from "./pages/StudentDatabase";
import ClassSession from "./pages/ClassSession";
import ClassRecords from "./pages/ClassRecord";

function App(): JSX.Element {
  const [sidebar, setSidebar] = useState(true);
  // const userRole = localStorage.getItem("userSession");
  const userRole = true
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole) {
      navigate("/login");
    }
    if (userRole) {
      navigate("/admin/student_database");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <>
        <Route
          path="/admin/*"
          element={<AdminRoutes sidebar={sidebar} setSidebar={setSidebar} />}
        />
      </>
    </Routes>
  );
}

interface AdminRoutesProps {
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
function AdminRoutes({ sidebar, setSidebar }: AdminRoutesProps): JSX.Element {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case "/admin/student_database":
        return <StudentDatabase />;
      case "/admin/attendance_system":
        return <AttendanceSystem />;
      case "/admin/attendance_system/class_session":
        return <ClassSession />;
      case "/admin/attendance_system/class_history":
        return <ClassRecords />;
      default:
        return <div>Invalid page</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar items={adminRoutes} sidebar={sidebar} setSidebar={setSidebar} />
      <IconButton
        className={`absolute top-0 left-0 ${sidebar ? "hidden" : "visible"}`}
        onClick={() => setSidebar(true)}
      >
        <MenuIcon fontSize="large" className="text-black" />
      </IconButton>
      <div className="h-screen w-full overflow-auto">
        <main className="flex-grow">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
