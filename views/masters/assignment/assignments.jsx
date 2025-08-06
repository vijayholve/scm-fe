import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import api, { userDetails } from '../../../utils/apiService';

// Define the columns for the assignments data grid.
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150, flex: 1 },
  { field: 'std', headerName: 'Standard', width: 150, editable: true },
  { field: 'subjectName', headerName: 'Subject', width: 150, editable: true },
  { field: 'createdBy', headerName: 'Created By', width: 150, editable: true },
  { field: 'deadLine', headerName: 'Deadline', width: 150, editable: true }
];

const Assignments = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();

  // State for filter dropdowns and date picker
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [activeSinceDate, setActiveSinceDate] = useState(null);

  // Fetch subjects and classes for the dropdown filters
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const subjectsResponse = await api.post(`/api/subjects/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc', search: '' });
        setSubjects(subjectsResponse.data.content || []);

        const classesResponse = await api.post(`/api/schoolClasses/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc', search: '' });
        setClasses(classesResponse.data.content || []);
      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
      }
    };
    fetchDropdownData();
  }, [accountId]);

  // Create the filters object to pass to ReusableDataGrid
  const filters = {
    subjectId: selectedSubjectId,
    classId: selectedClassId,
    activeSince: activeSinceDate ? dayjs(activeSinceDate).format('YYYY-MM-DD') : null
  };

  return (
    <MainCard
      title="Assignments"
      secondary={<SecondaryAction icon={<AddIcon />} link="/masters/assignment/add" />}
    >
      <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
        {/* Subject Filter Dropdown */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="subject-select-label">Subject</InputLabel>
            <Select
              labelId="subject-select-label"
              id="subject-select"
              value={selectedSubjectId}
              label="Subject"
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Class Filter Dropdown */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClassId}
              label="Class"
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 'Active Since' Date Picker */}
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Active Since"
              value={activeSinceDate}
              onChange={(newValue) => setActiveSinceDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ReusableDataGrid
          fetchUrl={`/api/assignments/getAll/${accountId}`}
          columns={columns}
          editUrl="/masters/assignment/edit"
          deleteUrl="/api/assignments/delete"
          filters={filters}
        />
      </Grid>
    </MainCard>
  );
};

export default Assignments;