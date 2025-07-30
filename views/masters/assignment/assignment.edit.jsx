import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import BackButton from 'layout/MainLayout/Button/BackButton';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api from "../../../utils/apiService"
import { gridSpacing } from 'store/constant';
import { useSelector } from 'react-redux';

const EditAssignment = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
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
    message: '',
    status: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [assignmentSubmission, setAssignmentSubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    // Fetch submissions for the current assignment and user
    if (assignmentId && user?.id) {
      const fetchSubmissions = async () => {
        try {
          let response;
          if (user?.type === "STUDENT") {
            response = await api.get(`/api/assignments/submissions/${assignmentId}/student/${user.id}`);
          } else if (user?.type === "TEACHER") {
            response = await api.get(`/api/assignments/submissions/${assignmentId}`);
          }
          if (Array.isArray(response.data)) {
            setSubmissions(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch submissions:', error);
        }
      };
      fetchSubmissions();
    }
  }, [assignmentId, user?.id]);


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
      //setSubmissions(response.data.submissions);
      setAssignmentSubmission(response.data.assignmentSubmission);
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
                  <InputLabel shrink htmlFor="status">Status</InputLabel>
                  <select
                    id="status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      height: '56px',
                      padding: '16.5px 14px',
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
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
              {user?.type != "STUDENT" && <Grid item xs={12} sm={6}>
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
              </Grid>}

              {/* Submit Button */}
              {user?.type != "STUDENT" && <Grid item xs={12}>
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
                  <BackButton/>
              </Grid>}
            </Grid>



            {Array.isArray(assignmentSubmission) && assignmentSubmission.length > 0 && assignmentSubmission.map((submission, idx) => (
              <Box mt={4} key={submission}>
                <h3>Uploaded File</h3>
                <table border="1" width="100%">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Size</th>
                      <th>Download</th>
                      <th>Upload</th>
                      <th>Submit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{submission.fileName}</td>
                      <td>{(submission.fileSize / 1024).toFixed(2)} KB</td>
                      <td>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={async () => {
                            try {
                              const response = await api.get(
                                `api/assignments/download/file/${submission.id}?assignmentId=${assignmentId}&fileName=${encodeURIComponent(submission.fileName)}`,
                                {
                                  responseType: 'blob'
                                }
                              );
                              // Ensure we use the correct blob object for createObjectURL
                              const url = window.URL.createObjectURL(new Blob([response.data]));
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', submission.fileName);
                              document.body.appendChild(link);
                              link.click();
                              link.remove();
                            } catch (error) {
                              console.error('Failed to download file:', error);
                              toast.error("Failed to download file");
                            }
                          }}
                        >
                          Download
                        </Button>
                      </td>
                      {/* Upload button for student to select file */}
                      <td>
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          id={`upload-file-${idx}`}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              // If assignmentSubmission is an array, clone and update the file for this row
                              const updated = Array.isArray(assignmentSubmission) ? [...assignmentSubmission] : [];
                              updated[idx] = { ...updated[idx], file };
                              setAssignmentSubmission(updated);
                            }
                          }}
                        />
                        <label htmlFor={`upload-file-${idx}`}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            component="span"
                            size="small"
                          >
                            {submission.file ? "Change File" : "Upload File"}
                          </Button>
                        </label>
                        {submission.file && (
                          <span style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>
                            {submission.file.name}
                          </span>
                        )}
                      </td>

                      {/* Button for students to submit assignment */}
                      <td>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={async () => {
                            if (!submission.file) {
                              toast.error("Please select a file to submit.");
                              return;
                            }
                            try {
                              const formData = new FormData();
                              formData.append('file', submission.file);
                              formData.append('assignmentId', assignmentId);
                              // You may want to add studentId if needed
                              formData.append('studentId', user?.id);
                              await api.post('/api/assignments/submit', formData, {
                                headers: {
                                  'Content-Type': 'multipart/form-data'
                                }
                              });
                              toast.success("Assignment submitted successfully");
                            } catch (error) {
                              toast.error("Failed to submit assignment");
                            }
                          }}
                        >
                          Submit Assignment
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            ))}
          </form>
        )}
      </Formik>
      <Box mt={5}>
        <h3>{user?.type != "STUDENT" ? "Student Submissions" : "My Submissions"}</h3>
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>{user?.type != "STUDENT" ? "Student ID" : "My ID"}</th>
              <th>File Name</th>
              <th>{user?.type != "STUDENT" ? "View/Download" : "View"}</th>
              <th>{user?.type != "STUDENT" ? "Accept/Reject" : "Status"}</th>
              <th>{user?.type != "STUDENT" ? "Comment" : "Comment"}</th>
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
                  {user?.type != "STUDENT" && <select
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
                  </select>}
                  {user?.type == "STUDENT" && <span>{sub.status}</span>}
                </td>
                <td>
                  <input
                    type="text"
                    value={sub.message}
                    placeholder="Enter Comment"
                    onChange={(e) => {
                      const updated = [...submissions];
                      updated[idx].message = e.target.value;
                      setSubmissions(updated);
                    }}
                  />
                  <Button variant="outlined" color="primary" size="small" onClick={() => {
                    // Call backend API to update submission
                    const submission = submissions[idx];
                    const payload = {
                      id: submission.id,
                      status: submission.status,
                      message: submission.message
                    };
                    api.put(`/api/assignments/submissions/update/${submission.id}`, payload)
                      .then(res => {
                        toast.success("Submission updated");
                        // Optionally update local state with response if needed
                        // const updated = [...submissions];
                        // updated[idx] = res.data;
                        // setSubmissions(updated);
                      })
                      .catch(err => {
                        toast.error("Failed to update submission");
                        console.error(err);
                      });
                  }}>Save</Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    style={{ marginLeft: 8 }}
                    onClick={async () => {
                      const submission = submissions[idx];
                      if (window.confirm("Are you sure you want to delete this submission?")) {
                        try {
                          await api.delete(`/api/assignments/submissions/delete/${submission.id}`);
                          toast.success("Submission deleted");
                          // Remove from local state
                          const updated = submissions.filter((_, i) => i !== idx);
                          setSubmissions(updated);
                        } catch (err) {
                          toast.error("Failed to delete submission");
                          console.error(err);
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
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
