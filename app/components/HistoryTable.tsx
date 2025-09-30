import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { Session } from "../stores/useSessionStore";

function HistoryTable({ history }: { history: Session[] }) {
  console.log("Rendering HistoryTable with history:", history);
  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1, minWidth: 120 },
    { field: "focusDuration", headerName: "Focus (min)", width: 110 },
    { field: "expectedCycles", headerName: "Expected Cycles", width: 150 },
    { field: "cycles", headerName: "Completed Cycles", width: 120 },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      minWidth: 160,
      valueFormatter: (params) =>
        new Date(params as string).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1,
      minWidth: 160,
      valueFormatter: (params) =>
        params
          ? new Date(params as string).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "—",
    },
    {
      field: "isCompleted",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        const { isCompleted, cycles, expectedCycles } = params.row;
        const isCompletedSucessfully = isCompleted && cycles === expectedCycles;
        return isCompleted ? (
          isCompletedSucessfully ? (
            <Chip label="Completed" color="success" size="small" />
          ) : (
            <Chip label="Incompleted" color="error" size="small" />
          )
        ) : (
          <Chip label="In Progress" color="warning" size="small" />
        );
      },
    },
  ];

  return (
    <Box className="w-full mt-[40px] ">
      <DataGrid
        rows={history}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10]}
        initialState={{
          sorting: {
            sortModel: [{ field: "startTime", sort: "desc" }],
          },
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        disableRowSelectionOnClick
        disableColumnSelector
        className="text-xs"
        sx={{
          bgcolor: "transparent",
          color: "#fff",
          border: "none",
          borderRadius: 0,

          "& *": {
            color: "#fff",
          },

          "& .MuiDataGrid-columnHeaders": {
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            textTransform: "uppercase",
            backgroundColor: "rgba(255,255,255,0.1) !important",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "rgba(255,255,255,0.1) !important",
          },
          "& .MuiDataGrid-filler": {
            bgcolor: "rgba(255,255,255,0.1) !important",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          },
          "& .MuiDataGrid-footerContainer": {
            bgcolor: "transparent",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          },
          "& .MuiDataGrid-row:hover": {
            bgcolor: "rgba(255,255,255,0.05)",
          },
        }}
      />
    </Box>
  );
}

export default HistoryTable;
