import React from 'react';

// material-ui
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
// Corrected the relative import path
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx'; // <-- Key import
import { userDetails } from '../../../utils/apiService';

// Define the columns specifically for the Devision data grid.
// The 'actions' column will be added automatically by the ReusableDataGrid.
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'schoolbranchName', headerName: 'School', width: 150, flex: 1 },
    { field: 'instituteName', headerName: 'Institute', width: 150, flex: 1 },
];

// ==============================|| SIMPLIFIED DEVISION LIST ||============================== //

const Devision = () => {
    const accountId = userDetails.getAccountId();

    // The component is now incredibly clean. It just sets up the main card
    // and configures the ReusableDataGrid with the correct props.
    return (
        <MainCard
            title="Manage Devision"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/division/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        fetchUrl={`/api/divisions/getAll/${accountId}`}
                        columns={columns}
                        editUrl="/masters/division/edit"
                        deleteUrl="/api/devisions/delete"
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Devision;

// export default Divisions;
// /masters/division/add 
// api/divisions/getAll/ 
// api/divisions/delete 
// /masters/division/edit/