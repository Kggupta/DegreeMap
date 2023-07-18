import React from "react";
import { useEffect, useState } from "react";
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
import { FriendCard } from "./friend-card";

const Page = () => {
  const user = useUser();

  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([null]);
  const [suggestedFriends, setSuggestedFriends] = useState([null]);
  const [error, setError] = useState(null);

  const handleEmail = (event) => {
    setFriendEmail(event.target.value);
    console.log(event.target.value);
  };

  const getAllFriends = async () => {
    const data = await axios
      .get(`${SERVERURL}/Friends/list`, {
        params: { uid: user.uid },
      })
      .then((response) => {
        console.log("Response friends data:", response.data);
        console.log("FRIENDS: ", friends);
        setFriends(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log("ERROR: ", error);
        return error;
      });
  };

  const addFriend = async (email) => {
    console.log(friendEmail);
    const data = await axios
      .get(`${SERVERURL}/Friends/add`, {
        params: { friendsEmail: email, uid: user.uid, userEmail: user.email },
      })
      .then(async (response) => {
        console.log("Response ADD FIRNED data:", response.data);
        await Promise.all([
            getAllFriends(),
            setSuggestedFriends(suggestedFriends.filter((user) => user.email !== email))
        ]);
        setError(null);
      })
      .catch((error) => {
        setError(error);
        console.log(error);
      });
  };

  const suggestFriends = async () => {
    const data = await axios
      .get(`${SERVERURL}/Friends/suggested`, {
        params: { uid: user.uid },
      })
      .then((response) => {
        console.log("suggested friends: ", response.data);
        setSuggestedFriends(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(data);
  };

  const handleRemoveFriend = async (removedFriendId) => {
    setFriends(friends.filter((friend) => friend.uid !== removedFriendId));
    await getAllFriends();
    await suggestFriends();
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
            {error && (
              <Typography variant="h6" style={{ margin: "10px", color: "red" }}>
                {error.response.data}
              </Typography>
            )}
            <Button
              size="large"
              fullWidth
              sx={{ width: "95%", mt: 3, margin: "10px" }}
              variant="contained"
              onClick={() => addFriend(friendEmail)}
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
                {friends.map(
                  (user) =>
                    user && (
                      <FriendCard
                        key={user.uid}
                        user={user}
                        isSuggested={false}
                        onAddFriend={addFriend}
                        onRemoveFriend={handleRemoveFriend}
                      />
                    )
                )}
              </Stack>
            </div>
          )}
          {suggestedFriends && (
            <div>
              <Typography variant="h4">Suggested Friends</Typography>
              <Stack sx={{ padding: "10px", flexDirection: "row", flexWrap: "wrap" }}>
                {suggestedFriends.map(
                  (user) =>
                    user && (
                      <FriendCard
                        key={user.uid}
                        user={user}
                        isSuggested={true}
                        onAddFriend={addFriend}
                        onRemoveFriend={handleRemoveFriend}
                      />
                    )
                )}
              </Stack>
            </div>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
