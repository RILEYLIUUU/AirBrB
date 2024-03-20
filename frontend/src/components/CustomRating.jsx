import React, { useEffect, useMemo, useState } from 'react'
import {
  Grid,
  Rating,
  Popover,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PopoverItem = (props) => {
  const { title, percentage, onClick } = props
  return (
    <Grid sx={{ display: 'flex', margin: '12px 0', cursor: 'pointer' }} onClick={onClick}>
      <div style={{ width: '15%', marginRight: '10px' }}>{title}</div>
      <div style={{ width: '70%', display: 'flex', borderRadius: '3px' }}>
        <div style={{ width: '100%', borderRadius: '3px', background: `linear-gradient(to right, #3f9af4 ${percentage}%, #a7caed 0%)` }} />
      </div>
      <div style={{ width: '15%', marginLeft: '10px', overflow: 'hidden' }}>{percentage}%</div>
    </Grid>
  )
}
// CustomRating component receives reviews and onClick as props
const CustomRating = (props) => {
  const {
    reviews,
    onClick
  } = props
  const [anchorEl, setAnchorEl] = useState(null);
  const [averageRating, setAverageRating] = useState(0)
  const open = Boolean(anchorEl);

  // Calculate average rating based on the reviews when reviews change
  useEffect(() => {
    let rating = 0

    // Calculate the sum of ratings
    reviews.forEach((i) => {
      rating += (i.rating - 0)
    })
    setAverageRating(Math.floor(reviews.length ? rating / reviews.length : 0))
  }, [reviews])

  // Open the popover when the mouse hovers over the rating
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the popover when the mouse moves away
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Calculate the percentage of stars at a given level based on reviews
  const starPercentage = (level) => useMemo(() => reviews.length ? Math.floor(reviews.filter((i) => `${i.rating}` === level).length / reviews.length * 100) : 0, [reviews])

  return (
    <>
      <Grid
        onClick={handlePopoverOpen}
        onMouseEnter={handlePopoverOpen}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '5px', color: '#878787', marginRight: '10px' }}
      >
        <Rating
          name="read-only"
          readOnly
          sx={{ fontSize: '20px' }}
          value={averageRating}
        />
        <ExpandMoreIcon />
      </Grid>
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Grid
          sx={{ width: '350px', height: '165px', padding: '0 15px' }}
          onMouseLeave={handlePopoverClose}
        >
          <PopoverItem
            percentage={starPercentage('5')}
            title="5 star"
            onClick={(e) => {
              e.stopPropagation()
              onClick('5')
            }}
          />
          <PopoverItem
            percentage={starPercentage('4')}
            title="4 star"
            onClick={() => onClick('4')}
          />
          <PopoverItem
            percentage={starPercentage('3')}
            title="3 star"
            onClick={() => onClick('3')}
          />
          <PopoverItem
            percentage={starPercentage('2')}
            title="2 star"
            onClick={() => onClick('2')}
          />
          <PopoverItem
            percentage={starPercentage('1')}
            title="1 star"
            onClick={() => onClick('1')}
          />
        </Grid>
      </Popover>
    </>
  )
}

export default CustomRating;
