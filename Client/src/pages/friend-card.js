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
} from "@mui/material";
import axios from "axios";
import { SERVERURL } from "src/utils/serverurl";
import { useUser } from "src/hooks/use-mocked-user";
import { useEffect, useState } from "react";

export const FriendCard = ({ user }) => {
    if(user == null) return (<></>);
  const myuser = useUser();
  const [friendValid, setValid] = useState(true);

  const handleDelete = async () => {
    await axios.get(`${SERVERURL}/Friends/delete`, {
      params: { uid: myuser.uid, friendId: user.uid },
    });
    setValid(false);
  };

  const [prevCourses, setPrevCourses] = useState([]);

  const previouslyTakenTogether = async () => {
    const prevTaken = await axios.get(`${SERVERURL}/Friends/prevTogether`, {
        params: { uid: myuser.uid, friendId: user.uid },
      });
    setPrevCourses(prevTaken);
  }

  useEffect(() => {
    previouslyTakenTogether();
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
            Previously Taken Together: {prevCourses}
          </Typography>
          <Typography align="left" variant="body1">
            Currently Taking Together: {}
          </Typography>
          {
            <>
              <Button
                sx={{ marginTop: "10px", marginLeft: "0px" }}
                color="error"
                variant="contained"
                onClick={handleDelete}
              >
                X
              </Button>
            </>
          }
        </CardContent>
      </Card>
    )
  );
};
