import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  CardMedia,
  Rating,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Collapse,
  ListItem,
  List
} from '@mui/material';
import Card from '@mui/material/Card'
import Grid2 from '@mui/material/Unstable_Grid2';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import CardContent from '@mui/material/CardContent';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CreateIcon from '@mui/icons-material/Create';
import ReviewsIcon from '@mui/icons-material/Reviews';
import CloseIcon from '@mui/icons-material/Close';
import { sendRequest } from '../Request';
import CustomRating from '../components/CustomRating';
import Review from '../components/Review';
import defaultImg from '../static/img/home_init.png'
import dayjs from 'dayjs';
import EnhancedDateRangePicker from '../components/CustomDatePicker'
import SideBar from '../components/UserSidebar'
const ListingDetail = () => {
  const [listing, setListing] = useState({})
  const navigate = useNavigate()
  const [showImgIndex, setImgIndex] = useState(0)
  // Booking needed Constant
  const listingId = useParams().listingId;
  const dateRange = useParams().dateRange;
  const [bookingSuccess, setBookingSuccess] = React.useState(false)
  const [newBid, setBid] = React.useState(0)
  const [isBooked, setIsBooked] = React.useState(false)
  const [bookingStatus, setBookingStatus] = React.useState(false)
  const [bookedDates, setBookedDates] = React.useState({
    start: new Date(),
    end: new Date(),
  })
  // eslint-disable-next-line no-unused-vars
  const [bookingId, setBookingId] = useState('')
  const [addCommentOpen, setAddCommentModalStatus] = useState(false);
  const [reviewInfo, setReviewInfo] = useState({})
  const [reviewModalVis, setReviewModalVis] = useState(false)
  const [star, setStar] = useState('all')
  const [averageRating, setAverageRating] = useState(0)
  const [reviews, setReviews] = useState([])
  const [reviewWarningAlert, setReviewWarningAlert] = useState(false)

  useEffect(() => {
    listingId && getListing()
  }, [listingId])

  // Function to get listing details and update state
  const getListing = useCallback(() => {
    listingId && sendRequest(`listings/${listingId}`, 'GET').then((res) => {
      setListing(res.listing)
      setReviews(res.listing.reviews.reverse())
      let rating = 0
      res.listing.reviews.forEach((i) => {
        rating += (i.rating - 0)
      })
      // setAverageRating(res.listing.reviews.length ? rating / res.listing.reviews.length : 0)
      const average = rating / res.listing.reviews.length;
      const averageRounded = +average.toFixed(2); // Round to two decimal places and convert to a number
      setAverageRating(res.listing.reviews.length ? averageRounded : 0);
    })
  }, [listingId])

  // useEffect to fetch and update booking status when isBooked changes
  useEffect(() => {
    updateBookingStatus()
  }, [isBooked]);

  // Function to set image index to the left
  const setImgIndexLeft = useCallback(() => {
    setImgIndex(showImgIndex === 0 ? 0 : (showImgIndex - 1))
  }, [showImgIndex])

  // Function to set image index to the right
  const setImgIndexRight = useCallback(() => {
    setImgIndex(showImgIndex === (listing.thumbnail.length - 1) ? showImgIndex : (showImgIndex + 1))
  }, [showImgIndex, listing])

  // Function to convert a date to ISO format
  const adjustDate = (current) => {
    const adjusted = new Date(current);
    adjusted.setMinutes(adjusted.getMinutes() - adjusted.getTimezoneOffset());
    return adjusted.toISOString();
  };

  // Function to calculate the total price of the booking
  const calculateTotalPrice = (start, end, price) => {
    // Calculate the duration in days, ensuring it's at least 1 day
    const duration = dayjs(end).diff(dayjs(start), 'day') > 0 ? dayjs(end).diff(dayjs(start), 'day') : 1;
    return duration * parseInt(price);
  };

  // Function to handle date changes
  // For booking
  const chanegDateStart = (date) => {
    const ISODate = date.toISOString()
    const newBooked = bookedDates
    newBooked.start = ISODate
    setBookedDates(newBooked)
  }
  // Function to handle end date change
  const chanegDateEnd = (date) => {
    const ISODate = date.toISOString()
    const newBooked = bookedDates
    newBooked.end = ISODate
    setBookedDates(newBooked)
  }

  const handleBooking = async () => {
    try {
      const { start, end } = bookedDates;
      // Calculate the total price of the booking
      const total = calculateTotalPrice(start, end, String(listing.price));

      const correctStart = adjustDate(start);
      const correctEnd = adjustDate(end);

      const request = await sendRequest(`bookings/new/${listingId}`, 'POST', {
        dateRange: {
          startdate: correctStart,
          enddate: correctEnd,
        },
        totalPrice: total,
      });
      console.log(request)

      // popup showing booking status
      setBid(request.bookingId);
      setBookingSuccess(true);
      setIsBooked(true)
    } catch (error) {
      if (error.response) {
        console.error('Server responded with:', error.response.status);
        console.error('Server response data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from the server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
      }
    }
  }
  // Function to update booking status
  const updateBookingStatus = async () => {
    try {
      if (localStorage.getItem('email')) {
        const resp = await sendRequest('bookings', 'GET');
        const bookings = resp.bookings;

        const userBookings = bookings.filter((b) => (
          b.owner === localStorage.getItem('email') &&
          parseInt(b.listingId) === parseInt(listingId)
        ));

        if (userBookings.length > 0) {
          const { status, id } = userBookings[0];
          setIsBooked(true);
          setBookingStatus(status);
          setBookingId(id)
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const ShowBookingStatus = useCallback(() => {
    if (!localStorage.getItem('token')) {
      return null;
    }

    const bookingText = isBooked
      ? `Your booking status is ${bookingStatus}`
      : 'You have not booked this property yet';
    return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography>{bookingText}</Typography>
    </Box>
    );
  }, [newBid, isBooked, bookingStatus]);

  // Function to calculate the price and price label
  const calculatePriceAndLabel = (listing, dateRange) => {
    let price = listing.price;

    let priceLabel = 'per night';
    if (dateRange !== 'false') {
      const days = Math.abs(parseInt(dateRange));
      price *= days;
      priceLabel = `for a total of ${days} day${days !== 1 ? 's' : ''}`;
    }

    return { price, priceLabel };
  };

  const BookingSection = () => {
    // Calculate the price and price label
    const { price, priceLabel } = calculatePriceAndLabel(listing, dateRange);

    // Define the BookingArea component
    const BookingArea = () => {
      const isAuthenticated = !!localStorage.getItem('token');
      // check if the user is authenticated
      if (!isAuthenticated) {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography>
              Want to book this property? Login or sign up first!
            </Typography>
          </Box>
        );
      }
      return (
        <Box>
          <Grid2 container spacing={2} justifyContent="center">
            <Grid2
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <EnhancedDateRangePicker
                dateRange={{ start: null, end: null }}
                chanegDateStart={chanegDateStart}
                chanegDateEnd={chanegDateEnd}
                availability={listing.availability}
              />
            </Grid2>
            {bookingSuccess && (
              <Alert
                onClose={() => {
                  setBookingSuccess(false);
                }}
                severity="success"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '80%', // Adjust the width as needed
                  margin: 'auto', // Center the alert
                  backgroundColor: '#f6ffed', // Light green background
                  border: '1px solid #b7eb8f', // Border color
                  borderRadius: '8px', // Rounded corners
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // Box shadow
                  padding: '20px', // Padding
                  position: 'relative', // Make the position relative
                }}
              >
                <AlertTitle
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#52c41a', // Title color
                  }}
                >
                  Booking Successful!
                </AlertTitle>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    marginBottom: '16px',
                    textAlign: 'center',
                    color: '#595959', // Text color
                  }}
                >
                  Your booking ID is #{newBid}. Your booking status will change
                  once the host processes your booking. Thank you for choosing us!
                </Typography>
              </Alert>
            )}

            <Grid2
              xs={12}
              md={8}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Button
                name="submit"
                fullwidth
                variant="contained"
                sx={{
                  width: '80%',
                  marginTop: '20px',
                  backgroundColor: '#FF5A5F', // Green button
                  color: '#ffffff', // Button text color
                  '&:hover': {
                    backgroundColor: '#389e0d', // Darker green on hover
                  },
                }}
                onClick={handleBooking}
              >
                Book
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      );
    }

    return (
      <Grid2 xs={12} md={8}>
        <Card
          fullwidth
          sx={{
            minHeight: '40vh',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  color: '#FF5A5F',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                ${price} {priceLabel}
              </Typography>
            </Box>
            <Divider sx={{ m: 2 }}>Make a Booking</Divider>
            <BookingArea />
            {localStorage.getItem('token') && (
              <Divider sx={{ m: 2 }}>Booking Status</Divider>
            )}
            <ShowBookingStatus />
          </CardContent>
        </Card>
      </Grid2>
    );
  }

  const addCommentClose = () => {
    setAddCommentModalStatus(false);
  }

  const handleAddComment = useCallback(() => {
    if (reviewInfo.review && reviewInfo.rating) {
      const param = {
        review: {
          ...reviewInfo,
          anonymity: reviewInfo.anonymity || false,
          email: localStorage.getItem('email'),
          date: dayjs(new Date()).format('MM-DD-YYYY')
        }
      }
      listingId && bookingId && sendRequest(`listings/${listingId}/review/${bookingId}`, 'PUT', param).then((res) => {
        addCommentClose()
        getListing()
      })
    } else {
      alert('Please fill in comments and ratings.')
    }
  }, [reviewInfo])

  return (
    <>
      <Box sx={{ borderBottom: '1px solid rgb(192,192,192)', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#1880f5' }}>
        <Typography
          sx={{ cursor: 'pointer', display: 'flex', color: '#FF5A5F' }}
          onClick={() => navigate('/')}
        >
          <HomeIcon />
          GO HOME
        </Typography>
        <Box>
        <SideBar />
      </Box>
      </Box>

      <Container fixed sx={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid sx={{ fontSize: '30px' }}>
          <h1>{listing.title}</h1>
        </Grid>
        <Grid sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <CustomRating
            reviews={reviews}
            onClick={(star) => {
              setReviewModalVis(true)
              setStar(star)
            }}
          />
          |
          <Grid
            sx={{ margin: '0 10px' }}
            onClick={() => {
              setReviewModalVis(true)
              setStar('all')
            }}
          >
            <span style={{ textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer' }}>View all {reviews.length} reviews</span>
          </Grid>
          |
          <Grid sx={{ margin: '0 10px' }}><span>{listing.address?.street}, {listing.address?.city}, {listing.address?.city} {listing.address?.postcode}</span></Grid>
        </Grid>
        <Grid sx={{ maxHeight: 400, maxWidth: 600, margin: '30px 0' }}>
        {
          listing.thumbnail && !(typeof listing.thumbnail === 'object')
            ? <ReactPlayer url={listing.thumbnail} width="100%" height="100%" />
            : <Grid>
                <CardMedia
                  component="img"
                  height="194"
                  image={(listing.thumbnail && listing.thumbnail[showImgIndex]) || defaultImg}
                  alt="home img"
                />
                <Grid sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', color: '#a3a3a3', alignItems: 'center' }}>
                  <ChevronLeftIcon sx={{ cursor: 'pointer' }} onClick={setImgIndexLeft} />
                  <Grid>
                    {
                      (listing.thumbnail || []).map((i, index) => (
                        <span key={Math.random()} style={{ color: showImgIndex === index ? '#00a1c3' : '#a3a3a3', fontSize: '25px' }}>•</span>
                      ))
                    }
                  </Grid>
                  <ChevronRightIcon sx={{ cursor: 'pointer' }} onClick={setImgIndexRight} />
                  <></>
                </Grid>
              </Grid>
        }
        </Grid>
        <Grid sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Grid sx={{ margin: '0 10px' }}><span>{listing.metadata?.propertyType}</span></Grid>
          |
          <Grid sx={{ margin: '0 10px' }}><span>{listing.metadata?.numBedrooms} bedrooms</span></Grid>
          |
          <Grid sx={{ margin: '0 10px' }}><span>{listing.metadata?.numBeds} beds</span></Grid>
          |
          <Grid sx={{ margin: '0 10px' }}><span>{listing.metadata?.numBaths} bathrooms</span></Grid>
        </Grid>
        <Grid sx={{ margin: '20px' }}><span>Amenities: {listing.metadata?.amenities}</span></Grid>
      </Container>

      <BookingSection sx={{ width: '80vw' }}/>

      <Grid sx={{ margin: '20px', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<CreateIcon />}
            sx={{ marginRight: '30px', display: localStorage.getItem('email') ? 'flex' : 'none' }}
            onClick={() => {
              if (bookingStatus === 'accepted') {
                setAddCommentModalStatus(true)
              } else {
                setReviewWarningAlert(true)
              }
            }}
          >
            Write a comment
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReviewsIcon />}
            onClick={() => {
              setReviewModalVis(true)
              setStar('all')
            }}
          >
            View all reviews
          </Button>
          <Dialog
            open={addCommentOpen}
            onClose={addCommentClose}
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              <Grid sx={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                  id="review"
                  label="review"
                  multiline
                  rows={3}
                  sx={{ width: '350px' }}
                  placeholder='Write your comments here'
                  onChange={(event) => {
                    setReviewInfo({
                      ...reviewInfo,
                      review: event.target.value
                    });
                  }}
                />
              </Grid>
              <Grid sx={{ display: 'flex' }}>
                <span>Rate your stay:</span>
                <Rating
                  name="rating"
                  onChange={(event, newValue) => {
                    setReviewInfo({
                      ...reviewInfo,
                      rating: newValue
                    });
                  }}
                />
              </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', padding: '5px 24px' }}>
              <Grid>
                <FormControlLabel
                  control={<Checkbox
                    id="anonymity"
                    onChange={(event, newValue) => {
                      setReviewInfo({
                        ...reviewInfo,
                        anonymity: newValue
                      });
                    }}/>} label="anonymity" />
              </Grid>
              <Grid>
                <Button onClick={addCommentClose}>CANCEL</Button>
                <Button onClick={handleAddComment}>SUBMIT</Button>
              </Grid>
            </DialogActions>
          </Dialog>
      </Grid>
      <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
        <Collapse in={reviewWarningAlert}>
          <Alert
            severity="warning"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setReviewWarningAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2, width: '500px' }}
          >
            You need to make a reservation before you can review
          </Alert>
        </Collapse>
      </Grid>
      <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Grid sx={{ width: '500px' }}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
              reviews.slice(0, 3).map((review) => (
                <>
                  <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                    <Grid sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <Grid>{review.anonymity ? 'anonymous' : review.email}</Grid>
                      <Rating readOnly value={review.rating} sx={{ fontSize: '1rem' }} />
                    </Grid>
                    <Grid sx={{ fontSize: '1.1rem', marginBottom: '10px' }}>{review.review}</Grid>
                    <Grid sx={{ color: '#aaaaaa' }}>{review.date}</Grid>
                  </ListItem>
                  <Divider />
                </>
              ))
            }
            </List>
          </Grid>
        </Grid>
      <Grid>
        {
          reviewModalVis
            ? <Review
          visible={reviewModalVis}
          reviews={reviews}
          onClose={() => setReviewModalVis(false)}
          star={star}
          averageRating={averageRating}
        />
            : null
        }
      </Grid>
    </>
  );
}

export default ListingDetail
