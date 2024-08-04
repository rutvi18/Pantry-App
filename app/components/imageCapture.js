import { useState, useRef } from "react";
import React from "react";
import { Modal, Button, Typography, Box, Stack } from "@mui/material";
import CameraIcon from "@mui/icons-material/Camera";
import { Camera } from "react-camera-pro";
// import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firbase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  gap: 3,
  display: "flex",
  flexDirection: "column",
};

const ImageCapture = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    
  };


  const camera = useRef(null);

  const captureAndUploadImage = async () => {
    console.log("Entered capture");
    if (camera.current) {
      const imageSrc = camera.current.takePhoto();

      // Convert base64 image to a Blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // Upload the image to Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File available at", downloadURL);
    }
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Click image
          </Typography>
          <Stack width="100%" direction={"column"} spacing={2}>
            <Box>
              <Camera
                ref={camera}
                aspectRatio={16 / 9}
                facingMode="environment"
              />
            </Box>

            <Button
              variant="outlined"
              className="inline-flex"
              onClick={() => {
                handleClose();
                captureAndUploadImage();
              }}
            >
              Click
            </Button>
          </Stack>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>

          {/* <Button variant="contained">Click</Button> */}
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        startIcon={<CameraIcon />}
        style={{ marginRight: 5 }}
      >
        Click Image
      </Button>
    </>
  );
};

export default ImageCapture;
