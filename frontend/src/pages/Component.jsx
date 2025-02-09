import React from "react";
import { ToastContainer } from "react-toastify";
import { Navbar } from "./chat/Navbar";
import { Footer } from "./chat/Footer";
import { Homepage } from "./Homepage";

export const Component = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
     <Homepage />

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
