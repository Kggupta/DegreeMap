const CSVConverter = require('./CSVConverter')
const mysql2 = require("mysql2");
const axios = require("axios");
const API_URL = 'https://openapi.data.uwaterloo.ca/v3/';
const GET_SCHEDULE = 'ClassSchedules';
const GET_CURRENT_TERM = 'Terms/current';
const GET_COURSES = 'Courses';

/**
 * Convert the 7 character string of Y's and N's to a decimal number
 * @param {*} str - string of Y's and N's
 * @returns Number
 */
function convertToDecimal(str) {
	// Convert 'Y' to 1 and 'N' to 0, and concatenate the characters
	return parseInt(str
	  .split('')
	  .map(char => (char === 'Y' ? '1' : '0'))
	  .join(''), 2);
}

/**
 * Returns the data with the correct headers and tokens based on the given api endpoint
 * @param {string} path - The path to build the request with 
 */
async function getDataFromApi(endpoint) {
	try {
		const res = await axios.get(API_URL + endpoint, {
			headers: {
				"accept": 'application/json',
				"x-api-key": process.env.TOKEN
			}
		});
		
		return res.data;
	} catch (err) {
		return false;
	}
}

/**
 * Returns the value surrounded by quotation marks
 * @param {any} val - Any value 
 * @returns string
 */
function strn(val) {
	return `"${val.replace(/"/g,"\\\"")}"`
}

/**
 * Get the time only for the given value
 * @param {string} timestamp - timestamp value
 * @returns time
 */
function time(timestamp) {
	return strn(timestamp.split("T")[1]);
}

/**
 * Insert the given data into the specified table
 * @param {string} table - Name of the table to insert into
 * @param {Array} data - The data to insert [['property_name', value],]
 */
function InsertData(table, data, connection) {
	connection.query(`INSERT INTO ${table} (${data.map(properties => properties[0])}) VALUES (${data.map(properties => properties[1])});`);
}

/**
 * Populate the database with the full production dataset.
 * 
 * @param {mysql2.Connection} connection - MySQL2 Connection Object
 */
async function PopulateProductionData(connection) {
	if (process.env.TOKEN == null) {
		console.log("You're missing the .env file! Please consult the repository README for details.")
		return;
	}

	// Add the production users (in this case, its just one administrator account)
	await CSVConverter(`./DataFiles/Prod/User.csv`, 'User', connection);

	let instructors = {};
	let preRequisites = [];
	let antiRequisites = [];
	let totalSections = 0;
	let totalPercentageCourse = 0;
	let totalProfessors = 0;
	let totalSchedules = 0;
	console.log("! Processing all production data. This will take a while because the API needs to be requested several times.")
	const CurrentTerm = (await getDataFromApi(GET_CURRENT_TERM)).termCode;
	
	// Get all courses. To remove duplicates due to entries for each lecture, lab, etc, only take lectures.
	// The other types will be retreived in the 'Section' stage of insertion.
	const Courses = (await getDataFromApi(`${GET_COURSES}/${CurrentTerm}`))
		.filter(course => course.courseComponentCode == 'LEC');

	for (let i = 0; i < Courses.length; i++) {
		let course = Courses[i];
		// Add course to database
		await InsertData('Course', [
			['subject', strn(course.subjectCode)],
			['course_number', strn(course.catalogNumber)],
			['name', strn(course.title)],
			['description', strn(course.description)]
		], connection)

		// If they're graded on a percentage basis, add it to the percentage course table
		if (course.gradingBasis === "NUM") {
			totalPercentageCourse++;
			await InsertData('PercentageCourse',[
				['subject', strn(course.subjectCode)],
				['course_number', strn(course.catalogNumber)]
			], connection)
		}
		
		// Add anti and pre requisites to database
		const RequirementsDesc = course.requirementsDescription;
		if (RequirementsDesc) {
			const preReqs = RequirementsDesc.match(/Prereq: ([A-Z]{1,10} [0-9]{1,3}(,|.| )?)($|AntiReq|Coreq)?/g);
			if (preReqs) {
				const preReqCourse = preReqs[0].match(/[A-Z]{1,10} [0-9]{1,3}/g)[0].split(' ');
				preRequisites.push({course:[course.subjectCode, course.catalogNumber], pre: preReqCourse})
			}

			const antiReqs = RequirementsDesc.match(/Antireq: ([A-Z]{1,10} [0-9]{1,3}(,|.| )?)($|Prereq|Coreq)?/g);
			if (antiReqs) {
				const antiReqCourse = antiReqs[0].match(/[A-Z]{1,10} [0-9]{1,3}/g)[0].split(' ');
				antiRequisites.push({course:[course.subjectCode, course.catalogNumber], anti: antiReqCourse})
			}
		}

		// Add course sections and schedule to database
		const CourseSchedule = await getDataFromApi(`${GET_SCHEDULE}/${CurrentTerm}/${course.subjectCode}/${course.catalogNumber}`)
			.catch(err => true);
		// The course might not have any sections
		// This happens when it's not offered during the term
		if (!CourseSchedule) continue;

		for (let t = 0; t < CourseSchedule.length; t++) {
			let section = CourseSchedule[t];
			// If the instructor has not already been added
			if (section.instructorData && !instructors[section.instructorData[0].instructorUniqueIdentifier]) {
				totalProfessors++;
				// Add the professor to the database
				await InsertData('Professor', [
					['uid', strn(section.instructorData[0].instructorUniqueIdentifier)],
					['name', strn(section.instructorData[0].instructorFirstName + " " + section.instructorData[0].instructorLastName)]
				], connection)
				instructors[section.instructorData[0].instructorUniqueIdentifier] = true;
			}
		}

		for (let t = 0; t < CourseSchedule.length; t++) {
			let section = CourseSchedule[t];
			let scheduleData = section.scheduleData[0];
			totalSections++;
			// Add the section to the database
			await InsertData('Section', [
				['section', section.classSection],
				['subject', strn(course.subjectCode)],
				['course_number', strn(course.catalogNumber)],
				['type', strn(section.courseComponent)],
				['professor_id', section.instructorData ? strn(section.instructorData[0].instructorUniqueIdentifier) : "NULL"],
				['days', (scheduleData && scheduleData.classMeetingWeekPatternCode) ? convertToDecimal(scheduleData.classMeetingWeekPatternCode) : "NULL"] ,
				['start_time', time(scheduleData.classMeetingStartTime)],
				['end_time', time(scheduleData.classMeetingEndTime)],
				['location_building', (scheduleData.locationName ?? "").split(" ")[1] ? strn(scheduleData.locationName.split(" ")[0]) : "NULL"],
				['location_room', (scheduleData.locationName ?? "").split(" ")[1] ? strn(scheduleData.locationName.split(" ")[1]) : "NULL"]
			], connection)
		}
	}
	console.log(`> 'Course' - (${Courses.length} rows)`);
	console.log(`> 'PreRequisites' - (${preRequisites.length} rows)`);
	console.log(`> 'AntiRequisites' - (${antiRequisites.length} rows)`);
	console.log(`> 'Section' - (${totalSections} rows)`);
	console.log(`> 'Schedule' - (${totalSchedules} rows)`);
	console.log(`> 'PercentageCourse' - (${totalPercentageCourse} rows)`);
	console.log(`> 'Professor' - (${totalProfessors} rows)`)
	antiRequisites.forEach(async antiReq => {
		if (Courses.some(x => x.subject === antiReq.anti[0] && x.catalogNumber == antiReq.anti[1])) {
			await InsertData('AntiRequisites', [
				['subject', strn(antiReq.course[0])],
				['course_number', strn(antiReq.course[1])],
				['anti_requisite_subject', strn(antiReq.anti[0])],
				['anti_requisite_number', strn(antiReq.anti[1])]
			], connection);
		}
	})

	preRequisites.forEach(async preReq => {
		if (Courses.some(x => x.subject === preReq.pre[0] && x.catalogNumber == preReq.pre[1])) {
			await InsertData('AntiRequisites', [
				['subject', strn(preReq.course[0])],
				['course_number', strn(preReq.course[1])],
				['pre_requisite_subject', strn(preReq.pre[0])],
				['pre_requisite_number', strn(preReq.pre[1])]
			], connection);
		}
	})

}

module.exports = PopulateProductionData;