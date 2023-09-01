/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, Typography } from "@mui/material";
import { getAdminData, loginAdmin } from "../api/adminApi";
import websiteLogo from "../assets/app_icon.png";
import bgImage from "../assets/login_bg.jpg";
import { AuthContext } from "../context/AuthContext";
import { IAdmin } from "shared-types/types";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email == "" ||
      password == "" ||
      email.includes(" ") ||
      password.includes(" ")
    ) {
      setError("Please enter username and password");
      return;
    }
    try {
      await loginAdmin(email, password);
      const data = (await getAdminData()) as IAdmin;
      sessionStorage.setItem("userEmail", data.email);
      sessionStorage.setItem("userName", data.name);
      setUser(data);
      navigate("/admin/student_database");
    } catch (error: any) {
      console.error("Error logging in:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "Are you sure you want to leave this page ?";
    };

    const handlePopState = () => {
      navigate("/login");
    };

    window.onbeforeunload = handleBeforeUnload;
    window.onpopstate = handlePopState;

    return () => {
      window.onbeforeunload = null;
      window.onpopstate = null;
    };
  }, [navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black w-screen h-20">
        <div className="h-full w-max">
          <img
            src={websiteLogo}
            alt="website logo"
            className="object-contain w-full h-full"
          />
        </div>
      </div>
      <CssBaseline />
      <div className="w-2/5 h-max text-center bg-neutral-100 rounded-md p-6 mx-auto my-40 bg-opacity-50 backdrop-blur-0">
        <h1 className="text-left">Admin</h1>
        <input
          required
          placeholder="Email Address"
          onChange={(e: any) => setEmail(e.target.value)}
          name="email"
          className="rounded-md px-2 py-1 block my-2 w-full"
          autoComplete="email"
          autoFocus
        />
        <input
          required
          name="password"
          placeholder="Password"
          type="password"
          className="rounded-md px-2 py-1 block my-2 w-full"
          onChange={(e: any) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {/* <FormControlLabel
          control={
            <Checkbox
              value="remember"
              color="primary"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
          }
          label="Remember me"
        /> */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          // onClick={handleLogin}
          onClick={() => handleLogin}
          sx={{
            backgroundColor: "#E85969",
            width: "80%",
          }}
        >
          Login
        </Button>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
      </div>
    </Box>
  );
};

export default Login;
