import { ClickAwayListener, IconButton } from "@mui/material";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { AppRoutesType } from "./routes";
import { AuthContext } from "../context/AuthContext";
import React from "react";

interface SidebarProps {
  items: AppRoutesType[];
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ items, sidebar, setSidebar }: SidebarProps) {
  const currentPage = useLocation();
  const { setIsLoggedIn } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebar((prevState) => !prevState);
  };

  return (
    <ClickAwayListener onClickAway={() => setSidebar(false)}>
      <>
        {sidebar ? ( // Check if the sidebar prop is true
          <aside className="bg-neutral-800 pt-2 h-screen w-max block my-auto ">
            <div className="flex gap-4 justify-end w-80 items-center px-2">
              <IconButton
                onClick={toggleSidebar}
                aria-label="Close"
                className="text-white"
              >
                <MenuIcon fontSize="large" className="text-white" />
              </IconButton>
            </div>
            <p className="px-6 py-2 text-2xl font-bold text-white">
              WELCOME BACK {localStorage.getItem("userName")}
            </p>
            <div className="p-4 py-6 gap-4 items-center">
              {items.map((page) => (
                <>
                  <Link
                    to={page.path}
                    className={`block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
                      currentPage.pathname === page.path
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`}
                  >
                    <div className="font-normal text-gray-900 rounded-lg dark:text-white">
                      <span className="text-lg">{page.displayText}</span>
                    </div>
                  </Link>
                  {page.children?.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`indent-10 text-white my-2 text-lg block ${
                        currentPage.pathname == child.path
                          ? "bg-gray-100 dark:bg-gray-700"
                          : " "
                      }`}
                    >
                      {child.displayText}
                    </Link>
                  ))}
                </>
              ))}
              <button
                className="w-full text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-white py-4 p-2 text-lg"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </aside>
        ) : null}{" "}
      </>
    </ClickAwayListener>
  );
}
