import {
  TextField,
  Box,
  Typography,
  Button,
  Divider,
  ListItem,
  List,
  ListItemText,
} from "@mui/material";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

function Home() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // useEffect로 데이터 조회 결과를 comments 에 할당.

  const getComments = async () => {
    const q = query(collection(db, "comments"), orderBy("date", "desc"), limit(5));

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
  console.log(comments);
  const handleChange = e => {
    setComment(e.target.value);
  };
  const onSubmit = async e => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment,
        date: serverTimestamp(),
      });
      console.log("다음 글이 추가되었습니다.: ", docRef.id);
      setComment("");
      // getComments();
    } catch (e) {
      console.error("글 추가 시 에러가 발생했습니다.", e);
    }
  };
  return (
    <>
      <Typography variant="h2" component="h2">
        Home
      </Typography>
      <Box component="form" sx={{ mt: 2 }} onSubmit={onSubmit}>
        <TextField
          fullWidth
          label="comment"
          placeholder="글을 입력해주세요"
          type="text"
          name="comment"
          variant="outlined"
          multiline
          rows={5}
          onChange={handleChange}
          value={comment}
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          글쓰기
        </Button>
      </Box>
      <Divider sx={{ my: 3 }} />

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {comments.map(item => (
          <ListItem alignItems="flex-start" key={item.id} divider>
            <ListItemText
              primary={item.comment} // 제목
              secondary={
                item.date?.toDate() ? item.date.toDate().toLocaleString() : "작성시간 없음"
              } // 출력할 내용
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Home;

/*

    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary="Brunch this weekend?" // 제목
          secondary="" // 출력할 내용
            
        />
      </ListItem>
      <Divider variant="inset" component="li" />
  </List>

*/
