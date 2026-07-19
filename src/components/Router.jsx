import Home from "../routes/Home";
import Auth from "../routes/Auth";
import { useState } from "react";
import { Route, Routes } from "react-router";
export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Routes>
        {isLoggedIn ? <Route path="/" element={<Home />} /> : <Route path="/" element={<Auth />} />}
      </Routes>
    </>
  );
}
