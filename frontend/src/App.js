import "./App.css";
import { Signup } from "./pages/Signup";
import { Routes, Route } from "react-router-dom";
import { ResetPass } from "./pages/ResetPass";
import { UpdatePass } from "./pages/UpdatePass";
import { Adminpage } from "./pages/Adminpage";
import { AdminRoutes } from "./routes/AdminRoutes";
import { UserRoutes } from "./routes/UserRoutes";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import ChatPage from "./pages/chat/ChatPage";
import { Component } from "./pages/Component";
import { Login } from "./pages/Login";


function App() {

  return (
    <div className="routes">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetPassword" element={<ResetPass />} />
        <Route path="/updatePassword/:resetToken" element={<UpdatePass />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          {/* Admin Routes */}
          <Route element={<AdminRoutes />}>
            <Route path="/adminpage" element={<Adminpage />} />
          </Route>

          {/* User Routes */}
          <Route element={<UserRoutes />}>
            <Route path="/homepage" element={<Component />} />
            <Route path="/chatpage" element={<ChatPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
