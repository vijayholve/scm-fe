import React from 'react';

// material-ui
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Role Name', width: 200, flex: 1 }
];
const RolesList = () => {
    const accountId = userDetails.getAccountId();

    return (
        <MainCard
            title="Manage Roles"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/role/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        fetchUrl={`/api/roles/getAll/${accountId}`}
                        columns={columns}
                        editUrl="/masters/role/edit"
                        deleteUrl="/api/roles/delete"
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default RolesList;