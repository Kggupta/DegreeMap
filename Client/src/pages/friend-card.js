import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Select,
  MenuItem,
  Stack,
  Typography,
  SvgIcon,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import axios from "axios";
import { SERVERURL } from "src/utils/serverurl";
import { useUser } from "src/hooks/use-mocked-user";
import { useEffect, useState } from "react";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

export const FriendCard = ({ user, isSuggested, onAddFriend, onRemoveFriend }) => {
  if (user === null) return <></>;
  const myuser = useUser();

  const [friendValid, setValid] = useState(true);
  const [prevCourses, setPrevCourses] = useState([]);
  const [currCourses, setCurrCourses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    console.log("DELETING FRIEND");
    await axios.get(`${SERVERURL}/Friends/remove`, {
      params: { uid: myuser.uid, friendId: user.uid },
    });
    setValid(false);
    onRemoveFriend(user.uid);
  };

  const handleAdd = () => {
    if (isSuggested) {
      onAddFriend(user.email);
      setValid(false);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    onRemoveFriend(user.uid);
    handleCloseDialog();
  };

  const previouslyTakenTogether = async () => {
    const prevTaken = await axios
      .get(`${SERVERURL}/Friends/prevTogether`, {
        params: { uid: myuser.uid, friendId: user.uid },
      })
      .then((response) => {
        console.log(response.data);
        setPrevCourses(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        setPrevCourses([]);
      });
    console.log(prevTaken);
  };

  const currentlyTakingTogether = async () => {
    const currTaken = await axios
      .get(`${SERVERURL}/Friends/currTogether`, {
        params: { uid: myuser.uid, friendId: user.uid },
      })
      .then((response) => {
        console.log(response.data);
        setCurrCourses(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        setCurrCourses([]);
      });
    console.log(currTaken);
  };

  useEffect(() => {
    previouslyTakenTogether();
    currentlyTakingTogether();
  }, []);

  return (
    friendValid && (
      <Card
        sx={{
          width: "50%",
        }}
      >
        <CardContent>
          <Typography align="left" gutterBottom variant="h5">
            {user.name}
          </Typography>
          <Typography align="left" variant="body1">
            {user.email}
          </Typography>
          <Typography align="left" variant="body1">
            Previously Taken Together:{" "}
            {prevCourses.length > 0
              ? prevCourses.map((course) => `${course.subject} ${course.course_number}`).join(", ")
              : "N/A"}
          </Typography>
          <Typography align="left" variant="body1">
            Currently Taking Together:{" "}
            {currCourses.length > 0
              ? currCourses.map((course) => `${course.subject} ${course.course_number}`).join(", ")
              : "N/A"}
          </Typography>
          {isSuggested ? (
            <>
              <Button
                sx={{ marginTop: "10px", marginLeft: "0px" }}
                color="success"
                variant="contained"
                onClick={handleAdd}
              >
                <SvgIcon fontSize="small">
                  <PlusIcon />
                </SvgIcon>
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={{ marginTop: "10px", marginLeft: "0px" }}
                color="error"
                variant="contained"
                onClick={handleOpenDialog}
              >
                <SvgIcon fontSize="small">
                  <XCircleIcon />
                </SvgIcon>
              </Button>
              <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to remove this friend?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    )
  );
};
