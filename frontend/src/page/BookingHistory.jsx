import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material//Paper'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import HomeIcon from '@mui/icons-material/Home'
import { withStyles } from '@mui/styles'
import { SideBar } from '../components/UserSidebar'
import { sendRequest } from '../Request';
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
const styles = (theme) => ({})

const BookingHistory = (props) => {
  const listingId = useParams().id
  const [pastBookings, setPastBookings] = React.useState('')
  const [bookings, setBookings] = React.useState('')
  const [listingDetail, setListingDetail] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [newBookingPage, setBookingPage] = React.useState(0)
  const [rowsPerBookingPage, setRowsPerBookingPage] = React.useState(5)
  const [perviousBookingPage, setPastBookingPage] = React.useState(0)
  const [itemsPerPage, setItemsPerPage] = React.useState(5)

  // Fetch data for current and past bookings
  const fetchData = async () => {
    try {
      const bookingsData = await sendRequest('bookings', 'GET');
      const presentBookings = bookingsData.bookings.filter(
        (booking) => booking.listingId === listingId && booking.status === 'pending'
      );
      const previousBookings = bookingsData.bookings.filter(
        (booking) => booking.listingId === listingId && booking.status !== 'pending'
      );
      setBookings(presentBookings);
      setPastBookings(previousBookings);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch listing information
  const fetchListingInfo = async () => {
    try {
      const data = await sendRequest(`listings/${listingId}`, 'GET');
      setListingDetail(data.listing);
    } catch (error) {
      console.error('Error fetching listing info:', error);
    }
  };

  useEffect(() => {
    fetchData()
    fetchListingInfo()
  }, [])

  // Helper function to check if a past booking occurred in the last year=
  const isPastBookingInLastYear = (pastBooking) => {
    const lastYear = new Date(); // Include lastYear in the scope
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const startDate = new Date(pastBooking.dateRange.startdate);
    return pastBooking.status === 'accepted' && startDate >= lastYear;
  };

  // Calculate total profit for past bookings in the last year
  const calculateTotalProfitLastYear = () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    return pastBookings
      .filter(isPastBookingInLastYear)
      .reduce((totalProfit, pastBooking) => totalProfit + pastBooking.totalPrice, 0);
  };

  // Helper function to calculate days booked for a past booking
  const calculateDaysBooked = (pastBooking) => {
    const startDate = new Date(pastBooking.dateRange.startdate);
    const endDate = new Date(pastBooking.dateRange.enddate);
    return (endDate - startDate) / (1000 * 3600 * 24);
  };

  // Calculate total days booked for past bookings in the last year
  const calculateTotalDaysBookedLastYear = () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    return pastBookings
      .filter(isPastBookingInLastYear)
      .reduce((totalDaysBooked, pastBooking) => {
        const daysBooked = calculateDaysBooked(pastBooking);
        return totalDaysBooked + daysBooked;
      }, 0);
  };

  const formatDate = (isoString) => isoString.replace(/T.*/, '').split('-').reverse().join('-');

  // Function to calculate the total number of days since a listing was posted
  const totalDaysOnline = () => {
    const postedOn = listingDetail.postedOn
    if (!postedOn) {
      return 0
    }
    const dateNow = new Date()
    const postedOnDate = new Date(postedOn)
    const totalDays = Math.ceil((dateNow - postedOnDate) / (1000 * 3600 * 24))
    return totalDays
  }

  // Event handler for changing the active page in the booking pagination
  const handleChangeBookingPage = (e, newPage) => {
    setBookingPage(newPage)
  }

  // Event handler for changing the number of rows per page in the booking pagination
  const handleChangeRowsPerBookingPage = (e) => {
    setRowsPerBookingPage(parseInt(e.target.value, 10))
    setBookingPage(0)
  }

  // Event handler for changing the active page in the past booking pagination
  const handleChangePastBookingPage = (e, newPage) => {
    setPastBookingPage(newPage)
  }

  // Event handler for changing the number of rows per page in the past booking pagination
  const handleChangeRowsPerPastBookingPage = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10))
    setPastBookingPage(0)
  }
  // Function to update the status of a booking (accept or decline)
  const updateBookingStatus = (bookingId, action) => {
    sendRequest(`bookings/${action}/${bookingId}`, 'PUT').then(() => {
      const currentBookings = [...bookings];
      const getIndex = currentBookings.findIndex((obj) => obj.id === bookingId);

      const currentPastBookings = [...pastBookings];
      const selectedBooking = { ...currentBookings[getIndex] };
      selectedBooking.status = action === 'accept' ? 'accepted' : 'declined';
      currentPastBookings.push(selectedBooking);

      setBookings((current) => current.filter((currentBooking) => currentBooking.id !== bookingId));
      setPastBookings(currentPastBookings);
    });
  }
  // Function to calculate the number of empty rows to be displayed on the current page
  const calculateEmptyRows = (rowsPerPage, data, page) => {
    return rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  };

  const LoadingUI = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );

  if (!bookings || !listingDetail || !pastBookings) {
    return <LoadingUI />;
  }

  const GoHomeButton = () => {
    return (
      <Box sx={{ flex: '0.5' }}>
        <Button
          id="goHomeButton"
          sx={{
            fontSize: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF5A5F', // Set text color
          }}
          onClick={() => {
            window.location.href = '/';
          }}
        >
          <HomeIcon sx={{ height: '30px', width: '30px', mb: 1, color: '#FF5A5F' }} /> {/* Set icon color */}
          <Typography sx={{ fontSize: '20px', display: { xs: 'none', sm: 'none', md: 'block' } }}>
            Go Home
          </Typography>
        </Button>
      </Box>
    );
  };

  const tableCellStyles = {
    display: { xs: 'none', sm: 'table-cell' },
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#484848',
    backgroundColor: '#DCDCDC',
  };

  return (
    <Box>
      <Box
        sx={{ border: '1px solid rgb(230, 230, 230)', padding: '30px' }}
        justifyContent="space-between"
        alignItems="center"
        display="flex"
      >
        <GoHomeButton />

        <Typography
        sx={{ flex: '2', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}
        component="h1"
        variant="h5"
      >
         Your Listing Insights
      </Typography>

        <Box sx={{ flex: '0.5', marginTop: '20px' }}>
          <SideBar />
        </Box>
      </Box>

      <Box sx={{ width: '100%', marginTop: '40px' }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '30px', color: '#333' }}
        >
          Bookings and Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} key={'listingOnline'}>
            <Card sx={{ textAlign: 'center', height: '100%', backgroundColor: '#F6F6F7', borderRadius: '8px' }}>
              <CardHeader
                title="Total Days Online"
                titleTypographyProps={{ variant: 'h6', color: '#333' }}
                sx={{ borderBottom: '1px solid #E1E1E1', backgroundColor: '#F6F6F7' }}
              />
              <CardContent sx={{ paddingTop: '20px' }}>
                <Typography component="h2" variant="h6" color="#333">
                  {totalDaysOnline()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} key={'listingBookedDays'}>
            <Card sx={{ textAlign: 'center', height: '100%', backgroundColor: '#F6F6F7', borderRadius: '8px' }}>
              <CardHeader
                title="Total Days Booked"
                titleTypographyProps={{ variant: 'h6', color: '#333' }}
                sx={{ borderBottom: '1px solid #E1E1E1', backgroundColor: '#F6F6F7' }}
              />
              <CardContent sx={{ paddingTop: '20px' }}>
                <Typography component="h2" variant="h6" color="#333">
                  {calculateTotalDaysBookedLastYear()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} key={'listingProfit'}>
            <Card sx={{ textAlign: 'center', height: '100%', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>

              <CardHeader
                title="Total Profit"
                titleTypographyProps={{ variant: 'h6', color: '#FF5A5F' }}
                sx={{ borderBottom: '1px solid #FF385C', backgroundColor: '#FEE2E2' }}
              />
              <CardContent sx={{ paddingTop: '20px' }}>
                <Typography component="h2" variant="h5" color="#00A699" >
                  ${calculateTotalProfitLastYear()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TableContainer sx={{ marginTop: '50px' }} component={Paper}>
          <Table aria-label="BookedTable">
            <TableHead>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="openBox"
                    size="small"
                    onClick={() => setOpen(!open)}
                    sx={{ color: '#222', transition: 'transform 0.3s ease' }}
                  >
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #f0f0f0',
                    color: '#333', // Adjust text color as needed
                  }}
                  component="th"
                  scope="row"
                >
                  View Past Bookings
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="openBox"
                    size="large"
                    onClick={() => setOpen(!open)}
                    sx={{ color: '#222', transition: 'transform 0.3s ease' }}
                  >
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
            <TableRow>
              <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            display: { sm: 'none', md: 'table-cell' },
                            fontWeight: 'bold',
                            color: '#484848',
                            backgroundColor: '#DCDCDC',
                          }}
                        >
                          Requester
                        </TableCell>
                        <TableCell
                          sx={tableCellStyles}
                        >
                          Start Date
                        </TableCell>
                        <TableCell
                          sx={tableCellStyles}
                        >
                          End Date
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={tableCellStyles}
                        >
                          Price
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={tableCellStyles}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pastBookings
                        .slice(
                          perviousBookingPage * itemsPerPage,
                          perviousBookingPage * itemsPerPage +
                            itemsPerPage
                        )
                        .map((row) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              backgroundColor:
                                row.status === 'accept' ? '#ffffff' : '#ffffff',
                            }}
                          >
                            <TableCell
                              sx={{
                                display: { sm: 'none', md: 'table-cell' },
                                color: '#555',
                              }}
                              component="th"
                              scope="row"
                            >
                              {row.owner}
                            </TableCell>
                            <TableCell
                              sx={{
                                display: { xs: 'none', sm: 'table-cell' },
                                textAlign: 'right',
                                color: '#555',
                              }}
                            >
                              {formatDate(row.dateRange.startdate)}
                            </TableCell>
                            <TableCell
                              sx={{
                                display: { xs: 'none', sm: 'table-cell' },
                                textAlign: 'right',
                                color: '#555',
                              }}
                            >
                              {formatDate(row.dateRange.enddate)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: '#555',
                              }}
                            >
                              {row.totalPrice}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: row.status === 'accepted' ? '#4CAF50' : '#F44336',
                                fontWeight: 'bold',
                              }}
                            >
                              {row.status}
                            </TableCell>
                          </TableRow>
                        ))}
                      {perviousBookingPage !== 0 && calculateEmptyRows > 0 && (
                        <TableRow sx={{ height: 53 * calculateEmptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={pastBookings.length}
                    page={perviousBookingPage}
                    onPageChange={handleChangePastBookingPage}
                    rowsPerPage={itemsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPastBookingPage}
                  />
                </Collapse>
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ width: '100%', marginTop: '40px' }}>
      <Typography
          component="h1"
          variant="h5"
          sx={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '30px', color: '#333' }}
        >
    Pending Bookings
  </Typography>
  <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
    <Table aria-label="bookingTable">
      <TableHead>
        <TableRow>
          <TableCell sx={{
            display: { xs: 'none', sm: 'table-cell' },
            textAlign: 'left',
            fontWeight: 'bold',
            color: '#484848',
            backgroundColor: '#DCDCDC',
          }}>
            Requester
          </TableCell>
          <TableCell align="center" sx={tableCellStyles}>
            Start Date
          </TableCell>
          <TableCell align="center" sx={tableCellStyles}>
            End Date
          </TableCell>
          <TableCell align="center" sx={tableCellStyles}>
            Price
          </TableCell>
          <TableCell align="center" sx={tableCellStyles}>
            Accept / Reject
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {bookings
          .slice(
            newBookingPage * rowsPerBookingPage,
            newBookingPage * rowsPerBookingPage + rowsPerBookingPage
          )
          .map((row) => (
            <TableRow
              key={row.id}
              sx={{
                backgroundColor: '#ffffff',
              }}
            >
              <TableCell sx={{ color: '#555' }} component="th" scope="row">
                {row.owner}
              </TableCell>
              <TableCell align="right" sx={{ color: '#555' }}>
                {formatDate(row.dateRange.startdate)}
              </TableCell>
              <TableCell align="right" sx={{ color: '#555' }}>
                {formatDate(row.dateRange.enddate)}
              </TableCell>
              <TableCell align="right" sx={{ color: '#555' }}>
                {row.totalPrice}
              </TableCell>
              <TableCell align="right">
                <Button
                  name="accept"
                  color="success"
                  onClick={() => updateBookingStatus(row.id, 'accept')}
                >
                  Accept
                </Button>
                <span>/</span>
                <Button
                  color="error"
                  onClick={() => updateBookingStatus(row.id, 'decline')}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        {newBookingPage !== 0 && calculateEmptyRows > 0 && (
          <TableRow sx={{ height: 70 * calculateEmptyRows }}>
            <TableCell colSpan={5} />
          </TableRow>
        )}
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={[5, 10, 20]}
      component="div"
      count={bookings.length}
      page={newBookingPage}
      onPageChange={handleChangeBookingPage}
      rowsPerPage={rowsPerBookingPage}
      onRowsPerPageChange={handleChangeRowsPerBookingPage}
    />
  </TableContainer>
      </Box>
    </Box>
  )
}

export default withStyles(styles)(BookingHistory)
