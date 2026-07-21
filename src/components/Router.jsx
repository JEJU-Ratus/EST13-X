import Home from "../routes/Home";
import Auth from "../routes/Auth";
import { Route, Routes } from "react-router";
import Nav from "./Nav";
import Profile from "../routes/Profile";
export default function Router({ isLoggedIn, userId }) {
  return (
    <>
      {isLoggedIn && <Nav />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userId={userId} />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </>
  );
}
