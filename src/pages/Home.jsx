import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider"; // Update the import path

const Home = () => {
  const { User } = useAuth();
  
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-2">
      <h1>Wordpress Headless React JS Site</h1>
      {/* Conditional Rendering */}
      {User ? (
        <>
          <p>Welcome back, {User.display_name || User.user_login || "User"}!</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </>
      ) : (
        <>
          <p>You are not logged in. Please log in to continue.</p>
          <Link to="/login">
            <Button>Login Page</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;
