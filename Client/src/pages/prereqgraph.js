import Head from 'next/head';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import React, { useCallback } from 'react';
import { SERVERURL } from 'src/utils/serverurl';
import axios from 'axios';
import ReactFlow, {applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import {v4 as uuid} from 'uuid';
const Page = () => {
	const [selectedSubject, setSubject] = React.useState();
	const [subjects, setSubjects] = React.useState([]);
	const [courseNumber, setCourseNumber] = React.useState();
	const [error, setError] = React.useState();
	const [graphData, setGraphData] = React.useState([]);
	const [edgeData, setEdgeData] = React.useState([]);
	const populateSubjects = async () => {
		const data = await axios.get(`${SERVERURL}/Course/subjects`);
		setSubjects(data.data);
	}

	React.useEffect(() => {
		populateSubjects();
	}, [])

	const handleSubject = (e) => {
	setSubject(e.target.value.toUpperCase());
	}

	const handleCourseNumber = (e) => {
	setCourseNumber(e.target.value.toUpperCase());
	}
	const onNodesChange = useCallback(
		(changes) => setGraphData((nds) => applyNodeChanges(changes, nds)),
		[setGraphData]
	);
	const onEdgesChange = useCallback(
		(changes) => setEdgeData((eds) => applyEdgeChanges(changes, eds)),
		[setEdgeData]
	);
	const handleSearchSubmit = async () => {
		if (!subjects.includes(selectedSubject.toUpperCase())) {
			setError('Invalid course entered.')
			return;
		}

		const data = await axios.get(`${SERVERURL}/PreReqs/graph`, {
			params: {subject: selectedSubject, number: courseNumber}
		})
		let nodes = [];
		let edges = [];
		let x = 100;
		let y = 100;
		let val = 0;
		data.data.forEach(entry => {
			const sourceString = `${entry.subject} ${entry.course_number}`;
			const targetString = `${entry.pre_requisite_subject} ${entry.pre_requisite_number}`;

			if (!nodes.find(x => x.id === sourceString)) {
				nodes.push({id: sourceString, position: {x: 100 * ((val + 1) % 3), y: 100 * ((val + 1) % 3)}, data: {label: sourceString}})
			}
			val++;
			if (!nodes.find(x => x.id === targetString)) {
				nodes.push({id: targetString, position: {x: 100 * ((val + 1) % 3), y: 100 * ((val + 1) % 3)}, data: {label: targetString}});
			}
			val++
			edges.push({id: uuid(), source: targetString, target: sourceString});
		})
		setGraphData(nodes);
		setEdgeData(edges);
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
			<Button
				size="large"
				fullWidth
				sx={{ width: '95%', mt: 3, margin: '10px' }}
				variant="contained"
				onClick={handleSearchSubmit}
			>
				View Graph
			</Button>
			</div>
			{graphData.length > 0 && edgeData.length > 0 &&
				<ReactFlow fitView nodes={graphData} edges={edgeData} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}/>
			}
		</>
	)
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
