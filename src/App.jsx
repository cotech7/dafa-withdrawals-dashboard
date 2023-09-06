import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user was previously logged in
    // const storedLoggedIn = sessionStorage.getItem("loggedIn");
    const storedSecretKey = sessionStorage.getItem("secretKey");
    if (storedSecretKey === import.meta.env.VITE_REACT_APP_SECRET_KEY) {
      setLoggedIn(true);
    } else {
      sessionStorage.removeItem("secretKey");
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    // Store the login state in localStorage
    // sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem(
      "secretKey",
      import.meta.env.VITE_REACT_APP_SECRET_KEY
    );

    // Set a session timeout here (e.g., 30 minutes)
    // setTimeout(() => {
    //   setLoggedIn(false);
    //   // Remove the login state from localStorage on timeout
    //   // sessionStorage.removeItem("loggedIn");
    //   sessionStorage.removeItem("secretKey");
    // }, 30 * 60 * 1000); // 30 minutes in milliseconds
  };

  const handleLogout = () => {
    setLoggedIn(false);
    // Remove the login state from localStorage on logout
    // sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("secretKey");
  };

  return (
    <div className="App">
      {loggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
