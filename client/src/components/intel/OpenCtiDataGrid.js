import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useTheme
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';

const OpenCtiDataGrid = ({ 
  title, 
  data, 
  columns, 
  loading, 
  error,
  emptyMessage = "No data found",
  onView = null 
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 4, color: 'error.main' }}>
        <ErrorOutlineRoundedIcon />
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        bgcolor: 'transparent', 
        backgroundImage: 'none',
        border: '1px border white/5',
        boxShadow: 'none',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.main', opacity: 0.1, display: 'flex' }}>
            <SecurityRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'slate.500' }}>
          {data?.length || 0} entities
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
            {columns.map((col) => (
              <TableCell key={col.field} sx={{ color: 'slate.400', py: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {col.headerName}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 8, color: 'slate.500' }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow 
                key={row.id} 
                hover
                sx={{ 
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.02) !important' },
                  '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' }
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.field} sx={{ color: 'slate.300', py: 2 }}>
                    {col.renderCell ? col.renderCell(row) : row[col.field]}
                  </TableCell>
                ))}
                <TableCell align="right">
                   {onView && (
                     <Tooltip title="View Details">
                       <IconButton onClick={() => onView(row)} size="small" sx={{ color: 'slate.400', '&:hover': { color: 'white' } }}>
                        <VisibilityRoundedIcon fontSize="small" />
                       </IconButton>
                     </Tooltip>
                   )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OpenCtiDataGrid;
