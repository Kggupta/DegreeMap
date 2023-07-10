import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, TextField, Button } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { useUser } from 'src/hooks/use-mocked-user';
import { UserList } from 'src/sections/account/user-list';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { SERVERURL } from 'src/utils/serverurl';
import axios from 'axios';
function convertBinaryToDays(binary) {
	// Convert the binary number to a 7-digit string
	const binaryString = binary.toString(2).padStart(7, '0');
  
	// Define an array of day names
	const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
  
	// Create an array to store the resulting days
	const result = [];
  
	// Iterate over each character in the binary string
	for (let i = 0; i < binaryString.length; i++) {
	  // Check if the bit is set to 1
	  if (binaryString[i] === '1') {
		// Add the corresponding day to the result array
		result.push(daysOfWeek[i]);
	  }
	}
  
	// Join the days in the result array into a single string
	return result.join('');
  }

const columns = [
	{ field: 'id', headerName: 'Course Code', width: 200, valueGetter: (params => `${params.row.subject} ${params.row.course_number} ${params.row.section}`) },
	{ field: 'name', headerName: 'Name', width: 300 },
	{ field: 'start_time', headerName: 'Start Time', width: 150 },
	{ field: 'end_time', headerName: 'End Time', width: 150},
	{ field: 'days', headerName: 'Days', width: 150, valueGetter: (params => convertBinaryToDays(params.row.days))},
	{field: 'professor_name', headerName: 'Professor', width: 300},
	{field: 'location', headerName: 'Location', width: 150, valueGetter: (params => (params.row.location_room && params.row.location_building) ? `${params.row.location_room}${params.row.location_building}` : 'None')}
  ];

const Page = () => {
  const user = useUser();

  const [attending, setAttending] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [courseNumber, setCourseNumber] = React.useState("")
  const [error, setError] = React.useState(null)
  const [rowSelectionModelUnAttend, setRowSelectionModelUnattend] = React.useState([]);

  const [rowSelectionModelAttend, setRowSelectionModelAttend] = React.useState([]);

  const populateSubjects = async () => {
    const data = await axios.get(`${SERVERURL}/Course/subjects`);
    setSubjects(data.data);
  }
  const populateAttending = async () => {
	const data = await axios.get(`${SERVERURL}/Section/attending`, {
		params: {uid: user.uid}
	})
	console.log(data.data);
	setAttending(data.data.map(course => {
		course.id = course.subject + ' ' + course.course_number + ' ' + course.section;
		return course;
	}));
  }

  React.useEffect(() => {
    populateSubjects();
	populateAttending();
  }, [])

  const handleSubject = (e) => {
	setSelectedSubject(e.target.value.toUpperCase());
  }

  const handleCourseNumber = (e) => {
	setCourseNumber(e.target.value.toUpperCase());
  }

  const handleSearchSubmit = async (e) => {
	if (!subjects.includes(selectedSubject)) {
		setError('Invalid Subject Given');
		return;
	}
	const data = await axios.get(`${SERVERURL}/Section/get`, {
		params: {subject: selectedSubject, course_number: courseNumber}
	});
	for (let i = 0; i < attending.length; i++) {
		const conflict = await axios.get(`${SERVERURL}/Section/conflicting`, {
			params: {subject: attending[i].subject, course_number: attending[i].course_number, section: attending[i].section}
		})
		data.data = data.data.filter(course => {
			return !conflict.data.some(conflictingCourse => conflictingCourse.subject == course.subject && conflictingCourse.course_number == course.course_number && conflictingCourse.section == course.section)
		})
	}
	data.data.filter

	setCourses(data.data.map(course => {
		course.id = course.subject + ' ' + course.course_number + ' ' + course.section;
		return course;
	}));
  }

  const handleAttend = async (e) => {
	const searching = {uid: user.uid, section: rowSelectionModelAttend[0].split(' ')[2], subject:rowSelectionModelAttend[0].split(' ')[0], course_number: rowSelectionModelAttend[0].split(' ')[1]};
	await axios.get(`${SERVERURL}/Section/attend/`, {
		params: searching
	})
	const value = courses.find(course => course.subject == searching.subject && course.course_number == searching.course_number && course.section == searching.section);
	setCourses(courses.filter(course => !(course.subject == searching.subject && course.course_number == searching.course_number && course.section == searching.section)));
	setAttending([... attending, value]);
  }
  const handleUnattend = async (e) => {
	const searching = {uid: user.uid, section: rowSelectionModelUnAttend[0].split(' ')[2], subject:rowSelectionModelUnAttend[0].split(' ')[0], course_number: rowSelectionModelUnAttend[0].split(' ')[1]};
	await axios.get(`${SERVERURL}/Section/unattend/`, {
		params: searching
	})
	setAttending(attending.filter(course => !(course.subject == searching.subject && course.course_number == searching.course_number && course.section == searching.section)));
  }

  return (
  <>
	<div style={{width:'100%'}}>
      <TextField
              style={{width: '10%', margin: '10px'}}

        value={selectedSubject}
        label="Subject"
        onChange={handleSubject}
      />
      <TextField
        style={{width: '60%', margin: '10px'}}
        value={courseNumber}
        label="Course Number"
        onChange={handleCourseNumber}
      />
      
      {error && (
        <Typography style={{margin: '10px', color: 'red'}}>
        {error}
        </Typography>
      )}
      {(rowSelectionModelAttend.length == 0 && rowSelectionModelUnAttend == 0) && (
        <Button
        size="large"
        fullWidth
        sx={{ width: '95%', mt: 3, margin: '10px' }}
        variant="contained"
        onClick={handleSearchSubmit}
      >
        Search Sections
      </Button>
      )}
      {(rowSelectionModelAttend.length > 0) && (
        <>
        <Button
        size="large"
        sx={{ width: '45%', mt: 3, margin: '10px' }}
        variant="contained"
        onClick={handleSearchSubmit}
      >
        Search Sections
      </Button>
        <Button
        size="large"
        sx={{ width: '45%', mt: 3, margin: '10px' }}
        variant="contained"
        onClick={handleAttend}
      >
        Attend
      </Button>
      </>
      )}
	  {(rowSelectionModelUnAttend.length > 0) && (
        <>
        <Button
        size="large"
        sx={{ width: '45%', mt: 3, margin: '10px' }}
        variant="contained"
        onClick={handleSearchSubmit}
      >
        Search Sections
      </Button>
        <Button
        size="large"
        color="error"
        sx={{ width: '45%', mt: 3, margin: '10px' }}
        variant="contained"
        onClick={handleUnattend}
      >
        Un-Attend
      </Button>
      </>
      )}
      </div>
      <div style={{ height: '90%', width: '100%' }}>
        <DataGrid
          rows={courses}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25,50,100]}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModelAttend(newRowSelectionModel);
			setRowSelectionModelUnattend([]);
          }}
          rowSelectionModel={rowSelectionModelAttend}
        />
      </div>
	  <Typography variant="h4">
        Attending Sections
	  </Typography>
      <div style={{ height: '90%', width: '100%' }}>
        <DataGrid
          rows={attending}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25,50,100]}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModelUnattend(newRowSelectionModel);
			setRowSelectionModelAttend([]);
          }}
          rowSelectionModel={rowSelectionModelUnAttend}
        />
      </div>
  </>
)};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
