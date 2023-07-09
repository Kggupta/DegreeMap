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
  Typography,
  SvgIcon,
  Chip
} from '@mui/material';
import axios from 'axios';
import { SERVERURL } from 'src/utils/serverurl';
import { useUser } from 'src/hooks/use-mocked-user';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import Icon from '@material-ui/core/Icon';
import { handleClientScriptLoad } from 'next/script';



export const UserCard = ({user}) => {
	const myuser = useUser();
	const [userAdmin, setUserAdmin] = useState(user.is_admin); 
	const [userValid, setValid] = useState(true);
	const handleDelete = async () => {
		await axios.get(`${SERVERURL}/User/delete`, {
			params: {uid: user.uid}
		})
		setValid(false);
	}
	const handlePromote = async () => {
		await axios.get(`${SERVERURL}/User/admin`, {
			params: {uid: user.uid, source: myuser.uid}
		})
		setUserAdmin(1);
	}
  return userValid && (
		<Card
      	sx={{
        	width: '50%'
      	}}
    	>
      <CardContent>
        <Typography
          align="left"
          gutterBottom
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          align="left"
          variant="body1"
        >
          {user.email}
        </Typography>
		{!userAdmin && (
			<>
		<Button
			sx={{margin: '10px'}}
			color='error'
			variant="contained"
			onClick={handleDelete}
		>
			Delete
		</Button>
		<Button
			variant="contained"
			onClick={handlePromote}
		>
			Promote
		</Button>
		</>
		)}
		{
			userAdmin == 1 && (
				<Chip sx={{margin:"10px"}} color="primary" label="Administrator">Administrator</Chip>
			)
		}
      </CardContent>

    </Card>
	)}
  ;
