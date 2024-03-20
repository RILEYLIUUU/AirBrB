import React, { useState, useRef } from 'react'
import {
  Grid,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
// Define a styled Dialog component using styled-components
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
// FilterDialog component
const FilterDialog = (props) => {
  const { handleFilterClose, filterData, handleFiltersApply } = props;
  const formRef = useRef(null);
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [dateRange, setDateRange] = useState({
    checkInDate: '',
    checkOutDate: '',
  });
  // Function to handle apply button click
  const handleApply = () => {
    const data = {
      checkInDate,
      checkOutDate,
      bedroomsMin: formRef.current.bedroomsMin.value,
      bedroomsMax: formRef.current.bedroomsMax.value,
      priceMin: formRef.current.priceMin.value,
      priceMax: formRef.current.priceMax.value,
      dateRange, // Add this line
    }
    // Call the provided handleFiltersApply function with the data
    handleFiltersApply(data)
  }

  return (
      <BootstrapDialog
        onClose={handleFilterClose}
        aria-labelledby="customized-dialog-title"
        open
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Filters
        </DialogTitle>
        <DialogContent dividers style={{ padding: '16px 16px 0 16px' }}>
          <form ref={formRef}>
            <Divider>Date Range</Divider>
            <Grid sx={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="checkInDate"
                  label="CHECK IN"
                  sx={{ width: '265px' }}
                  defaultValue={filterData.checkInDate ? dayjs(filterData.checkInDate) : undefined}
                  onChange={(e) => {
                    setCheckInDate(dayjs(e).format('MM/DD/YYYY'));
                    setDateRange({ ...dateRange, checkInDate: dayjs(e).format('MM/DD/YYYY') });
                  }}
                />
              </LocalizationProvider>
              <div style={{ width: '15px', textAlign: 'center' }}>-</div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="checkOutDate"
                  label="CHECK OUT"
                  sx={{ width: '265px' }}
                  defaultValue={filterData.checkOutDate ? dayjs(filterData.checkOutDate) : undefined}
                  onChange={(e) => {
                    setCheckOutDate(dayjs(e).format('MM/DD/YYYY'));
                    setDateRange({ ...dateRange, checkOutDate: dayjs(e).format('MM/DD/YYYY') });
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Divider>Bedrooms</Divider>
            <Grid sx={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                id="bedroomsMin"
                data-testid="bedroomsMin"
                label="Min"
                type="number"
                defaultValue={filterData.bedroomsMin || ''}
                sx={{ width: '265px' }}
              />
              <TextField
                id="bedroomsMax"
                data-testid="bedroomsMax"
                label="Max"
                type="number"
                defaultValue={filterData.bedroomsMax || ''}
                sx={{ width: '265px' }}
              />
            </Grid>
            <Divider>Price Range</Divider>
            <Grid sx={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                id="priceMin"
                data-testid="priceMin"
                label="Min"
                type="number"
                defaultValue={filterData.priceMin || ''}
                sx={{ width: '265px' }}
                InputProps={{
                  startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="priceMax"
                label="Max"
                data-testid="priceMax"
                type="number"
                defaultValue={filterData.priceMax || ''}
                sx={{ width: '265px' }}
                InputProps={{
                  startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Divider />
          </form>
          <Button sx={{ width: '100%', height: '60px' }} onClick={() => handleFiltersApply({})}>CLEAN FILTERS</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClose}>
            CANCEL
          </Button>
          <Button onClick={handleApply}>
            APPLY
          </Button>
        </DialogActions>
      </BootstrapDialog>
  )
}

export default FilterDialog;
