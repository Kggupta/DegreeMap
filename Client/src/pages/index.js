import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Button, Checkbox, FormControlLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { SERVERURL } from 'src/utils/serverurl';
import axios from 'axios';
import { useUser } from 'src/hooks/use-mocked-user';

const columns = [
  { field: 'id', headerName: 'Course Code', width: 200, valueGetter: (params => `${params.row.subject} ${params.row.course_number}`) },
  { field: 'name', headerName: 'Name', width: 300 },
  { field: 'description', headerName: 'Description', width: 900 },
  { field: 'antirequisites', headerName: 'Anti-Requisites', width: 150},
  { field: 'prerequisites', headerName: 'Pre-Requisites', width: 150}
];

const Page = () => {
  const user = useUser();
  const [courses, setCourses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [search, setSearch] = React.useState("")
  const [error, setError] = React.useState(null)
  const [availableOnly, setAvailableOnly] = React.useState(false);
  const populateSubjects = async () => {
    const data = await axios.get(`${SERVERURL}/Course/subjects`);
    setSubjects(data.data);
  }
  const deleteCourse = async () => {
    console.log(rowSelectionModel)
    await axios.get(`${SERVERURL}/Course/delete`, {
      params: {subject: rowSelectionModel[0].split(' ')[0], course_number: rowSelectionModel[0].split(' ')[1]}
    })
    setCourses(courses.filter(x => x.id !== rowSelectionModel[0]))
  }
  const [rowSelectionModel, setRowSelectionModel] =
  React.useState([]);
  React.useEffect(() => {
    populateSubjects();
  }, [])
  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleSubject = (e) => {
    setSelectedSubject(e.target.value.toUpperCase());
  }

  const handleAvailable = (e) => {
    setAvailableOnly(e.target.checked);
  }
  const handleDelete = (e) => {
    deleteCourse();
  }

  const handleSearchSubmit = async (e) => {
    if (selectedSubject.length != 0 && !subjects.includes(selectedSubject.toUpperCase())) {
      setError('Invalid subject code.')
      return
    }
    if (search.length < 4) {
      setError('Search must be at least four characters.')
      return
    }
    setError(null)
    const data = await axios.get(`${SERVERURL}/Course/search`, {
      params: {availableOnly, subject: selectedSubject.length == 0 ? undefined : selectedSubject, search}
    })
    let tempCourses = data.data.map(course => {
      course.id = course.subject + ' ' + course.course_number;
      return course;
    })
    for (let i = 0; i < tempCourses.length; i++) {
      let preReqs = await axios.get(`${SERVERURL}/Course/prereqs`, {
        params: {subject: tempCourses[i].subject, course_number: tempCourses[i].course_number}
      })
      tempCourses[i].prerequisites = preReqs.data.map(x => x.subject + " " + x.course_number).join(', ')

      let antireqs = await axios.get(`${SERVERURL}/Course/antireqs`, {
        params: {subject: tempCourses[i].subject, course_number: tempCourses[i].course_number}
      })
      tempCourses[i].antirequisites = antireqs.data.map(x => x.subject + " " + x.course_number).join(', ')
    }

    setCourses(tempCourses)
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
        value={search}
        label="Search Courses"
        onChange={handleSearch}
      />
      
      <FormControlLabel control={<Checkbox value={availableOnly} onChange={handleAvailable}/>} label="Offered This Term" />
      {error && (
        <Typography style={{margin: '10px', color: 'red'}}>
        {error}
        </Typography>
      )}
      {(rowSelectionModel.length == 0 || user.is_admin == 0) && (
        <Button
        size="large"
        fullWidth
        sx={{ width: '95%', mt: 3, margin: '10px' }}
        variant="contained"
        onClick={handleSearchSubmit}
      >
        Search
      </Button>
      )}
      {(rowSelectionModel.length > 0 && user.is_admin == 1) && (
        <>
        <Button
        size="large"
        sx={{ width: '45%', mt: 3, margin: '10px' }}
        variant="contained"
        onClick={handleSearchSubmit}
      >
        Search
      </Button>
        <Button
        size="large"
        color="error"
        sx={{ width: '45%', mt: 3, margin: '10px' }}
        variant="contained"
        onClick={handleDelete}
      >
        Delete
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
            console.log(newRowSelectionModel)
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
        />
      </div>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
