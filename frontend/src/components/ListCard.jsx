import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player';
import {
  Card,
  CardHeader,
  Button,
  IconButton,
  CardMedia,
  CardActions,
  CardContent,
  Grid,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HotelIcon from '@mui/icons-material/Hotel';
import AirlineSeatLegroomNormalIcon from '@mui/icons-material/AirlineSeatLegroomNormal';
import dayjs from 'dayjs';
import { sendRequest } from '../Request';
import defaultImg from '../static/img/home_init.png'
import CustomRating from './CustomRating';
import Review from './Review';

let time = null;

const ListCard = (props) => {
  const {
    id,
    title,
    thumbnail,
    price,
    reviews,
    published,
    metadata,
    getListings,
    setErrorAlertVis,
    homepage,
    setAlertContent,
    setAlertType,
    dateRange,
  } = props;

  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [averageRating, setAverageRating] = useState(0)
  const [reviewModalVis, setReviewModalVis] = useState(false)
  const [star, setStar] = useState('all')
  // useEffect to calculate and set average rating whenever reviews change
  useEffect(() => {
    let rating = 0
    reviews.forEach((i) => {
      rating += (i.rating - 0)
    })
    setAverageRating(Math.floor(reviews.length ? rating / reviews.length : 0))
  }, [reviews])
  // Function to display alert messages with specified content and type
  const showTips = (content, type) => {
    setAlertContent(content)
    setAlertType(type)

    // Clear previous timeout and set a new one to hide the alert after 3000 milliseconds (3 seconds)
    clearTimeout(time)
    setErrorAlertVis(true)
    time = setTimeout(() => {
      setErrorAlertVis(false)
    }, 3000)
  }
  // Function to close the main dialog
  const handleClose = () => {
    setDialogOpen(false);
  };

  // Function to close the publish dialog
  const publishDialogClose = () => {
    setPublishDialogOpen(false);
  }

  // Function to handle the deletion of a listing
  const handleDelete = () => {
    sendRequest(`listings/${id}`, 'DELETE').then((res) => {
      getListings()
    })
  }

  // Function to handle the editing of a listing
  const handleEdit = (event) => {
    event.stopPropagation()
    if (published) {
      showTips('Cannot edit published listings!', 'error')
    } else {
      navigate(`/createList?id=${id}`)
    }
  }

  // Function to handle publishing or unpublishing a listing
  const handlePublish = (event) => {
    event.stopPropagation()
    if (published) {
      sendRequest(`listings/unpublish/${id}`, 'PUT').then(() => {
        showTips('Successfully unpublished!', 'success')
        getListings()
      })
    } else {
      setPublishDialogOpen(true);
    }
  }

  // Function to handle the publish button click within the publish dialog
  const handlePublishClick = () => {
    if (!checkInDate || !checkOutDate) {
      showTips('Start and end times must be filled in', 'error')
    } else if (dayjs(checkInDate) - dayjs(checkOutDate) > 0) {
      showTips('The start date cannot be greater than the end date!', 'error')
    } else {
      const param = {
        availability: [{ start: checkInDate, end: checkOutDate }]
      }
      sendRequest(`listings/publish/${id}`, 'PUT', param).then(() => {
        setPublishDialogOpen(false)
        showTips('Successfully published!', 'success')
        getListings()
      })
    }
  }

  return (
      <>
        <Card
          key={id} sx={{ width: 345, minWidth: 345, margin: '15px', height: 'fit-content' }}
        >
          <CardHeader
            title={homepage ? <span style={{ cursor: 'pointer' }}>{title}</span> : title}
            action={
              homepage
                ? null
                : <>
                <IconButton aria-label="edit" onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={(event) => {
                    event.stopPropagation()
                    setDialogOpen(true)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
            onClick={() => { homepage && navigate(`listings/${id}/${dateRange}`) }}
          />
          <Grid item sx={{ width: '100%', height: 200 }}>
          {
            thumbnail && !(typeof thumbnail === 'object')
              ? <ReactPlayer url={thumbnail} width="100%" height="100%" data-testid="react-player" />
              : <CardMedia
            component="img"
            height="194"
            image={thumbnail[0] || defaultImg}
            alt="home img"
            onClick={() => { homepage && navigate(`listings/${id}/${dateRange}`) }}
          />
          }
          </Grid>
          <CardContent>
            <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid
                onClick={() => { homepage && navigate(`listings/${id}/${dateRange}`) }}
                sx={{ cursor: homepage ? 'pointer' : 'unset' }}
              >
                {metadata.propertyType}
              </Grid>
              <CustomRating
                reviews={reviews}
                onClick={(star) => {
                  setReviewModalVis(true)
                  setStar(star)
                }}
              />
            </Grid>
            <Grid
              onClick={() => { homepage && navigate(`listings/${id}/${dateRange}`) }}
              sx={{ display: 'flex', justifyContent: 'space-between', cursor: homepage ? 'pointer' : 'unset' }}
            >
              <Grid>
                {metadata.numBeds && <span>{metadata.numBeds}<IconButton sx={{ color: '#000', padding: '2px' }}><HotelIcon /></IconButton></span>}
                {metadata.numBaths && <span>{metadata.numBaths}<IconButton sx={{ color: '#000', padding: '2px' }}><AirlineSeatLegroomNormalIcon /></IconButton></span>}
              </Grid>
              <Grid>{reviews.length} Reviews</Grid>
            </Grid>
            <Grid
              onClick={() => { homepage && navigate(`listings/${id}/${dateRange}`) }}
              sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', cursor: homepage ? 'pointer' : 'unset' }}
            >
              <Grid sx={{ textDecoration: 'underline' }}>
                <span style={{ fontWeight: '600' }}>{`$${price} AUD `}</span>
                <span>per night</span>
              </Grid>
              {
                homepage ? null : <Grid><Button variant="text" onClick={handlePublish} >{published ? 'UNPUBLISH' : 'PUBLISH'}</Button></Grid>
              }
            </Grid>
          </CardContent>
          {
            homepage
              ? null
              : <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'center', padding: '2px' }}>
            <Button variant="text" sx={{ width: '100%' }} onClick={() => {
              window.location.href = `/BookingHistory/${id}`
            }}>VIEW BOOKING HISTORY</Button>
          </CardActions>
          }

        </Card>
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title1"
        >
          <DialogTitle id="alert-dialog-title1">
            {`Are you sure to delete ${title} ?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={publishDialogOpen}
          onClose={publishDialogClose}
          aria-labelledby="alert-dialog-title2"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title2">
            Set availability
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            <Grid sx={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="checkInDate"
                  label="START"
                  sx={{ width: '265px' }}
                  onChange={(e) => setCheckInDate(dayjs(e).format('MM/DD/YYYY'))}
                />
              </LocalizationProvider>
              <div style={{ width: '15px', textAlign: 'center' }}>-</div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="checkOutDate"
                  label="END"
                  sx={{ width: '265px' }}
                  onChange={(e) => setCheckOutDate(dayjs(e).format('MM/DD/YYYY')) }
                />
              </LocalizationProvider>
            </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={publishDialogClose}>Cancel</Button>
            <Button onClick={handlePublishClick}>Publish</Button>
          </DialogActions>
        </Dialog>
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
  )
}

export default ListCard;
