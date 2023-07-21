import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, TextField, Button } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useUser } from 'src/hooks/use-mocked-user';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { SERVERURL } from 'src/utils/serverurl';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'Subject', width: 200, valueGetter: (params) => `${params.row.subject}` },
  { field: 'course_number', headerName: 'Course Number', width: 200 },
  {
    field: 'grade',
    headerName: 'Grade',
    width: 200
  },
  {
    field: 'nextcourse',
    headerName: 'Next Recommended Course',
    width: 200
  },
  { field: 'level', headerName: 'Level', width: 150 },
];

const Page = () => {
  const user = useUser();

  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [gradeInput, setGradeInput] = useState("");
  const [error, setError] = useState(null);
  const [editCourseId, setEditCourseId] = useState("");
  const [cumulativeGPA, setCumulativeGPA] = useState(0);
  const [cumulativePercentageGPA, setCumulativePercentageGPA] = useState(0);
  const [fourPointGPA, setFourPointGPA] = useState(0);
  const [userRank, setUserRank] = useState(null);

  const populateSubjects = async () => {
    const data = await axios.get(`${SERVERURL}/Course/subjects`);
    setSubjects(data.data);
  }

  function isFloatBetween0And100(value) {
    const floatValue = parseFloat(value);
    return !isNaN(floatValue) && floatValue >= 0 && floatValue <= 100;
  }

  useEffect(() => {
    populateSubjects();
  }, []);

  function handleSubject(e) {
    setSelectedSubject(e.target.value.toUpperCase());
  }

  function handleCourseNumber(e) {
    setCourseNumber(e.target.value.toUpperCase());
  }

  function handleSearchSubmit() {
    if (!subjects.includes(selectedSubject)) {
      setError('Invalid Subject Given');
      return;
    }

    axios.get(`${SERVERURL}/Course/numbers/`, { params: { subject: selectedSubject } })
      .then(response => {
        const courseNumbers = response.data;
        if (!courseNumbers.includes(courseNumber.toUpperCase())) {
          setError('Invalid Course Number for the selected subject');
          return;
        }

        let gradeToSend = null;
        if (gradeInput.toUpperCase() !== "CR") {
          const floatGrade = parseFloat(gradeInput);
          if (isNaN(floatGrade) || floatGrade < 0 || floatGrade > 100) {
            setError('Invalid Grade. Grade must be a valid float between 0 and 100 inclusive.');
            return;
          }
          gradeToSend = floatGrade.toFixed(2);
        }

        axios.get(`${SERVERURL}/TakeCourse/Taken/`, {
          params: {
            uid: user.uid,
            subject: selectedSubject,
            course_number: courseNumber.toUpperCase(),
            grade: gradeToSend,
            level: user.level,
          },
        })
        .then(() => {
          const newCourse = {
            id: selectedSubject + ' ' + courseNumber.toUpperCase(),
            subject: selectedSubject,
            course_number: courseNumber.toUpperCase(),
            grade: gradeToSend,
            level: user.level,
          };
          updatePage();
          setSelectedSubject("");
          setCourseNumber("");
          setGradeInput("");
          setError(null);
        })
        .catch(error => {
          console.error('Error from Axios:', error);
        });
      })
      .catch(error => console.error(error));
  }

  function handleEditCourse() {
    if (editCourseId === "") {
      setError("No course selected for editing.");
      return;
    }

    const courseIndex = courses.findIndex((course) => course.id === editCourseId);
    
    if (courseIndex !== -1) {
      let gradeToSend = null;
      if (gradeInput.toUpperCase() !== "CR") {
        const floatGrade = parseFloat(gradeInput);
        if (isNaN(floatGrade) || floatGrade < 0 || floatGrade > 100) {
          setError('Invalid Grade. Grade must be a valid float between 0 and 100 inclusive.');
          return;
        }
        gradeToSend = floatGrade.toFixed(2);
      }

      const updatedCourses = [...courses];
      updatedCourses[courseIndex].grade = gradeToSend;
      setCourses(updatedCourses);
      setEditCourseId("");
      setGradeInput("");
      setError(null);

      // Send the updated course information to the server
      axios.get(`${SERVERURL}/TakeCourse/update`, {
        params: {
          uid: user.uid,
          subject: updatedCourses[courseIndex].subject,
          course_number: updatedCourses[courseIndex].course_number,
          grade: gradeToSend,
        },
      })
      .then(() => {
        // After successful update, repopulate the GPAs and Rank
        updatePage();
      })
      .catch((error) => console.error(error));
    }
  }

  const handleDeleteCourseRow = (id) => {
    const courseIndex = courses.findIndex((course) => course.id === id);
    if (courseIndex !== -1) {
      axios.get(`${SERVERURL}/TakeCourse/untaken/`, {
        params: {
          uid: user.uid,
          subject: courses[courseIndex].subject,
          course_number: courses[courseIndex].course_number,
        },
      })
      .then(() => {
        setEditCourseId("");
        setGradeInput("");
        setError(null);
        updatePage();
      })
      .catch(error => console.error(error));
    }
  };

  const fetchFourPointGPA = () => {
    axios.get(`${SERVERURL}/TakeCourse/four_point_gpa/`, { params: { uid: user.uid } })
      .then(response => {
        const fourPointGPA = response.data[0].four_point_gpa;
        setFourPointGPA(fourPointGPA !== null ? fourPointGPA : 0);
      })
      .catch(error => console.error(error));
  };

  const fetchCumulativePercentageGPA = () => {
    axios.get(`${SERVERURL}/TakeCourse/percent_gpa/`, { params: { uid: user.uid } })
      .then(response => {
        const cumulativePercentageGPA = response.data[0].average_gpa;
        setCumulativePercentageGPA(cumulativePercentageGPA !== null ? cumulativePercentageGPA : 0);
      })
      .catch(error => console.error(error));
  };

  const fetchUserRank = () => {
    axios.get(`${SERVERURL}/TakeCourse/rank/`, { params: { uid: user.uid } })
      .then(response => {
        const userRank = response.data[0].rank;
        setUserRank(userRank);
      })
      .catch(error => console.error(error));
  };

  const updatePage = async () => {
    const response = await axios.get(`${SERVERURL}/TakeCourse/grades`, { params: { uid: user.uid } })
    const userCourses = response.data.map(async course => {
      const suggested = await axios.get(`${SERVERURL}/Recommender/subject/same`, {
        params: {subject: course.subject, number: course.course_number}
      })

      return {
        id: course.subject + ' ' + course.course_number,
        subject: course.subject,
        course_number: course.course_number,
        grade: course.grade,
        level: course.level,
        nextcourse: suggested.data.length > 0 ? suggested.data[0] : "None"
      };
    });
    setCourses(await Promise.all(userCourses));
    fetchCumulativePercentageGPA();
    fetchFourPointGPA();
    fetchUserRank();
  };

  useEffect(() => {
    updatePage();
  }, []);

  const handleCancelEditCourse = () => {
    setEditCourseId("");
  };

  return (
    <>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <TextField
          style={{ width: '10%', margin: '10px' }}
          value={selectedSubject}
          label="Subject"
          onChange={handleSubject}
        />
        <TextField
          style={{ width: '60%', margin: '10px' }}
          value={courseNumber}
          label="Course Number"
          onChange={handleCourseNumber}
        />
        <TextField
          style={{ width: '10%', margin: '10px' }}
          value={gradeInput}
          label="Grade"
          onChange={(e) => setGradeInput(e.target.value)}
        />
        <TextField
          style={{ width: '10%', margin: '10px' }}
          value={user.level}
          label="Level"
        />
        <Button
          size="large"
          fullWidth
          sx={{ width: '15%', mt: 3, margin: '10px' }}
          variant="contained"
          onClick={handleSearchSubmit}
        >
          Add Course
        </Button>
      </div>

      {error && (
        <Typography style={{ margin: '10px', color: 'red' }}>
          {error}
        </Typography>
      )}

      {/* Display GPAs and Rank */}
      <Box display="flex" justifyContent="space-between" marginBottom="10px">
        <Box textAlign="center" width="40%">
          <Typography variant="h6">Rank: {userRank}</Typography>
        </Box>
        <Box textAlign="center" width="40%">
          <Typography variant="h6">cGPA: {parseFloat(cumulativePercentageGPA).toFixed(2)}%</Typography>
        </Box>
        <Box textAlign="center" width="40%">
          <Typography variant="h6">Four Point GPA: {parseFloat(fourPointGPA).toFixed(2)}</Typography>
        </Box>
      </Box>

      {/* Table */}
      <div style={{ height: '90%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DataGrid
          rows={courses}
          columns={[
            ...columns,
            {
              field: 'actions',
              headerName: 'Actions',
              width: 150,
              renderCell: (params) => (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteCourseRow(params.row.id)}
                  >
                    Delete
                  </Button>
                </>
              ),
            },
          ]}
          pageSize={5}
          onCellClick={(params) => {
            const { id, field } = params;
            if (field === 'grade') {
              setEditCourseId(id);
              setGradeInput(params.row.grade);
            }
          }}
          // Make the "Grade" column editable directly in the table
          editable={{
            isEditable: (params) => params.field === 'grade',
            onEditCellChange: (params) => {
              const { id, field, props } = params;
              setEditCourseId(id);
              setGradeInput(params.props.value);
              handleEditCourse();
            },
          }}
        />
      </div>

      {editCourseId && courses.find((course) => course.id === editCourseId)?.grade !== null && (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Box flexGrow={1}>
            <TextField
              style={{ width: '60%', margin: '10px' }}
              value={gradeInput}
              label="Edit Grade"
              onChange={(e) => setGradeInput(e.target.value)}
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditCourse}
              style={{ marginRight: '10px' }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCancelEditCourse}
              style={{ marginRight: '10px' }}
            >
              Cancel
            </Button>
          </Box>
        </div>
      )}
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
