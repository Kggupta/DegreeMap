import React from "react";
import axios from "axios";
import { Typography, TextField, Button, FormControlLabel, Checkbox, Dialog, DialogActions } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useUser } from "src/hooks/use-mocked-user";
import { DataGrid } from "@mui/x-data-grid";
import { SERVERURL } from "src/utils/serverurl";

function convertBinaryToDays(binary) {
  // Convert the binary number to a 7-digit string
  const binaryString = binary.toString(2).padStart(7, "0");

  // Define an array of day names
  const daysOfWeek = ["M", "T", "W", "Th", "F", "Sa", "Su"];

  // Create an array to store the resulting days
  const result = [];

  // Iterate over each character in the binary string
  for (let i = 0; i < binaryString.length; i++) {
    // Check if the bit is set to 1
    if (binaryString[i] === "1") {
      // Add the corresponding day to the result array
      result.push(daysOfWeek[i]);
    }
  }

  // Join the days in the result array into a single string
  return result.join("");
}

// Takes is COMPLETELY EMPTY!

const searchColumns = [
  {
    field: "id",
    headerName: "Course Code",
    width: 130,
    valueGetter: (params) => `${params.row.subject} ${params.row.course_number}`,
  },
  { field: "name", headerName: "Name", width: 400 },
  { field: "description", headerName: "Description", width: 700 },
  { field: "antirequisites", headerName: "Anti-Requisites", width: 150 },
  { field: "prerequisites", headerName: "Pre-Requisites", width: 150 },
];

const sectionColumns = [
{field: "id",
    headerName: "Course Code",
    width: 150,
    valueGetter: (params) =>
      `${params.row.subject} ${params.row.course_number} ${params.row.section}`,
  },
  { field: "name", headerName: "Name", width: 300 },
  { field: "start_time", headerName: "Start Time", width: 150 },
  { field: "end_time", headerName: "End Time", width: 150 },
  {
    field: "days",
    headerName: "Days",
    width: 150,
    valueGetter: (params) => convertBinaryToDays(params.row.days),
  },
  { field: "professor_name", headerName: "Professor", width: 200 },
  {
    field: "location",
    headerName: "Location",
    width: 150,
    valueGetter: (params) =>
      params.row.location_room && params.row.location_building
        ? `${params.row.location_room}${params.row.location_building}`
        : "Nne",
  },
];

const attendColumns = [
  {
    field: "id",
    headerName: "Course Code",
    width: 200,
    valueGetter: (params) =>
      `${params.row.subject} ${params.row.course_number} ${params.row.section}`,
  },
  { field: "name", headerName: "Name", width: 300 },
  { field: "start_time", headerName: "Start Time", width: 150 },
  { field: "end_time", headerName: "End Time", width: 150 },
  {
    field: "days",
    headerName: "Days",
    width: 150,
    valueGetter: (params) => convertBinaryToDays(params.row.days),
  },
  { field: "professor_name", headerName: "Professor", width: 300 },
  {
    field: "location",
    headerName: "Location",
    width: 150,
    valueGetter: (params) =>
      params.row.location_room && params.row.location_building
        ? `${params.row.location_room}${params.row.location_building}`
        : "Nne",
  },
];

const Page = () => {
  const user = useUser();
  const [error, setError] = React.useState(null);
  const [disableCourseNumber, setDisableCourseNumber] = React.useState(false);
  const [disableCourseTitle, setDisableCourseTitle] = React.useState(false);
  const [dialogueOpen, setDialogueOpen] = React.useState(false);
  const [dialogueAttendDisabled, setDialogueAttendDisabled] = React.useState(false);
  const [availableOnly, setAvailableOnly] = React.useState(false);
  const [courses, setCourses] = React.useState([]);
  const [sections, setSections] = React.useState([]);
  const [attending, setAttending] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [rowSelectionModelUnAttend, setRowSelectionModelUnattend] = React.useState([]);
  const [rowSelectionModelAttend, setRowSelectionModelAttend] = React.useState([]);
  const [sectionRowSelectionModel, setSectionRowSelectionModel] = React.useState([]);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedCourseNumber, setSelectedCourseNumber] = React.useState("");
  const [courseNumber, setCourseNumber] = React.useState("");
  const [courseTitle, setCourseTitle] = React.useState("");

  const populateSubjects = async () => {
    const data = await axios.get(`${SERVERURL}/Course/subjects`);
    setSubjects(data.data);
  };
  const populateAttending = async () => {
    const data = await axios.get(`${SERVERURL}/Section/attending`, {
      params: { uid: user.uid },
    });
    setAttending(
      data.data.map((course) => {
        course.id = course.subject + " " + course.course_number + " " + course.section;
        return course;
      })
    );
  };

  const populateDialogue = async () => {
    const data = await axios.get(`${SERVERURL}/Section/get`, {
      params: { subject: selectedSubject, course_number: selectedCourseNumber },
    });

    for (let i = 0; i < attending.length; i++) {
      const conflict = await axios.get(`${SERVERURL}/Section/conflicting`, {
        params: {
          subject: attending[i].subject,
          course_number: attending[i].course_number,
          section: attending[i].section,
        },
      });
      data.data = data.data.filter((course) => {
        return !conflict.data.some(
          (conflictingCourse) =>
            conflictingCourse.subject == course.subject &&
            conflictingCourse.course_number == course.course_number &&
            conflictingCourse.section == course.section
        );
      });
    }
    data.data.filter;

    setSections(
      data.data.map((course) => {
        course.id = course.subject + " " + course.course_number + " " + course.section;
        return course;
      })
    );
  };

  React.useEffect(() => {

    populateSubjects();
    populateAttending();
  }, []);

  React.useEffect(() => {
    if (sections.length !== 0) {
        setDialogueOpen(true);
        setDialogueAttendDisabled(true);
        setError(null)
    } else if (rowSelectionModelAttend.length !== 0) {
        setError("No sections avaliable or your schedule creates conflict with all avaliable sections.")
    }
  }, [sections]);

  const handleSubject = (e) => {
    setSelectedSubject(e.target.value.toUpperCase());
  };

  const handleCourseNumber = (e) => {
    const numericInput = e.target.value.replace(/\D/g, "");
    setDisableCourseTitle(numericInput !== "");
    setCourseNumber(numericInput);
  };

  const handleCourseTitle = (e) => {
    setDisableCourseNumber(e.target.value !== "");
    setCourseTitle(e.target.value);
  };

  const handleAvailable = (e) => {
    setAvailableOnly(e.target.checked);
  };

  const handleSearchSubmit = async (e) => {
    if (!subjects.includes(selectedSubject)) {
      setError("Invalid subject code.");
      return;
    }

    let search = "";
    if (courseTitle !== "") {
      if (courseTitle.length < 4) {
        setError("Search must be at least four characters.");
        return;
      }
      search = courseTitle;
    } else if (courseNumber !== "") {
      search = courseNumber;
    }

    // Test with CS341 (it it pre-req for a lot of courses)
    const query1 = await axios.get(`${SERVERURL}/Course/search`, {
      params: { availableOnly, subject: selectedSubject, search },
    });
    let tempCourses = query1.data.map((course) => {
      course.id = course.subject + " " + course.course_number;
      return course;
    });

    const query2 = await axios.get(`${SERVERURL}/Plan/eligible-courses`, {
      params: { uid: user.uid },
    });
    let tempCourses2 = query2.data.map((course) => {
      course.id = course.subject + " " + course.course_number;
      return course;
    });

    console.log("------ 1 ------");
    console.log(tempCourses);
    console.log("------ 2 ------");
    console.log(tempCourses2);

    const elibigleCourses = tempCourses.filter((course1) =>
      tempCourses2.some((course2) => course1.id === course2.id)
    );
    console.log("------ 3 ------");
    console.log(elibigleCourses);

    // Run this later after it's sorted through
    for (let i = 0; i < elibigleCourses.length; i++) {
      let preReqs = await axios.get(`${SERVERURL}/Course/prereqs`, {
        params: {
          subject: elibigleCourses[i].subject,
          course_number: elibigleCourses[i].course_number,
        },
      });
      elibigleCourses[i].prerequisites = preReqs.data
        .map((x) => x.subject + " " + x.course_number)
        .join(", ");

      let antireqs = await axios.get(`${SERVERURL}/Course/antireqs`, {
        params: {
          subject: elibigleCourses[i].subject,
          course_number: elibigleCourses[i].course_number,
        },
      });
      elibigleCourses[i].antirequisites = antireqs.data
        .map((x) => x.subject + " " + x.course_number)
        .join(", ");
    }

    setError(elibigleCourses.length === 0 ? "No results from search." : null);
    setCourses(
      elibigleCourses.map((course) => {
        course.id = course.subject + " " + course.course_number + " ";
        return course;
      })
    );
  };

  const handleAttend = async (e) => {
    const searching = {
      uid: user.uid,
      section: sectionRowSelectionModel[0].split(" ")[2],
      subject: sectionRowSelectionModel[0].split(" ")[0],
      course_number: sectionRowSelectionModel[0].split(" ")[1],
    };

    await axios.get(`${SERVERURL}/Section/attend/`, {
      params: searching,
    });

    const value = sections.find(
      (section) =>
      section.subject == searching.subject &&
      section.course_number == searching.course_number &&
      section.section == searching.section
    );
    
    setCourses(
      courses.filter(
        (course) =>
          !(
            course.subject == searching.subject &&
            course.course_number == searching.course_number &&
            course.section == searching.section
          )
      )
    );
    setAttending([...attending, value]);
  };
  const handleUnattend = async (e) => {
    const searching = {
      uid: user.uid,
      section: rowSelectionModelUnAttend[0].split(" ")[2],
      subject: rowSelectionModelUnAttend[0].split(" ")[0],
      course_number: rowSelectionModelUnAttend[0].split(" ")[1],
    };
    await axios.get(`${SERVERURL}/Section/unattend/`, {
      params: searching,
    });
    setAttending(
      attending.filter(
        (course) =>
          !(
            course.subject == searching.subject &&
            course.course_number == searching.course_number &&
            course.section == searching.section
          )
      )
    );
  };

  const handleDialogueOpen = async () => {
    await populateDialogue();
  };

  const handleDialogueSave = () => {
    setDialogueOpen(false);
    setDialogueAttendDisabled(true);
    handleAttend();
  };

  const handleDialogueClose = () => {
    setSectionRowSelectionModel([]);
    setDialogueAttendDisabled(true);
    setDialogueOpen(false);
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TextField
            style={{ width: "10%", margin: "10px", minWidth: "130px" }}
            value={selectedSubject}
            label="Subject"
            onChange={handleSubject}
          />
          <TextField
            style={{ width: "10%", margin: "10px", minWidth: "130px" }}
            value={courseNumber}
            label="Course Number"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            onChange={handleCourseNumber}
            disabled={disableCourseNumber}
          />
          <TextField
            style={{ width: "65%", margin: "10px" }}
            value={courseTitle}
            label="Course Title"
            onChange={handleCourseTitle}
            disabled={disableCourseTitle}
          />
          <FormControlLabel
            control={
              <Checkbox
                style={{ width: "15%", margin: "10px" }}
                value={availableOnly}
                onChange={handleAvailable}
              />
            }
            label="Offered This Term"
          />
        </div>
        {error && <Typography style={{ margin: "15px", color: "red" }}>{error}</Typography>}
        {rowSelectionModelAttend.length == 0 && rowSelectionModelUnAttend == 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              size="large"
              fullWidth
              sx={{ width: "100%", mt: 3, margin: "10px" }}
              variant="contained"
              onClick={handleSearchSubmit}
            >
              Search Courses
            </Button>
          </div>
        )}
        {rowSelectionModelAttend.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                size="large"
                sx={{ width: "50%", mt: 3, margin: "10px" }}
                variant="contained"
                onClick={handleSearchSubmit}
              >
                Search Courses
              </Button>
              <Button
                size="large"
                sx={{ width: "50%", mt: 3, margin: "10px" }}
                variant="contained"
                onClick={handleDialogueOpen}
              >
                Search Sections
              </Button>
            </div>
          </>
        )}
        {rowSelectionModelUnAttend.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                size="large"
                sx={{ width: "50%", mt: 3, margin: "10px" }}
                variant="contained"
                onClick={handleSearchSubmit}
              >
                Search Courses
              </Button>
              <Button
                size="large"
                color="error"
                sx={{ width: "50%", mt: 3, margin: "10px" }}
                variant="contained"
                onClick={handleUnattend}
              >
                Un-Attend
              </Button>
            </div>
          </>
        )}
      </div>
      <div style={{ height: "90%", width: "100%", minHeight: "100px"}}>
        <DataGrid
          rows={courses}
          columns={searchColumns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            if (newRowSelectionModel.length != 0) {
              setSelectedCourseNumber(newRowSelectionModel[0].split(" ")[1]);
            }
            setRowSelectionModelAttend(newRowSelectionModel);
            setRowSelectionModelUnattend([]);
          }}
          rowSelectionModel={rowSelectionModelAttend}
        />
      </div>
      <Typography variant="h4" margin={1}>
        Attending Sections
      </Typography>
      <div style={{ height: "90%", width: "100%" }}>
        <DataGrid
          rows={attending}
          columns={attendColumns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModelUnattend(newRowSelectionModel);
            setRowSelectionModelAttend([]);
          }}
          rowSelectionModel={rowSelectionModelUnAttend}
        />
      </div>

      <div>
        <Dialog open={dialogueOpen} maxWidth="500px">
            <DataGrid
              rows={sections}
              columns={sectionColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 25 },
                },
              }}
              pageSizeOptions={[25, 50, 100]}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                if (newRowSelectionModel.length !== 0) {
                    setDialogueAttendDisabled(false);
                }
                setSectionRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={sectionRowSelectionModel}
            />

          <DialogActions>
            <Button onClick={handleDialogueClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleDialogueSave} color="primary" disabled={dialogueAttendDisabled}>
              Attend
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
