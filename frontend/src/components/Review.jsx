import React, { useEffect, useState } from 'react'
import {
  Grid,
  Rating,
  Divider,
  Dialog,
  DialogContent,
  ListItem,
  List,
  IconButton,
  DialogTitle
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import StarIcon from '@mui/icons-material/Star';

const Review = (props) => {
  const {
    reviews,
    star = 'all',
    onClose,
    visible,
    averageRating
  } = props;

  const [newReviews, setNewReviews] = useState([])

  // Use effect to filter reviews based on the specified star rating or show all reviews
  useEffect(() => {
    if (star === 'all') {
      setNewReviews(reviews)
    } else {
      const list = reviews.filter(i => `${i.rating}` === star)
      setNewReviews(list)
    }
  }, [])

  return (
    <Dialog
      open={visible}
      onClose={onClose}
    >
      <DialogTitle style={{ padding: 0 }}>
        <IconButton aria-label="delete" onClick={onClose}>
          <ClearIcon sx={{ fontSize: '20px' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: '550px', maxHeight: '300px', overflow: 'hidden' }}>
        <Grid sx={{ height: '50px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <StarIcon sx={{ marginRight: '5px' }} /><span>{star === 'all' ? averageRating : star}  |  {newReviews.length} reviews</span>
        </Grid>
        <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '240px', overflow: 'auto' }}>
          {
            newReviews.map((review, index) => (
              <div key={index}>
                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                  <Grid sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Grid>{review.anonymity ? 'anonymous' : review.email}</Grid>
                    <Rating readOnly value={review.rating} sx={{ fontSize: '1rem' }} />
                  </Grid>
                  <Grid sx={{ color: '#aaaaaa', fontSize: '12px', margin: '5px 0' }}>{review.date}</Grid>
                  <Grid sx={{ fontSize: '1.1rem', marginBottom: '5px' }}>{review.review}</Grid>
                </ListItem>
                <Divider />
              </div>
            ))
          }
        </List>
      </DialogContent>
    </Dialog>
  )
}

export default Review;
