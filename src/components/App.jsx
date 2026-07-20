import "./App.css";
import Router from "./Router";
import { useState } from "react";
import { authService } from "../firebase";
import { Container } from "@mui/material";

console.log(authService);
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Container>
        <h1>EST13-X</h1>
        <Router isLoggedIn={isLoggedIn} />
      </Container>
    </>
  );
}

export default App;
