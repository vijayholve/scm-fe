import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, TextField
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from "../../../utils/apiService"
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';

const EditSchool = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: schoolId } = useParams();
  const [institues, setInstitues] = useState([]);
  const [schoolData, setSchoolData] = useState({
    id: null,
    name: '',
    instituteId: '',
    address: '',
    mobileNumber: '',
    email: '',
    faxNumber: '',
    code: '',
    accountId: ''
  });

  const Title = schoolId ? 'Edit School' : 'Add School';

  useEffect(() => {
    if (schoolId) {
      fetchSchoolData(schoolId);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchInstitues(0, 100);
  }, []);

   const fetchInstitues = (page, pageSize) => {
    api.post(`api/institutes/getAll/${userDetails.getAccountId()}`, {
      page: page,
      size: pageSize,
      sortBy: "id",
      sortDir: "asc",
      search: ""
    }).then(response => {
      setInstitues(response.data.content || []);
      setRowCount(response.data.totalElements || 0);
    }).catch(err => console.error(err));
  };

  const fetchSchoolData = async (id) => {
    try {
      const response = await api.get(`api/schoolBranches/getById?id=${id}`);
      setSchoolData(response.data);
    } catch (error) {
      console.error('Failed to fetch school data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(schoolData);
    const schoolDataNew = { ...values, id: schoolData?.id, accountId: userDetails?.getAccountId() };
    try {
      const response = await api.put(`api/schoolBranches/update`, schoolDataNew);
      setSchoolData(response.data);
      setSubmitting(false);
      console.log('school updated:', response.data);
      toast.success("School updated successfully", {autoClose: '500', onClose: () => {
        navigate('/masters/schools');
      }})
    } catch (error) {
      console.error('Failed to update school data:', error);
    }
  };

  return (
    <MainCard title={Title} >
      <Formik
        enableReinitialize
        initialValues={schoolData}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          code: Yup.string().max(255).required('Code is required'),
          instituteId: Yup.string().required('Institute is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* User Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-user-name">Name</InputLabel>
                  <OutlinedInput
                    id="institute-name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Name"
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error>{errors.name}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  disablePortal
                  value={institues.find((ins) => ins.id === values.instituteId) || null}
                  options={institues}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue("instituteId", newValue ? newValue.id : "");
                  }}
                  renderInput={(params) => <TextField {...params} label="Institute" />}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="institute-address">Address</InputLabel>
                  <OutlinedInput
                    id="institute-address"
                    name="address"
                    type="text"
                    value={values.address}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Address"
                  />
                  {touched.address && errors.address && (
                    <FormHelperText error>{errors.address}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-first-name">Mobile Number</InputLabel>
                  <OutlinedInput
                    id="mobileNumber"
                    name="mobileNumber"
                    value={values.mobileNumber}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Mobile Number"
                  />
                </FormControl>
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="institute-email">Email</InputLabel>
                  <OutlinedInput
                    id="institute-email"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Email"
                  />
                </FormControl>
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-last-name">Fax Number</InputLabel>
                  <OutlinedInput
                    id="institute-faxNumber"
                    name="faxNumber"
                    value={values.faxNumber}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Fax Number"
                  />
                </FormControl>
              </Grid>

              {/* Mobile No */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="code">Code</InputLabel>
                  <OutlinedInput
                    id="institute-code"
                    name="code"
                    value={values.code}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Code"
                  />
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    Save
                  </Button>
                </AnimateButton>
                <BackButton/>

              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditSchool;
