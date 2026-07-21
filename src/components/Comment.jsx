import { ListItem, ListItemText, Button, Stack } from "@mui/material";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function Comment({ item, isShown }) {
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    await deleteDoc(doc(db, "comments", item.id));
  };
  return (
    <ListItem alignItems="flex-center" divider>
      <ListItemText
        primary={item.comment} // 제목
        secondary={item.date?.toDate() ? item.date.toDate().toLocaleString() : "작성시간 없음"} // 출력할 내용
      />
      {isShown && (
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small">
            수정
          </Button>
          <Button variant="contained" color="error" size="small" onClick={handleDelete}>
            삭제
          </Button>
        </Stack>
      )}
    </ListItem>
  );
}
