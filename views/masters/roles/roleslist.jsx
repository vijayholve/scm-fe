import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MainCard from "ui-component/cards/MainCard";
import SecondaryAction from "ui-component/cards/CardSecondaryAction";
import { gridSpacing } from "store/constant";
import api, { userDetails } from "../../../utils/apiService";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Role Name", width: 200 }
];

const ActionWrapper = (props) => (
  <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
    {props.children}
  </Box>
);

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);
  const navigate = useNavigate();

  const fetchRoles = (page, pageSize) => {
    const pagination = {
      page: page,
      size: pageSize,
      sortBy: "id",
      sortDir: "asc",
      search: ""
    };
    api
      .post(`api/roles/getAll/${userDetails.getAccountId()}`, pagination)
      .then((response) => {
        setRoles(response.data.content || []);
        setRowCount(response.data.totalElements || 0);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRoles(page, pageSize);
    // eslint-disable-next-line
  }, [page, pageSize]);

  const handleOnClickDelete = (data) => {
    if (data.id) {
      api
        .delete(`api/roles/delete?id=${data.id}`)
        .then(() => {
          setRoles((prev) => prev.filter((role) => role.id !== data.id));
        })
        .catch((err) => console.error(err));
    }
  };

  const handleOnClickEdit = (data) => {
    navigate(`/masters/role/edit/${data.id}`);
  };

  const actionColumn = {
    field: "actions",
    headerName: "Actions",
    width: 180,
    renderCell: (params) => (
      <ActionWrapper>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EditOutlinedIcon />}
          onClick={() => handleOnClickEdit(params.row)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleOnClickDelete(params.row)}
        >
          Delete
        </Button>
      </ActionWrapper>
    )
  };

  return (
    <MainCard
      title="Roles"
      secondary={
        <SecondaryAction
          icon={<AddIcon onClick={() => navigate("/masters/role/add")} />}
        />
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={roles}
              columns={[...columns, actionColumn]}
              pagination
              paginationMode="server"
              rowCount={rowCount}
              page={page}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pageSizeOptions={[5, 10, 20, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
            />
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default RolesList;