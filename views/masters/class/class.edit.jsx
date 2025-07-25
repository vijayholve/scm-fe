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

const EditClass = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: classId } = useParams();
  const [classData, setClassData] = useState({
    id: undefined,
    name: '',
    schoolbranchId: '',
    instituteId: '',
    divisionId: ''
  });

  const Title = classId ? 'Edit Class' : 'Add Class';

  const [institues, setInstitues] = useState([]);
  const [schools, setSchools] = useState([]);
  const [divions, setDivions] = useState([]);



  useEffect(() => {
    fetchData(0, 100, 'api/schoolBranches/getAll', setSchools);
    fetchData(0, 100, 'api/institutes/getAll', setInstitues);
    fetchData(0, 100, 'api/divisions/getAll', setDivions);
  }, []);

  const fetchData = async (page, pageSize, endpoint, setter) => {
    api.post(`${endpoint}/${userDetails.getAccountId()}`, {
      page: page,
      size: pageSize,
      sortBy: "id",
      sortDir: "asc",
      search: ""
    }).then(response => {
      setter(response.data.content || []);
    }).catch(err => console.error(err));
  };

  useEffect(() => {
    if (classId) {
      fetchClassData(classId);
    }
  }, [classId]);

  const fetchClassData = async (id) => {
    try {
      const response = await api.get(`api/schoolClasses/getById?id=${id}`);
      setClassData(response.data);
    } catch (error) {
      console.error('Failed to fetch schoolclass data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const classData = { ...values, accountId: userDetails.getAccountId() };
    try {
      const response = await api.put(`api/schoolClasses/update`, classData);
      setClassData(response.data);
      setSubmitting(false);
      console.log('schoolclass updated:', response.data);
      toast.success("Class updated successfully", {
        autoClose: '500', onClose: () => {
          navigate('/masters/classes');
        }
      })
    } catch (error) {
      console.error('Failed to update schoolclass data:', error);
    }
  };

  return (
    <MainCard title={Title} >
      <Formik
        enableReinitialize
        initialValues={classData}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* subject Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-subject-name">Class Name</InputLabel>
                  <OutlinedInput
                    id="teacher-subject-name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Class Name"
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error>{errors.name}</FormHelperText>
                  )}
                </FormControl>
              </Grid>


              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={schools.find((sch) => sch.id === values.schoolbranchId) || null}
                  options={schools}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue("schoolbranchId", newValue ? newValue.id : "");
                  }}
                  renderInput={(params) => <TextField {...params} label="School" />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={divions.find((div) => div.id === values.divisionId) || null}
                  options={divions}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue("divisionId", newValue ? newValue.id : "");
                  }}
                  renderInput={(params) => <TextField {...params} label="Divisions" />}
                />
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
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditClass;
