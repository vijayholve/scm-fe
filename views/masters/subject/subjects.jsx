import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Autocomplete,
    Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, TextField, Typography, IconButton, Paper
} from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Assuming these are correctly imported from your project structure
// Please ensure these paths are correct for your application.
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
// import api, { userDetails } from "../../../utils/apiService"; // API service and user details
import { gridSpacing } from 'store/constant'; // Grid spacing constant
import api,{userDetails} from 'utils/apiService'; // API service and user details
const EditTimetable = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    // Extract timetable ID from URL parameters for editing existing timetables
    const { id: timetableId } = useParams();

    // State to store current user's full details fetched from backend
    const [currentUserDetails, setCurrentUserDetails] = useState(null);

    // Initial state for the timetable data, including default accountId
    const [timetableData, setTimetableData] = useState({
        id: undefined, // Will be set if editing an existing timetable
        className: '',
        classId: '', // Stores the ID of the selected class
        divisionId: '', // Stores the ID of the selected division
        dayTimeTable: [], // Array to hold daily schedule objects
        // Safely access userDetails methods, providing fallback values
        accountId: userDetails?.getAccountId?.() || 0,
        createdBy: userDetails?.getUserName?.() || 'Unknown User', // Initial fallback
        updatedBy: userDetails?.getUserName?.() || 'Unknown User', // Initial fallback
    });

    // Determine the title of the card based on whether it's an add or edit operation
    const Title = timetableId ? 'Edit Timetable' : 'Add Timetable';

    // State variables for dropdown options
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]); // Although teacherName is auto-filled, keeping for completeness if needed elsewhere

    // Define the static list of days for the dropdown
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Fetch initial data for all Autocomplete dropdowns on component mount
    useEffect(() => {
        // All 'getAll' endpoints are now correctly using POST with pagination payload
        fetchData(0, 100, 'api/schoolClasses/getAll', setClasses);
        fetchData(0, 100, 'api/divisions/getAll', setDivisions);
        fetchData(0, 100, 'api/subjects/getAll', setSubjects);
        fetchData(0, 100, 'api/teachers/getAll', setTeachers); // Fetch teachers if needed for future features
    }, []);

    // Fetch current user's details using /api/users/getById
    useEffect(() => {
        const accountId = userDetails?.getAccountId?.();
        if (accountId) {
            const fetchCurrentUser = async () => {
                try {
                    const response = await api.get(`api/users/getById?id=${accountId}`);
                    setCurrentUserDetails(response.data);
                    // Update initial timetableData with fetched user name
                    setTimetableData(prevData => ({
                        ...prevData,
                        createdBy: response.data.name || userDetails?.getUserName?.() || 'Unknown User',
                        updatedBy: response.data.name || userDetails?.getUserName?.() || 'Unknown User',
                    }));
                    console.log("Fetched current user details:", response.data);
                } catch (error) {
                    console.error('Failed to fetch current user details:', error);
                    toast.error('Failed to load current user details.');
                }
            };
            fetchCurrentUser();
        }
    }, [userDetails?.getAccountId?.()]); // Depend on accountId to refetch if it changes

    /**
     * Generic asynchronous function to fetch data for dropdowns.
     * This function now consistently uses api.post for 'getAll' endpoints with a pagination payload.
     * @param {number} page - The page number for pagination.
     * @param {number} pageSize - The number of items per page.
     * @param {string} endpoint - The API endpoint to fetch data from.
     * @param {Function} setter - The state setter function to update the fetched data.
     */
    const fetchData = async (page, pageSize, endpoint, setter) => {
        try {
            const accountId = userDetails?.getAccountId?.() || 0;
            const url = `${endpoint}/${accountId}`; // Append accountId to the URL

            const payload = {
                page: page,
                size: pageSize,
                sortBy: "id",
                sortDir: "asc",
                search: ""
            };

            console.log(`Fetching data from POST: ${url} with payload:`, payload); // Log the URL and payload for debugging
            const response = await api.post(url, payload); // Use api.post with the payload

            setter(response.data.content || []); // Update state with fetched data
            // Log subjects data to console for debugging
            if (endpoint.includes('subjects')) {
                console.log("Fetched Subjects:", response.data.content);
            }
        } catch (err) {
            console.error(`Failed to fetch data from ${endpoint}:`, err);
            toast.error(`Failed to load data for ${endpoint.split('/')[1].replace('getAll', '')}. Please check network and API.`);
        }
    };

    // Fetch existing timetable data if timetableId is present (for edit mode)
    useEffect(() => {
        if (timetableId) {
            fetchTimetableData(timetableId);
        }
    }, [timetableId]); // Re-run when timetableId changes

    /**
     * Fetches a specific timetable's data by its ID.
     * @param {string} id - The ID of the timetable to fetch.
     */
    const fetchTimetableData = async (id) => {
        try {
            const response = await api.get(`api/timetable/getById?id=${id}`);
            // Ensure dayTimeTable and tsd are arrays to prevent errors if API returns null/undefined
            const fetchedData = {
                ...response.data,
                dayTimeTable: response.data.dayTimeTable || [],
                classId: response.data.classId || '', // Ensure classId is set for Autocomplete
                divisionId: response.data.divisionId || '', // Ensure divisionId is set for Autocomplete
                // Safely set createdBy and updatedBy from fetched data or current user details
                createdBy: response.data.createdBy || currentUserDetails?.name || userDetails?.getUserName?.() || 'Unknown User',
                updatedBy: currentUserDetails?.name || userDetails?.getUserName?.() || 'Unknown User', // Always update updatedBy on fetch for consistency
            };
            setTimetableData(fetchedData); // Update the form's initial values
        } catch (error) {
            console.error('Failed to fetch timetable data:', error);
            toast.error('Failed to fetch timetable data.');
        }
    };

    /**
     * Handles the form submission for saving or updating a timetable.
     * @param {object} values - The form values from Formik.
     * @param {object} { setSubmitting } - Formik helper function to manage submission state.
     */
    const handleSubmit = async (values, { setSubmitting }) => {
        // Determine the user name to be used for createdBy/updatedBy
        const userName = currentUserDetails?.name || userDetails?.getUserName?.() || 'Unknown User';

        // Prepare the payload for the API call
        const finalValues = {
            ...values,
            // Convert IDs to numbers, defaulting to 0 if empty string (for new entries)
            classId: values.classId === '' ? 0 : Number(values.classId),
            divisionId: values.divisionId === '' ? 0 : Number(values.divisionId),
            accountId: userDetails?.getAccountId?.() || 0, // Safely access accountId
            createdBy: timetableId ? values.createdBy : userName, // Set createdBy only on creation, otherwise keep existing
            updatedBy: userName, // Always update updatedBy on save/update

            // Map over dayTimeTable to ensure correct structure and IDs
            dayTimeTable: values.dayTimeTable.map(day => ({
                ...day,
                id: day.id || 0, // Set ID to 0 for new day entries
                accountId: userDetails?.getAccountId?.() || 0, // Safely access accountId for each day entry
                // Map over tsd (Time Slot Details) for each day
                tsd: day.tsd.map(slot => ({
                    ...slot,
                    id: slot.id || 0, // Set ID to 0 for new time slot entries
                    subjectId: slot.subjectId === '' ? 0 : Number(slot.subjectId), // Convert subjectId to number
                    teacherName: userName, // Auto-fill teacher name from fetched user name
                    accountId: userDetails?.getAccountId?.() || 0, // Safely access accountId for each time slot
                }))
            }))
        };

        // Log the final payload before sending for debugging
        console.log("Payload sent to API:", finalValues);

        try {
            // Determine the API endpoint and HTTP method based on whether it's an edit or add operation
            const endpoint = timetableId ? `api/timetable/update` : `api/timetable/save`;
            const method = timetableId ? api.put : api.post;

            const response = await method(endpoint, finalValues); // Make the API call
            setTimetableData(response.data); // Update state with the response data
            setSubmitting(false); // End submission state

            // Show success toast and navigate away after a short delay
            toast.success(`Timetable ${timetableId ? 'updated' : 'saved'} successfully`, {
                autoClose: 500, // Close after 500ms
                onClose: () => {
                    navigate('/masters/timetables'); // Redirect to the timetables list page
                }
            });
        } catch (error) {
            console.error(`Failed to ${timetableId ? 'update' : 'save'} timetable data:`, error);
            toast.error(`Failed to ${timetableId ? 'update' : 'save'} timetable.`);
            setSubmitting(false); // Ensure submission state is reset on error
        }
    };

    return (
        <MainCard title={Title}>
            <Formik
                enableReinitialize // Important to re-initialize form when timetableData changes (e.g., after fetching data for edit)
                initialValues={timetableData}
                validationSchema={Yup.object().shape({
                    className: Yup.string().max(255).required('Class Name is required'),
                    classId: Yup.number().required('Class is required').typeError('Please select a class'),
                    divisionId: Yup.number().required('Division is required').typeError('Please select a division'),
                    dayTimeTable: Yup.array().of( // Validation for the array of daily schedules
                        Yup.object().shape({
                            dayName: Yup.string().required('Day Name is required'), // Validation for dayName
                            tsd: Yup.array().of( // Validation for the array of time slots within each day
                                Yup.object().shape({
                                    type: Yup.string().required('Type is required'),
                                    subjectName: Yup.string().required('Subject Name is required'),
                                    hour: Yup.number().min(0).max(23).required('Hour is required').typeError('Must be a number between 0 and 23'),
                                    minute: Yup.number().min(0).max(59).required('Minute is required').typeError('Must be a number between 0 and 59'),
                                    subjectId: Yup.number().required('Subject is required').typeError('Please select a subject'),
                                    sequence: Yup.number().min(1).required('Sequence is required').typeError('Must be a positive number'),
                                })
                            )
                        })
                    )
                })}
                onSubmit={handleSubmit}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={gridSpacing}>
                            {/* Class Name Input */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.className && errors.className)}>
                                    <InputLabel htmlFor="timetable-class-name">Class Name</InputLabel>
                                    <OutlinedInput
                                        id="timetable-class-name"
                                        name="className"
                                        value={values.className}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Class Name"
                                    />
                                    {touched.className && errors.className && (
                                        <FormHelperText error>{errors.className}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Class Autocomplete (Selection) */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="timetable-class-autocomplete"
                                    options={classes}
                                    getOptionLabel={(option) => option.name || ''}
                                    // Set the value of the Autocomplete based on the classId in formik values
                                    value={classes.find((cls) => cls.id === values.classId) || null}
                                    onChange={(event, newValue) => {
                                        // Update classId in Formik state when a class is selected
                                        setFieldValue("classId", newValue ? newValue.id : '');
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Class"
                                            error={Boolean(touched.classId && errors.classId)}
                                            helperText={touched.classId && errors.classId}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Division Autocomplete (Selection) */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="timetable-division-autocomplete"
                                    options={divisions}
                                    getOptionLabel={(option) => option.name || ''}
                                    // Set the value of the Autocomplete based on the divisionId in formik values
                                    value={divisions.find((div) => div.id === values.divisionId) || null}
                                    onChange={(event, newValue) => {
                                        // Update divisionId in Formik state when a division is selected
                                        setFieldValue("divisionId", newValue ? newValue.id : '');
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Division"
                                            error={Boolean(touched.divisionId && errors.divisionId)}
                                            helperText={touched.divisionId && errors.divisionId}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Day Time Table Section - Dynamic Array of Days */}
                            <Grid item xs={12}>
                                <Typography variant="h4" sx={{ mb: 2 }}>Daily Schedule</Typography>
                                <FieldArray name="dayTimeTable">
                                    {({ push, remove }) => (
                                        <Box>
                                            {/* Map through each day in the dayTimeTable array */}
                                            {values.dayTimeTable.map((day, dayIndex) => (
                                                <Paper key={dayIndex} elevation={2} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                                                    <Grid container spacing={gridSpacing} alignItems="center">
                                                        {/* Day Name Autocomplete (Selection) */}
                                                        <Grid item xs={10}>
                                                            <Autocomplete
                                                                disablePortal
                                                                id={`dayTimeTable-${dayIndex}-dayName`}
                                                                options={daysOfWeek}
                                                                value={day.dayName || null}
                                                                onChange={(event, newValue) => {
                                                                    setFieldValue(`dayTimeTable.${dayIndex}.dayName`, newValue || '');
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Day Name"
                                                                        error={Boolean(touched.dayTimeTable?.[dayIndex]?.dayName && errors.dayTimeTable?.[dayIndex]?.dayName)}
                                                                        helperText={touched.dayTimeTable?.[dayIndex]?.dayName && errors.dayTimeTable?.[dayIndex]?.dayName}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        {/* Delete Day Button */}
                                                        <Grid item xs={2} sx={{ textAlign: 'right' }}>
                                                            <IconButton color="error" onClick={() => remove(dayIndex)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Grid>

                                                        {/* Time Slot Details (tsd) - Dynamic Array of Slots within each Day */}
                                                        <Grid item xs={12}>
                                                            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Time Slots</Typography>
                                                            <FieldArray name={`dayTimeTable.${dayIndex}.tsd`}>
                                                                {({ push: pushTsd, remove: removeTsd }) => (
                                                                    <Box>
                                                                        {/* Map through each time slot (tsd) within the current day */}
                                                                        {day.tsd.map((slot, slotIndex) => (
                                                                            <Paper key={slotIndex} elevation={1} sx={{ p: 2, mb: 2, border: '1px dashed #bdbdbd', borderRadius: '6px' }}>
                                                                                <Grid container spacing={gridSpacing} alignItems="center">
                                                                                    {/* Type Input */}
                                                                                    <Grid item xs={12} sm={4}>
                                                                                        <FormControl fullWidth error={Boolean(touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type)}>
                                                                                            <InputLabel htmlFor={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-type`}>Type</InputLabel>
                                                                                            <OutlinedInput
                                                                                                id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-type`}
                                                                                                name={`dayTimeTable.${dayIndex}.tsd.${slotIndex}.type`}
                                                                                                value={slot.type}
                                                                                                onBlur={handleBlur}
                                                                                                onChange={handleChange}
                                                                                                label="Type"
                                                                                            />
                                                                                            {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type && (
                                                                                                <FormHelperText error>{errors.dayTimeTable[dayIndex].tsd[slotIndex].type}</FormHelperText>
                                                                                            )}
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                    {/* Subject Autocomplete (Selection) */}
                                                                                    <Grid item xs={12} sm={4}>
                                                                                        <Autocomplete
                                                                                            disablePortal
                                                                                            id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-subject`}
                                                                                            options={subjects}
                                                                                            getOptionLabel={(option) => option.name || ''}
                                                                                            // Set the value of the Autocomplete based on the subjectId in formik values
                                                                                            value={subjects.find((sub) => sub.id === slot.subjectId) || null}
                                                                                            onChange={(event, newValue) => {
                                                                                                // Update subjectId and subjectName in Formik state when a subject is selected
                                                                                                setFieldValue(`dayTimeTable.${dayIndex}.tsd.${slotIndex}.subjectId`, newValue ? newValue.id : '');
                                                                                                setFieldValue(`dayTimeTable.${dayIndex}.tsd.${slotIndex}.subjectName`, newValue ? newValue.name : '');
                                                                                            }}
                                                                                            renderInput={(params) => (
                                                                                                <TextField
                                                                                                    {...params}
                                                                                                    label="Subject"
                                                                                                    error={Boolean(touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.subjectId && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.subjectId)}
                                                                                                    helperText={touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.subjectId && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.subjectId}
                                                                                                />
                                                                                            )}
                                                                                        />
                                                                                    </Grid>
                                                                                    {/* Hour Input */}
                                                                                    <Grid item xs={6} sm={2}>
                                                                                        <FormControl fullWidth error={Boolean(touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour)}>
                                                                                            <InputLabel htmlFor={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-hour`}>Hour</InputLabel>
                                                                                            <OutlinedInput
                                                                                                id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-hour`}
                                                                                                name={`dayTimeTable.${dayIndex}.tsd.${slotIndex}.hour`}
                                                                                                value={slot.hour}
                                                                                                onBlur={handleBlur}
                                                                                                onChange={handleChange}
                                                                                                label="Hour"
                                                                                                type="number" // Ensure number input
                                                                                                inputProps={{ min: 0, max: 23 }} // Add min/max for hours
                                                                                            />
                                                                                            {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour && (
                                                                                                <FormHelperText error>{errors.dayTimeTable[dayIndex].tsd[slotIndex].hour}</FormHelperText>
                                                                                            )}
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                    {/* Minute Input */}
                                                                                    <Grid item xs={6} sm={2}>
                                                                                        <FormControl fullWidth error={Boolean(touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute)}>
                                                                                            <InputLabel htmlFor={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-minute`}>Minute</InputLabel>
                                                                                            <OutlinedInput
                                                                                                id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-minute`}
                                                                                                name={`dayTimeTable.${dayIndex}.tsd.${slotIndex}.minute`}
                                                                                                value={slot.minute}
                                                                                                onBlur={handleBlur}
                                                                                                onChange={handleChange}
                                                                                                label="Minute"
                                                                                                type="number" // Ensure number input
                                                                                                inputProps={{ min: 0, max: 59 }} // Add min/max for minutes
                                                                                            />
                                                                                            {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute && (
                                                                                                <FormHelperText error>{errors.dayTimeTable[dayIndex].tsd[slotIndex].minute}</FormHelperText>
                                                                                            )}
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                    {/* Sequence Input */}
                                                                                    <Grid item xs={12} sm={4}>
                                                                                        <FormControl fullWidth error={Boolean(touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.sequence && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.sequence)}>
                                                                                            <InputLabel htmlFor={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-sequence`}>Sequence</InputLabel>
                                                                                            <OutlinedInput
                                                                                                id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-sequence`}
                                                                                                name={`dayTimeTable.${dayIndex}.tsd.${slotIndex}.sequence`}
                                                                                                value={slot.sequence}
                                                                                                onBlur={handleBlur}
                                                                                                onChange={handleChange}
                                                                                                label="Sequence"
                                                                                                type="number"
                                                                                            />
                                                                                            {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.sequence && errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.sequence && (
                                                                                                <FormHelperText error>{errors.dayTimeTable[dayIndex].tsd[slotIndex].sequence}</FormHelperText>
                                                                                            )}
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                    {/* Teacher Name (Auto-filled and Disabled) */}
                                                                                    <Grid item xs={12} sm={4}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Teacher Name"
                                                                                            value={currentUserDetails?.name || userDetails?.getUserName?.() || 'Unknown User'} // Use fetched user name or fallback
                                                                                            disabled // User cannot edit this field
                                                                                        />
                                                                                    </Grid>
                                                                                    {/* Delete Time Slot Button */}
                                                                                    <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                                                                                        <IconButton color="error" onClick={() => removeTsd(slotIndex)}>
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Paper>
                                                                        ))}
                                                                        {/* Button to Add New Time Slot */}
                                                                        <Button
                                                                            variant="outlined"
                                                                            startIcon={<AddIcon />}
                                                                            onClick={() => pushTsd({
                                                                                id: 0, // Default ID for new slot
                                                                                type: '',
                                                                                subjectName: '',
                                                                                hour: 0,
                                                                                minute: 0,
                                                                                subjectId: '', // Default empty string for Autocomplete
                                                                                teacherName: currentUserDetails?.name || userDetails?.getUserName?.() || 'Unknown User', // Auto-fill with fetched user name
                                                                                sequence: (day.tsd.length > 0 ? Math.max(...day.tsd.map(s => s.sequence)) + 1 : 1), // Auto-increment sequence
                                                                                accountId: userDetails?.getAccountId?.() || 0, // Auto-fill
                                                                            })}
                                                                            sx={{ mt: 1 }}
                                                                        >
                                                                            Add Time Slot
                                                                        </Button>
                                                                    </Box>
                                                                )}
                                                            </FieldArray>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            ))}
                                            {/* Button to Add New Day */}
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => push({
                                                    id: 0, // Default ID for new day
                                                    dayName: '',
                                                    tsd: [], // Initialize with an empty array of time slots
                                                    accountId: userDetails?.getAccountId?.() || 0, // Auto-fill
                                                })}
                                                sx={{ mt: 2 }}
                                            >
                                                Add Day
                                            </Button>
                                        </Box>
                                    )}
                                </FieldArray>
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting} // Disable button during submission
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Save Timetable
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

export default EditTimetable;
