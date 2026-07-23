import { signOut } from "firebase/auth";
import { db, authService } from "../firebase";
import { Typography, Button, Divider, List, Box } from "@mui/material";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, onSnapshot, where } from "firebase/firestore";
import Comment from "../components/Comment";
import EditProfile from "./EditProfile";

function Profile() {
  const [comments, setComments] = useState([]);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const auth = authService;
  const userId = auth.currentUser.uid;
  const navigate = useNavigate();

  const getComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("uid", "==", userId),
      orderBy("date", "desc"),
    );

    onSnapshot(q, querySnapshot => {
      const commentsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsArray);
    });
  };

  useEffect(() => {
    getComments();
  }, []);
  const onLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
      })
      .catch(error => {
        // An error happened.
      });
  };
  console.log(comments);
  return (
    <>
      <h2>Profile</h2>
      <div className="profile">
        <img src="/profile_icon.png" alt="기본 프로필" />
      </div>
      {profileEditMode ? (
        <EditProfile setProfileEditMode={setProfileEditMode} />
      ) : (
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            type="button"
            sx={{ mt: 2 }}
            onClick={() => {
              setProfileEditMode(true);
            }}
          >
            프로필 이미지 변경
          </Button>
        </Box>
      )}
      <Divider sx={{ mt: 2 }} />
      <Button variant="contained" type="button" sx={{ mt: 2 }} onClick={onLogout}>
        로그아웃
      </Button>
      <Divider sx={{ my: 3 }} />

      <List sx={{ width: "100%" }}>
        {comments.map(item => (
          <Comment item={item} key={item.id} isShown={true} />
        ))}
      </List>
    </>
  );
}

export default Profile;
