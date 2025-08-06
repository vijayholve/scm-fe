import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  Paper,
  MenuItem
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import api, { userDetails } from "../../../utils/apiService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const examTypes = [
  { value: "MIDTERM", label: "Midterm" },
  { value: "FINAL", label: "Final" },
  { value: "QUIZ", label: "Quiz" },
  { value: "OTHER", label: "Other" }
];

const EditExam = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [exam, setExam] = useState({
    examName: "",
    examDate: "",
    examType: "",
    accountId: userDetails.getAccountId ? userDetails.getAccountId() : null,
    createdBy: userDetails.getUsername ? userDetails.getUsername() : "",
    modifiedBy: userDetails.getUsername ? userDetails.getUsername() : "",
    schoolId: null,
    classId: null,
    examStudentList: []
  });
  const [schoolList, setSchoolList] = useState([]);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      const pagination = {  
        page: 0,
        size: 1000,
        sortBy: "id",
        sortDir: "asc"
      }
      const response = await api.post(`api/schoolBranches/getAll/${user.accountId}`, pagination);
      setSchoolList(response.data.content);
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {  
      const pagination = {  
        page: 0,
        size: 1000,
        sortBy: "id",
        sortDir: "asc"
      }
      const response = await api.post(`api/classes/getAll/${user.accountId}`, pagination);
      setClassList(response.data.content);
    };
    fetchClasses();
  }, []);


  const [subject, setSubject] = useState({
    subjectName: "",
    subjectId: "",
    totalMarks: "",
    marksObtained: "",
    accountId: userDetails.getAccountId ? userDetails.getAccountId() : null,
    createdBy: userDetails.getUsername ? userDetails.getUsername() : "",
    modifiedBy: userDetails.getUsername ? userDetails.getUsername() : ""
  });

  const [errors, setErrors] = useState({});

  const handleExamChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (e) => {
    setSubject({ ...subject, [e.target.name]: e.target.value });
  };

  const handleAddSubject = () => {
    if (!subject.subjectName || !subject.subjectId || !subject.totalMarks) {
      setErrors({
        ...errors,
        subject: "Please fill all subject fields (Name, Id, Total Marks)"
      });
      return;
    }
    setExam({
      ...exam,
      examStudentList: [...exam.examStudentList, subject]
    });
    setSubject({
      subjectName: "",
      subjectId: "",
      totalMarks: "",
      marksObtained: "",
      accountId: userDetails.getAccountId ? userDetails.getAccountId() : null,
      createdBy: userDetails.getUsername ? userDetails.getUsername() : "",
      modifiedBy: userDetails.getUsername ? userDetails.getUsername() : ""
    });
    setErrors({ ...errors, subject: null });
  };

  const handleRemoveSubject = (idx) => {
    const updatedList = exam.examStudentList.filter((_, i) => i !== idx);
    setExam({ ...exam, examStudentList: updatedList });
  };

  const handleSave = async () => {
    // Basic validation
    if (!exam.examName || !exam.examDate || !exam.examType || !exam.schoolId || !exam.classId) {
      setErrors({
        ...errors,
        form: "Please fill all required fields."
      });
      return;
    }
    if (exam.examStudentList.length === 0) {
      setErrors({
        ...errors,
        form: "Please add at least one subject."
      });
      return;
    }
    setErrors({});
    try {
      await api.post("/api/exam/create", {
        ...exam,
        examDate: new Date(exam.examDate)
      });
      navigate("/masters/exam");
    } catch (err) {
      setErrors({
        ...errors,
        form: "Failed to save exam. Please try again."
      });
    }
  };

  const handleCancel = () => {
    navigate("/masters/exam");
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Exam
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Exam Name"
              name="examName"
              value={exam.examName}
              onChange={handleExamChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Exam Date"
              name="examDate"
              type="date"
              value={exam.examDate}
              onChange={handleExamChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Exam Type"
              name="examType"
              value={exam.examType}
              onChange={handleExamChange}
              fullWidth
              required
            >
              {examTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="School ID"
              name="schoolId"
              value={exam.schoolId || null}
              onChange={async (e) => {
                const selectedSchoolId = e.target.value;
                const selectedSchool = schoolList.find(s => s.id === Number(selectedSchoolId));
                setExam({
                  ...exam,
                  schoolId: selectedSchool ? selectedSchool.id : null,
                  schoolName: selectedSchool ? selectedSchool.name : null
                });
              }}
              fullWidth
              required
            >
              {schoolList?.length > 0 && schoolList?.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Class ID"
              name="classId"
              value={exam.classId || null}
              onChange={handleExamChange}
              fullWidth
              required
              type="number"
            />
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Add Subjects to Exam
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Subject Name"
              name="subjectName"
              value={subject.subjectName}
              onChange={handleSubjectChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Subject ID"
              name="subjectId"
              value={subject.subjectId}
              onChange={handleSubjectChange}
              fullWidth
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Total Marks"
              name="totalMarks"
              value={subject.totalMarks}
              onChange={handleSubjectChange}
              fullWidth
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Marks Obtained"
              name="marksObtained"
              value={subject.marksObtained}
              onChange={handleSubjectChange}
              fullWidth
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <IconButton color="primary" onClick={handleAddSubject}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
        {errors.subject && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errors.subject}
          </Typography>
        )}
      </Paper>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Subjects Added
      </Typography>
      {exam.examStudentList.length === 0 && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No subjects added yet.
        </Typography>
      )}
      {exam.examStudentList.map((subj, idx) => (
        <Paper
          key={idx}
          sx={{
            p: 1,
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box>
            <Typography>
              <b>{subj.subjectName}</b> (ID: {subj.subjectId}) | Total Marks: {subj.totalMarks}
              {subj.marksObtained && ` | Marks Obtained: ${subj.marksObtained}`}
            </Typography>
          </Box>
          <IconButton color="error" onClick={() => handleRemoveSubject(idx)}>
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}

      {errors.form && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {errors.form}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditExam;
