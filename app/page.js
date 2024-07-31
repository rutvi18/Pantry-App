"use client";

import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { firestore } from "@/firbase";
import SearchIcon from "@mui/icons-material/Search";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";


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

export default function Home() {
  //value for containing the value from search
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pantry, setPantry] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("");

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    //check if exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }

    await updatePantry();
  };

  const handleSearch = async (item) => {
    item.preventDefault();
    setLoading(true);

    // Simulate a search API call
    setTimeout(async () => {
      await updatePantry();

      const itemNames = pantry.map((user) => user.name);
      const pantryResults = itemNames.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );

      setResults(pantryResults);
      setLoading(false);
    }, 1000);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };
  return (
    <>
      <Stack marginBottom={4}>
        <Typography
          id="modal-modal-title"
          variant="h3"
          component="h2"
          ml={2}
          mt={2}
        >
          Good Day!
        </Typography>
        <div
          style={{
            marginLeft: "20px",
            color: "grey",
            font: "Sans-serif",
          }}
        >
          Here's what's happening with your store today.
        </div>
      </Stack>
      <Box
        width="96vw"
        height="70vw"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        gap={3}
        sx={{
          ml: "10px",
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h3"
          component="h2"
          sx={{ paddingX: "20px", marginBottom: "10px" }}
        >
          Products
        </Typography>
        <Container className="search-container" maxWidth="sm">
          <form onSubmit={handleSearch}>
            <TextField
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              label="Search"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          {loading ? (
            <CircularProgress className="loading-spinner" />
          ) : (
            <List>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={result} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No Results found!" disableTypography/>
                </ListItem>
              )}
            </List>
          )}
        </Container>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={"row"} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />

              <Button
                variant="outlined"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                
                Add
              </Button>
            </Stack>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
            ></Typography>
          </Box>
        </Modal>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Add
        </Button>

        <Box border={"2px solid #333x"}>
          <Box
            width="800px"
            height="100px"
            bgcolor={"#ADD8E6"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
              Pantry Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
            {pantry.map(({ name, count }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                paddingX={5}
              >
                <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={"h3"} color={"#333"}>
                  Quantity: {count}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  startIcon={<DeleteIcon />}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
