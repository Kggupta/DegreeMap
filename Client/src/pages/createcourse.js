import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, TextField, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { useUser } from 'src/hooks/use-mocked-user';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { SERVERURL } from 'src/utils/serverurl';
const Page = () => {
	const user = useUser();
	const formik = useFormik({
		initialValues: {
		  subject: '',
		  course_number: '',
		  description: '',
		  prereqs: '',
		  antireqs: '',
		  name: '',
		  submit: null
		},
		validationSchema: Yup.object({
		  subject: Yup
			.string()
			.max(10)
			.required('Course Subject is required'),
			course_number: Yup
			.string()
			.max(10)
			.required('Course number is required'),
			description: Yup
			.string()
			.max(500)
			.required('Description is required'),
			prereqs: Yup
			.string()
			.max(500),
			antireqs: Yup
			.string()
			.max(500),
			name: Yup
			.string()
			.max(100)
			.required('Name is required')
		}),
		onSubmit: async (values, helpers) => {
		  try {
			await axios.get(`${SERVERURL}/Course/insert`, {
				params: values
			})
			helpers.setStatus({success: true})
		  } catch (err) {
			helpers.setStatus({ success: false });
			helpers.setErrors({ submit: err.response.data });
			helpers.setSubmitting(false);
		  }
		}
	  });

  return (
    <>
      <Head>
        <title>
          Create Course | DegreeMap
        </title>
      </Head>
		{user?.is_admin != 1 && (
			<Typography variant="h4">
                Admin Only
            </Typography>
		)}
		{user?.is_admin == 1 && (
			<>
			<Typography style={{margin: '10px'}}variant="h4">
                Create Course
            </Typography>
			<form noValidate onSubmit={formik.handleSubmit}>
			<Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.subject && formik.errors.subject)}
                  fullWidth
                  helperText={formik.touched.subject && formik.errors.subject}
                  label="Subject"
                  name="subject"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.subject}
                />
                <TextField
                  error={!!(formik.touched.course_number && formik.errors.course_number)}
                  fullWidth
                  helperText={formik.touched.course_number && formik.errors.course_number}
                  label="Course Number"
                  name="course_number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.course_number}
                />
				<TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
				<TextField
                  error={!!(formik.touched.description && formik.errors.description)}
                  fullWidth
				  multiline
                  helperText={formik.touched.description && formik.errors.description}
                  label="Description"
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
				<TextField
                  error={!!(formik.touched.prereqs && formik.errors.prereqs)}
                  fullWidth
				  multiline
                  helperText={formik.touched.prereqs && formik.errors.prereqs}
                  label="Pre-Requisites"
                  name="prereqs"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.prereqs}
                />
				<TextField
                  error={!!(formik.touched.antireqs && formik.errors.antireqs)}
                  fullWidth
				  multiline
                  helperText={formik.touched.antireqs && formik.errors.antireqs}
                  label="Anti-Requisites"
                  name="antireqs"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.antireqs}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ margin: '10px', mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
			  {formik.status?.success && (
                <Typography
                  color="green"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  Inserted Course
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
			</form>
			</>
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
