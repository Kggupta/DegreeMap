import React from "react";
import {useEffect, useState } from 'react';
import { SERVERURL } from "src/utils/serverurl";
import axios from "axios";
import { useUser } from "src/hooks/use-mocked-user";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  TextField,
  Button,
} from "@mui/material";
import { UserCard } from "../sections/account/user-card";
import { FriendCard } from "./friend-card";


const Friends = () => {
  const user = useUser();

  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([null]);

  const handleEmail = (event) => {
    setFriendEmail(event.target.value);
    console.log(event.target.value);
  };

  const getAllFriends = async () => {
    const data = await axios.get(`${SERVERURL}/Friends/list`, {
      params: { uid: user.uid },
    })
    .then((response) => {    
        console.log('Response data:', response.data);
        setFriends(response.data);
        return response.data;
    })
    .catch((error) => {
        console.log('ERROR: ', error)
        return error;
    });
  };

  const addFriend = async () => {
    console.log(friendEmail);
    const data = await axios
      .get(`${SERVERURL}/Friends/add`, {
        params: { friendsEmail: friendEmail, uid: user.uid, userEmail: user.email },
      })
      .then((response) => {
        getAllFriends();
      })
      .catch((error) => {
        console.log(error);
      });
  };

    const suggestFriends = async () => {
    const data = await axios .get(`${SERVERURL}/Friends/suggested`, {
            params: { uid: user.uid },
        })
        .then((response) => {
            // console.log(response.data);
        })
        .catch((error) => {
            // console.log(error)
        });
    // console.log(data);
    };


  useEffect(() => {
    getAllFriends();
    suggestFriends();
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Friends</Typography>
          </div>
          <div>
            <TextField
              style={{ width: "95%", margin: "10px" }}
              value={friendEmail}
              label="Friend Email"
              onChange={handleEmail}
            />
            <Button
              size="large"
              fullWidth
              sx={{ width: "95%", mt: 3, margin: "10px" }}
              variant="contained"
              onClick={addFriend}
            >
              Add Friend
            </Button>
          </div>
          <div>
            <Typography variant="h4">Friend List</Typography>
          </div>
          {friends && (
            <div>
              <Stack sx={{ padding: "10px", flexDirection: "row", flexWrap: "wrap" }}>
                {friends.map((user) => (
                  <FriendCard user={user} />
                ))}
              </Stack>
            </div>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

Friends.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Friends;
