import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid2 from '@mui/material/Unstable_Grid2'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import PropTypes from 'prop-types'

const EnhancedDateRangePicker = ({
  dateRange,
  chanegDateStart,
  chanegDateEnd,
  availability,
}) => {
  // State variables to manage start and end dates
  const [start, setStart] = React.useState(dateRange.start)
  const [end, setEnd] = React.useState(dateRange.end)

  // Function to generate a list of dates based on availability
  const generateDateRange = () => {
    if (!availability) {
      return [];
    }
    // Create a flat list of dates from the provided availability range
    const dateList = availability.flatMap(({ start, end }) => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Generate dates between the start and end dates
      const dates = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]);
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1); // Explicitly modify currentDate in the loop
      }

      return dates;
    });

    return dateList;
  };
  // Generate the date list
  const dateList = generateDateRange()

  // Function to check if a date should be disabled
  const setDateDisabled = (date) => {
    const ISODate = date.toISOString().split('T')[0];
    return !availability || !dateList.includes(ISODate);
  };

  return (
    <Grid2
      fullwidth
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px', // Added padding for better spacing
        borderRadius: '8px', // Rounded corners
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow
        backgroundColor: '#fff', // White background
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* CHECK IN */}
        <DatePicker
          fullwidth
          label="Check-In"
          inputFormat="MM/DD/YYYY"
          value={start}
          onChange={(newVal) => {
            chanegDateStart(newVal);
            setStart(newVal);
            if (newVal > end) {
              setEnd(newVal);
              chanegDateEnd(newVal);
            }
          }}
          textField={(params) => <TextField {...params} />}
          shouldDisableDate={(date) => setDateDisabled(date)}
          disablePast={true}
        />
        <Typography variant="h6">-</Typography>
        {/* CHECK OUT */}
        <DatePicker
          fullwidth
          label="Check-Out"
          inputFormat="MM/DD/YYYY"
          value={end}
          onChange={(newVal) => {
            chanegDateEnd(newVal);
            setEnd(newVal);
          }}
          textField={(params) => <TextField {...params} />}
          shouldDisableDate={(date) => setDateDisabled(date)}
          disablePast={true}
        />
      </LocalizationProvider>
    </Grid2>
  );
}

EnhancedDateRangePicker.propTypes = {
  dateRange: PropTypes.object,
  chanegDateStart: PropTypes.func,
  chanegDateEnd: PropTypes.func,
  availability: PropTypes.array,
}

export default EnhancedDateRangePicker
