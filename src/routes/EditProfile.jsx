import { Box, Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function EditProfile({ setProfileEditMode }) {
  return (
    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
      <Button component="label" variant="outlined" type="button" startIcon={<UploadFileIcon />}>
        이미지 선택
        <input type="file" hidden accept="image/*" />
      </Button>
      <Button
        variant="contained"
        type="button"
        onClick={() => {
          setProfileEditMode(false);
        }}
      >
        취소
      </Button>
    </Box>
  );
}

export default EditProfile;
