import { useCallback, useEffect, useState } from 'react';
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
  Typography
} from '@mui/material';
import axios from 'axios';
import { SERVERURL } from 'src/utils/serverurl';
import { useUser } from 'src/hooks/use-mocked-user';
import { UserCard } from './user-card';



export const UserList = () => {

  const [users, setUsers] = useState(null);
	const getUsers = async () => {
		const apiUsers = await axios.get(`${SERVERURL}/User/list/`)
		setUsers(apiUsers.data);
	}
  useEffect(() => {
	getUsers();
  }, [])

  return (
    <div>
	{
		users && (<div>
		<Stack sx={{padding:'10px', flexDirection: 'row', flexWrap: 'wrap'}}>
		{
			users.map(user => (<UserCard user={user}/>))
		}
		</Stack>
		</div>)
	}
	{!users && <Typography justifyContent='center' variant="h5">
                Loading...
              </Typography>}
    </div>
  );
};
