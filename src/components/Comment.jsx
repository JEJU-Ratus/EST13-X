import { ListItem, ListItemText, Button, Stack, Box, TextField } from "@mui/material";
import { db, storageService } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { ref, deleteObject } from "firebase/storage";

export default function Comment({ item, isShown }) {
  const [edit, setEdit] = useState(false);
  const [comment, setComment] = useState(item.comment);
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteDoc(doc(db, "comments", item.id));
      if (item.image) {
        const storage = storageService;
        const desertRef = ref(storage, item.image);
        await deleteObject(desertRef);
      }
    } catch (e) {
      console.log("삭제 오류", e);
      alert("삭제중 오류가 발생했습니다.");
    }
  };
  const toggleEditMode = () => {
    setEdit(prev => !prev);
  };
  const onSubmit = async e => {
    e.preventDefault();
    const commentRef = doc(db, "comments", item.id);

    await updateDoc(commentRef, {
      comment,
    });
    setEdit(false);
  };
  const handleChange = e => {
    setComment(e.target.value);
  };
  return (
    <ListItem alignItems="flex-center" divider>
      {edit ? (
        <Box component="form" onSubmit={onSubmit}>
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
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button variant="contained" size="small" type="submit">
              글쓰기
            </Button>
            <Button variant="outlined" size="small" onClick={toggleEditMode}>
              취소
            </Button>
          </Stack>
        </Box>
      ) : (
        <>
          <ListItemText
            primary={item.comment} // 제목
            secondary={item.date?.toDate() ? item.date.toDate().toLocaleString() : "작성시간 없음"} // 출력할 내용
          />
          {item.image && (
            <Box sx={{ mr: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={item.image}
                alt="미리보기"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  borderRadius: 3,
                }}
              ></Box>
            </Box>
          )}
          {isShown && (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={toggleEditMode}>
                수정
              </Button>
              <Button variant="contained" color="error" size="small" onClick={handleDelete}>
                삭제
              </Button>
            </Stack>
          )}
        </>
      )}
    </ListItem>
  );
}
