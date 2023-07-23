import Head from 'next/head';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { DataGrid } from '@mui/x-data-grid';
import { useUser } from 'src/hooks/use-mocked-user';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVERURL } from "src/utils/serverurl";

const searchColumns = [
	{
	  field: 'course',
	  headerName: "Course", width: 200,
	  valueGetter: (params => `${params.row.subject} ${params.row.course_number}`)
	},
	{ field: "name", headerName: "Name", width: 300 },
	{ field: "due_date", headerName: "Due Date", width: 300 },
  ];

const Page = () => {
	const user = useUser();
	const [selectedSubject, setSelectedSubject] = useState("");
	const [number, setCourseNumber] = useState("");
	const [error, setError] = useState('');
	const [content, setContent] = useState([]);
	const [rowSelectionModel, setRowSelectionModel] = useState([]);
	const [userTakingCourses, setUserTakingCourses] = useState([]);
	const [duedate, setDueDate] = useState(null);
	const [name, setName] = useState("");
	const populateTaking = async () => {
	  const data = await axios.get(`${SERVERURL}/TakeCourse/grades`, {
		  params: {uid: user.uid}
	  });
	  setUserTakingCourses(data.data);
	}

	const populateDeadlines = async () => {
		const data = await axios.get(`${SERVERURL}/Deadline/list`, {
			params: {uid: user.uid}
		});
		setContent(data.data);
	}
  
	useEffect(() => {
	  populateTaking();
	  populateDeadlines();
	}, [])
	const handleSubject = (e) => {
	  setSelectedSubject(e.target.value.toUpperCase());
	};
  
	const handleSetCourseNumber = (e) => {
	  setCourseNumber(e.target.value);
	};
	const handleInsertDeadline = async () => {
		if (!userTakingCourses.some(course => course.subject == selectedSubject && course.course_number == number)) {
			setError('Invalid Course provided.');
			return;
		}
		setError('');
		await axios.get(`${SERVERURL}/Deadline/add`, {
			params: {uid: user.uid, subject: selectedSubject, course_number: number, name: name, due_date: duedate}
		}).catch(error => {
			setError('Invalid Deadline Inputs.')}
			)
		populateDeadlines();
	}
	const deleteDeadline = async () => {
		const value = rowSelectionModel[0].split(' ');
		await axios.get(`${SERVERURL}/Deadline/remove`, {
			params: {uid: user.uid, subject: value[0], course_number: value[1], name: value[2]}
		})
		populateDeadlines();

	}

  return (<>
    <Head>
      <title>
        Deadlines | DegreeMap
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
          <Typography variant="h4">
            Deadlines
          </Typography>
		  
		  	<TextField
				style={{width: '10%', margin: '10px'}}
				value={selectedSubject}
				label="Subject"
				onChange={handleSubject}
			/>
			<TextField
				style={{width: '20%', margin: '10px'}}
				value={number}
				label="Course Number"
				onChange={handleSetCourseNumber}
			/>
			<TextField
				style={{width: '30%', margin: '10px'}}
				value={name}
				label="Deadline Name"
				onChange={(e) => setName(e.target.value)}
			/>
			<DatePicker
				style={{width: '30%', margin: '10px'}}
				label="Due Date"
				value={duedate}
				onChange={setDueDate}
				inputFormat='yyyy-mm-dd'
				renderInput={(params) => {
					return <TextField {...params}/>;
				}}
			/>
			{error && <Typography style={{margin: '10px', color: 'red'}}>
				{error}
			</Typography>}
			<Button
				sx={{width:'40%', margin:'10px'}}
				size="large"
				variant='contained'
				onClick={handleInsertDeadline}
			>
				Add Deadline
			</Button>
			{rowSelectionModel.length > 0 && (
				<Button
					size="large"
					sx={{ width: '40%', mt: 3, margin: '10px' }}
					variant="contained"
					color='error'
					onClick={deleteDeadline}
				>
				Delete
				</Button>
			)}
		<DataGrid
			rows={content}
			getRowId={(row) => `${row.subject} ${row.course_number} ${row.name}`}
			columns={searchColumns}
			initialState={{
			pagination: {
				paginationModel: { page: 0, pageSize: 25 },
			},
			}}
			pageSizeOptions={[25,50,100]}
			onRowSelectionModelChange={(newRowSelectionModel) => {
			setRowSelectionModel(newRowSelectionModel);
			}}
			rowSelectionModel={rowSelectionModel}
		/>

      </Container>
    </Box>
  </>)
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
