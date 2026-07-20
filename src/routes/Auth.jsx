import { useState, useRef } from "react";
import { Box, Typography, TextField, Button, Divider, Snackbar } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { authService } from "../firebase";

function Auth() {
  const [newAccount, setNewAccount] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  const emailRef = useRef(null);
  const auth = authService;
  const provider = new GoogleAuthProvider();

  // 아이디 비밀번호 값 저장
  const handleChange = e => {
    const { name, value } = e.target;
    return setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = e => {
    e.preventDefault();
    if (newAccount) {
      // 회원가입
      createUserWithEmailAndPassword(auth, form.email, form.password)
        .then(userCredential => {
          // Signed up
          const user = userCredential.user;
          // ...
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setError(
            errorMessage.includes("email-already-in-use")
              ? "이미 이메일이 사용중입니다."
              : errorMessage,
          );
          setErrorOpen(true);
          setForm({ email: "", password: "" });
          emailRef.current.focus();
          // ..
        });
    } else {
      // 로그인
      signInWithEmailAndPassword(auth, form.email, form.password)
        .then(userCredential => {
          // Signed in
          const user = userCredential.user;
          // ...
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setError(errorMessage);
          setErrorOpen(true);
          setForm({ email: "", password: "" });
          emailRef.current.focus();
        });
    }
  };

  // google auth
  const onGoogleSingIn = () => {
    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
        // ...
      });
  };
  return (
    <>
      <Typography variant="h2" component="h2">
        {newAccount ? "회원가입 폼" : "로그인 폼"}
      </Typography>

      <Box component="form" sx={{ mt: 2 }} onSubmit={onSubmit}>
        <TextField
          fullWidth
          label="Email address"
          type="text"
          name="email"
          variant="outlined"
          onChange={handleChange}
          inputRef={emailRef}
          value={form.email}
        />
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="Password"
          type="password"
          name="password"
          variant="outlined"
          onChange={handleChange}
          value={form.value}
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          {newAccount ? "회원가입" : "로그인"}
        </Button>
        <Snackbar
          open={errorOpen}
          autoHideDuration={3000}
          message={error}
          onClose={() => setErrorOpen(true)}
        />
        <Divider sx={{ my: 3 }} />
        <Button variant="contained" type="button" sx={{ mt: 2 }} onClick={onGoogleSingIn}>
          {newAccount ? "구글로 회원가입" : "구글로 로그인"}
        </Button>
        <Divider sx={{ my: 3 }} />
        <Button
          variant="contained"
          type="button"
          sx={{ mt: 2 }}
          onClick={() => {
            setNewAccount(prev => !prev);
          }}
        >
          {newAccount ? "로그인으로 전환" : "회원가입으로 전환"}
        </Button>
      </Box>
    </>
  );
}

export default Auth;
