import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, TextField, Button } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { useUser } from 'src/hooks/use-mocked-user';
import { UserList } from 'src/sections/account/user-list';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { SERVERURL } from 'src/utils/serverurl';
import { ro } from 'date-fns/locale';

const searchColumns = [
	{
	  field: 'name',
	  headerName: "Name", width: 400,
	  
	},
	{ field: "grade", headerName: "Grade", width: 200 },
	{ field: "weight", headerName: "Weight", width: 200 },
  ];

const Page = () => {
  const user = useUser();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [number, setCourseNumber] = useState("");
  const [error, setError] = useState('');
  const [content, setContent] = useState([]);
  const [estimatedGrade, setEstimatedGrade] = useState(0);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [userTakingCourses, setUserTakingCourses] = useState([]);
  const [enterGrade, setGrade] = useState(0);
  const [enterWeight, setWeight] = useState(0);
	const [enterName, setName] = useState("");

  const populateTaking = async () => {
    const data = await axios.get(`${SERVERURL}/TakeCourse/grades`, {
		params: {uid: user.uid}
	});
    setUserTakingCourses(data.data);
  }

  useEffect(() => {
    populateTaking();
  }, [])
  const handleSubject = (e) => {
	setSelectedSubject(e.target.value.toUpperCase());
  };

  const handleSetCourseNumber = (e) => {
	setCourseNumber(e.target.value);
  };

  const handleGrade = (e) => {
	setGrade(e.target.value);
  }

  const handleWeight = (e) => {
	setWeight(e.target.value);
  }
  const handleName = (e) => {
	setName(e.target.value);
  }

  const handleGetContent = async () => {
	if (!userTakingCourses.some(row => row.subject == selectedSubject && row.course_number == number)) {
		setError('You are not taking this course or it is invalid.')
		return;
	}
	setError('');
	const data = await axios.get(`${SERVERURL}/GradedContent/course`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number}
	})
	setContent(data.data)
	const estimate = await axios.get(`${SERVERURL}/GradedContent/estimate`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number}
	})
	setEstimatedGrade(estimate.data[0][0].grade);
  };

  const handleInsertCourseContent = async () => {
	if (!userTakingCourses.some(row => row.subject == selectedSubject && row.course_number == number)) {
		setError('You are not taking this course or it is invalid.')
		return;
	}

	let totalCWeight = 0;
	const data = await axios.get(`${SERVERURL}/GradedContent/course`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number}
	})
	data.data.forEach(course => {totalCWeight += course.weight});
	if (totalCWeight + enterWeight > 100) {
		setError('The total weight of all content must be 100 or less.');
		return;
	}
	if (enterGrade < 0) {
		setError('Invalid Grade entered');
		return;
	}

	if (!enterName || data.data.some(content => content.name == enterName)) {
		setError('Invalid Name entered.');
		return;
	}
	setError('');
	await axios.get(`${SERVERURL}/GradedContent/insert`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number, name: enterName, grade: enterGrade, weight: enterWeight}
	}).catch(e => {setError(e.response.data);})
	const newData = await axios.get(`${SERVERURL}/GradedContent/course`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number}
	})
	setContent(newData.data);
	const estimate = await axios.get(`${SERVERURL}/GradedContent/estimate`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number}
	})
	setEstimatedGrade(estimate.data[0][0].grade);
  }

  const deleteCourseContent = async () => {
	await axios.get(`${SERVERURL}/GradedContent/delete`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number, name: rowSelectionModel[0]}
	})
	
	const newData = await axios.get(`${SERVERURL}/GradedContent/course`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number}
	})
	setContent(newData.data);
	const estimate = await axios.get(`${SERVERURL}/GradedContent/estimate`, {
		params: {uid: user.uid, subject: selectedSubject, course_number: number}
	})
	setEstimatedGrade(estimate.data[0][0].grade);
  }

  return (
  <>
    <Head>
      <title>
        GradedContent | DegreeMap
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
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Graded Content
            </Typography>
          </div>
	  	<div>
		<TextField
			style={{width: '10%', margin: '10px'}}
			value={selectedSubject}
			label="Subject"
			onChange={handleSubject}
		/>
		<TextField
			style={{width: '60%', margin: '10px'}}
			value={number}
			label="Course Number"
			onChange={handleSetCourseNumber}
		/>

		<Button
			size="large"
			sx={{ width: '20%', mt: 3, margin: '10px' }}
			variant="contained"
			onClick={handleGetContent}
		>
			Get Content
		</Button>
		<TextField
			style={{width: '10%', margin: '10px'}}
			value={enterGrade}
			label="Grade"
			type='number'
			onChange={handleGrade}
		/>
		<TextField
			style={{width: '10%', margin: '10px'}}
			value={enterWeight}
			label="Weight"
			type='number'
			onChange={handleWeight}
		/>
		<TextField
			style={{width: '30%', margin: '10px'}}
			value={enterName}
			label="Name"
			onChange={handleName}
		/>
		<Button
			sx={{width:'30%', margin:'10px'}}
			size="large"
			variant='contained'
			onClick={handleInsertCourseContent}
		>
			Insert Content
		</Button>
		{(rowSelectionModel.length > 0) && (
			<Button
				size="large"
				sx={{ width: '90%', mt: 3, margin: '10px' }}
				variant="contained"
				color='error'
				onClick={deleteCourseContent}
			>
			Delete
			</Button>
      )}
		{error && (
        <Typography style={{margin: '10px', color: 'red'}}>
        {error}
        </Typography>
      )}
		<Typography variant='h4'>
			Estimated Grade: {(estimatedGrade ? parseFloat(estimatedGrade) : 0).toFixed(2)}%
		</Typography>
		</div>
		<DataGrid
          rows={content}
		  getRowId={(row) => row.name}
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
        </Stack>
      </Container>
    </Box>
  </>
)};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
