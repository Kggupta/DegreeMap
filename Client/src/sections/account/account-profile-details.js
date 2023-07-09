import { useCallback, useState } from 'react';
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
  Typography
} from '@mui/material';
import axios from 'axios';
import { SERVERURL } from 'src/utils/serverurl';
import { useUser } from 'src/hooks/use-mocked-user';
import { useFormik } from 'formik';
const YEARS = [1,2,3,4];
const LEVELS = ["A", "B"];
import * as Yup from 'yup';

export const AccountProfileDetails = () => {
  let user = useUser();

  const formik = useFormik({
    initialValues: {
      name: user?.name,
      password: user?.password,
      confirmPassword: '',
      level: user?.level,
      submit: null
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      password: Yup
        .string()
        .max(255)
        .min(8)
        .required('Password is required'),
      confirmPassword: Yup
        .string()
        .max(255)
        .min(8)
        .required('You must confirm your password'),
      level: Yup
        .string()
        .max(2)
        .required('Academic Level is required')

    }),
    onSubmit: async (values, helpers) => {
      try {
        if (values.password !== values.confirmPassword)
          throw new Error('Passwords Must Match');

        await axios.get(`${SERVERURL}/User/update`, {
          params: {uid: user.uid, name: values.name, password: values.password,
                    level: values.level}
        })
        helpers.setStatus({success: true})
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });
  return (
    <div>
    <form
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Stack spacing={3}>
        <TextField
          error={!!(formik.touched.name && formik.errors.name)}
          fullWidth
          helperText={formik.touched.name && formik.errors.name}
          label="Name"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="name"
          value={formik.values.name}
        />
        <TextField
          error={!!(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label="Password"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
        />
        <TextField
          error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
          fullWidth
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          label="Confirm Password"
          name="confirmPassword"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.confirmPassword}
        />
        <Select
          error={!!(formik.touched.level && formik.errors.level)}
          fullWidth
          labelId='academiclevel'
          id='level'
          name='level'
          value={formik.values.level}
          label="Academic Level"
          type='level'
          helperText={formik.touched.level && formik.errors.level}
          onChange={(e) => {formik.handleChange(e);}}
          onBlur={formik.handleBlur}
        >
          {YEARS.map(year => (
            LEVELS.map(level => (
                <MenuItem value={`${year}${level}`}>{`${year}${level}`}</MenuItem>
            ))
          ))}
        </Select>
      </Stack>
      {formik.errors.submit && (
        <Typography
          color="error"
          sx={{ mt: 3 }}
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
          Updated Values
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
    </div>
  );
};
