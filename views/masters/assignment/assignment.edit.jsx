import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api from "../../../utils/apiService"
import { gridSpacing } from 'store/constant';

const EditAssignment = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: assignmentId } = useParams();
  const [assignmentData, setAssignmentData] = useState({
    id: undefined,
    name: '',
    std: '',
    subjectId: undefined,
    subjectName: '',
    createdBy: undefined,
    createdDate: undefined,
    modifiedBy: undefined,
    modifiedDate: undefined,
    deadLine: undefined,
    isActive: true,
    message: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submissions, setSubmissions] = useState([
    { studentId: 'S101', fileName: 'maths.pdf', status: '', comment: '' },
    { studentId: 'S102', fileName: 'science.docx', status: '', comment: '' }
  ]);


  const Title = assignmentId ? 'Edit Assignment' : 'Add Assignment';

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentData(assignmentId);
    }
  }, [assignmentId]);

  const fetchAssignmentData = async (id) => {
    try {
      const response = await api.get(`api/assignments/getById?id=${id}`);
      setAssignmentData(response.data);
    } catch (error) {
      console.error('Failed to fetch Assignment data:', error);
    }
  };


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(values)], {
        type: 'application/json'
      });

      formData.append('assignment', jsonBlob);
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const response = await api.post(`/api/assignments/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Assignment saved successfully", {
        autoClose: 500,
        onClose: () => navigate('/masters/assignments')
      });

      setAssignmentData(response.data);
    } catch (error) {
      console.error('Failed to save assignment:', error);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <MainCard title={Title} >
      <Formik
        enableReinitialize
        initialValues={assignmentData}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          std: Yup.string().required('Standard is required'),
          subjectName: Yup.string().required('Subject is required'),
          deadLine: Yup.date().nullable().required('Deadline is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* Assignment Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="assignment-name">Assignment Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Assignment Name"
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error>{errors.name}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Standard */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="std">Standard</InputLabel>
                  <OutlinedInput
                    id="std"
                    name="std"
                    type="text"
                    value={values.std}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Standard"
                  />
                  {touched.std && errors.std && (
                    <FormHelperText error>{errors.std}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Subject Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="subjectName">Subject Name</InputLabel>
                  <OutlinedInput
                    id="subjectName"
                    name="subjectName"
                    value={values.subjectName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Subject Name"
                  />
                </FormControl>
              </Grid>

              {/* Deadline */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="deadLine">Deadline</InputLabel>
                  <OutlinedInput
                    id="deadLine"
                    name="deadLine"
                    type="date"
                    value={values.deadLine}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Deadline"
                    inputProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>

              {/* Is Active */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor="isActive">Is Active</InputLabel>
                  <select
                    id="isActive"
                    name="isActive"
                    value={values.isActive}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      height: '56px',
                      padding: '16.5px 14px',
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      borderRadius: '4px'
                    }}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </FormControl>
              </Grid>

              {/* Message */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="message">Message</InputLabel>
                  <OutlinedInput
                    id="message"
                    name="message"
                    value={values.message}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Message"
                  />
                </FormControl>
              </Grid>

              {/* Upload File */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor="file">Upload File</InputLabel>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={(e) => setUploadedFile(e.target.files[0])}
                    style={{ marginTop: '16px' }}
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
                    {assignmentId ? 'Update' : 'Create'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>



            {uploadedFile && (
              <Box mt={4}>
                <h3>Uploaded File</h3>
                <table border="1" width="100%">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{uploadedFile.name}</td>
                      <td>{(uploadedFile.size / 1024).toFixed(2)} KB</td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            )}
          </form>
        )}
      </Formik>
      <Box mt={5}>
        <h3>Student Submissions</h3>
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>File Name</th>
              <th>View/Download</th>
              <th>Accept/Reject</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, idx) => (
              <tr key={idx}>
                <td>{sub.studentId}</td>
                <td>{sub.fileName}</td>
                <td>
                  <Button
                    size="small"
                    onClick={() => alert(`Downloading ${sub.fileName}`)}
                    variant="outlined"
                  >
                    View/Download
                  </Button>
                </td>
                <td>
                  <select
                    value={sub.status}
                    onChange={(e) => {
                      const updated = [...submissions];
                      updated[idx].status = e.target.value;
                      setSubmissions(updated);
                    }}
                  >
                    <option value="">--Select--</option>
                    <option value="accepted">Accept</option>
                    <option value="rejected">Reject</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={sub.comment}
                    placeholder="Enter comment"
                    onChange={(e) => {
                      const updated = [...submissions];
                      updated[idx].comment = e.target.value;
                      setSubmissions(updated);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

    </MainCard>
  );
};

export default EditAssignment;
