import { TextField, Box, Typography, Button, Divider, List } from "@mui/material";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState, useRef } from "react";
import Comment from "../components/Comment";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function Home({ userId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
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
        uid: userId,
      });
      console.log("다음 글이 추가되었습니다.: ", docRef.id);
      setComment("");
      // getComments();
    } catch (e) {
      console.error("글 추가 시 에러가 발생했습니다.", e);
    }
  };
  const onFileChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      setAttachment(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  const onClearFile = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Button component="label" variant="outlined" type="button" startIcon={<UploadFileIcon />}>
            이미지 선택
            <input type="file" hidden accept="image/*" onChange={onFileChange} ref={fileInputRef} />
          </Button>
          {attachment && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={attachment}
                alt="미리보기"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  borderRadius: 3,
                }}
              ></Box>
              <Button variant="outlined" type="button" size="small" onClick={onClearFile}>
                파일 첨부 취소
              </Button>
            </Box>
          )}
        </Box>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          글쓰기
        </Button>
      </Box>
      <Divider sx={{ my: 3 }} />

      <List sx={{ width: "100%" }}>
        {comments.map(item => (
          <Comment item={item} key={item.id} isShown={userId === item.uid} />
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
