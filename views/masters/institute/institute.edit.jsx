import { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from "../../../utils/apiService"
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';

const EditInstitute = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: instituteId } = useParams();
  const [instituteData, setInstituteData] = useState({
    id:null,
    name: '',
    address: '',
    mobileNumber: '',
    email: '',
    faxNumber: '',
    code: ''
  });

  const Title = instituteId ? 'Edit Institute' : 'Add Institute';

  useEffect(() => {
    if (instituteId) {
      fetchInstituteData(instituteId);
    }
  }, [instituteId]);

  const fetchInstituteData = async (id) => {
    try {
      const response = await api.get(`api/institutes/getById?id=${id}`);
      setInstituteData(response.data);
    } catch (error) {
      console.error('Failed to fetch institute data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(instituteData);
    const instituteDataNew = { ...values, id: instituteData?.id,accountId:userDetails?.getAccountId() };
    try {
      const response = await api.put(`api/institutes/update`, instituteDataNew);
      setInstituteData(response.data);
      setSubmitting(false);
      console.log('institute updated:', response.data);
      toast.success("Institute updated successfully", {autoClose: '500', onClose: () => {
        navigate('/masters/institutes');
      }})
    } catch (error) {
      toast.error("Failed to update institute", {autoClose: '500'});
      setSubmitting(false);
      console.error('Failed to update institute data:', error);
    }
  };

  return (
    <MainCard title={Title} >
      <Formik
        enableReinitialize
        initialValues={instituteData}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          code: Yup.string().max(255).required('Code is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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

export default EditInstitute;
