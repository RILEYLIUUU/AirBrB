import React, { useState, useEffect, memo } from 'react'
import {
  Typography,
  Container,
  Box,
  Grid,
  Chip,
  Select,
  MenuItem,
  Divider,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import SideBar from '../components/UserSidebar'
import logoImage from '../airbnb.png'
import ListCard from '../components/ListCard'
import { sendRequest } from '../Request';
import FilterDialog from '../components/FilterDialog';

const HomePage = () => {
  const [listings, setListings] = useState([])
  const [sortValue, setSort] = useState('0')
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [appliedDate, setAppliedDate] = React.useState(false)
  const [dateRange, setDateRange] = React.useState(false)
  const [inFilter, setInFilter] = useState(false)
  const [userOrder, setUserOrder] = useState([])

  // Function to determine if a listing passes the filter criteria
  const filterMethod = (listing) => {
    const searchText = document.getElementById('searchText').value;
    const { checkInDate, checkOutDate, bedroomsMin, bedroomsMax, priceMin, priceMax } = filterData;
    let flag = true;
    if (checkInDate && listing.availability[0]?.start && dayjs(listing.availability[0].start) - dayjs(checkInDate) > 0) flag = false;
    if (checkOutDate && listing.availability[0]?.end && dayjs(listing.availability[0].end) - dayjs(checkOutDate) < 0) flag = false;
    if (bedroomsMin && listing.metadata.numBedrooms < bedroomsMin) flag = false;
    if (bedroomsMax && listing.metadata.numBedrooms > bedroomsMax) flag = false;
    if (priceMin && (listing.price - 0) < (priceMin - 0)) flag = false;
    if (priceMax && (listing.price - 0) > (priceMax - 0)) flag = false;
    if (searchText && !(listing.title.toUpperCase().includes(searchText.toUpperCase()) ||
    listing.address.city.toUpperCase().includes(searchText.toUpperCase()) ||
    listing.address.country.toUpperCase().includes(searchText.toUpperCase()) ||
    listing.address.postcode.toUpperCase().includes(searchText.toUpperCase()) ||
    listing.address.state.toUpperCase().includes(searchText.toUpperCase()) ||
    listing.address.street.toUpperCase().includes(searchText.toUpperCase()))) flag = false;
    return flag;
  }

  const sortMethod = (arr) => {
    let newArr = [...arr];
    switch (sortValue) {
      case '0': newArr = arr.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0)); break;
      case '1': break;
      case '2': break;
      case '3': newArr = arr.sort((a, b) => (b.price - 0) - (a.price - 0)); break;
      case '4': newArr = arr.sort((a, b) => (a.price - 0) - (b.price - 0)); break;
    }
    return newArr;
  }

  const getListings = async () => {
    const list = []
    const pUblishedListings = []
    const order = []
    let userBookings = []
    sendRequest('listings', 'GET').then(async (data) => {
      // Fetching user bookings
      localStorage.getItem('email') && sendRequest('bookings', 'GET').then((resp) => {
        const bookings = resp.bookings;
        userBookings = bookings.map((booking) => {
          if (booking.owner === localStorage.getItem('email')) {
            return booking.listingId
          }
          return null
        }).filter(i => i)
      })

      // Iterating through listings and checking against filters
      for (const listing of data.listings) {
        await sendRequest(`listings/${listing.id}`, 'GET').then((ress) => {
          if (ress.listing.published && userBookings.includes(`${listing.id}`)) {
            order.push({ ...ress.listing, id: listing.id })
          } else if (ress.listing.published && filterMethod(ress.listing)) {
            list.push({ ...ress.listing, id: listing.id })
          }
          if (ress.listing.published) {
            pUblishedListings.push(1)
          }
        })
      }

      // Checking if there are unpublished listings after filtering
      if (pUblishedListings.length !== list.length + order.length) {
        setInFilter(true)
      } else {
        setInFilter(false)
      }
      const sortList = sortMethod(list);
      setListings(sortList);
      console.log(order)
      setUserOrder(order)
    });
  };

  useEffect(() => {
    getListings()
  }, [])

  const handleSort = (e) => {
    setSort(e.target.value)
  }

  // Event handler for opening the filter dialog
  const openFilter = () => {
    setFilterOpen(true);
  }

  // Event handler for closing the filter dialog
  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  // Event handler for applying filters
  const handleFiltersApply = (data) => {
    setFilterData(data);
    setAppliedDate(true);

    // Calculate the date range based on the check-in and check-out dates
    const intervalDay = dayjs(data.checkOutDate).diff(
      data.checkInDate,
      'day'
    );
    setDateRange(intervalDay);
    handleFilterClose();
  }

  // Effect hook to fetch listings whenever sort value, filter data, or date range changes
  useEffect(() => {
    getListings()
  }, [sortValue, JSON.stringify(filterData)], dateRange)

  // Function to clear all filters
  const cleanAllFilters = () => {
    document.getElementById('searchText').value = ''
    handleFiltersApply({})
    getListings()
  }

  // Event handler for keydown in the search input
  const searchKeyDown = (event) => {
    if (event.keyCode === 13) {
      getListings()
    }
  }

  return (<>
    <Box sx={{ borderBottom: '1px solid rgb(192,192,192)', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FF5A5F' }}

    >
      <Typography
        sx={{ cursor: 'pointer', flex: '1', display: { xs: 'none', sm: 'block', md: 'block' } }}
        component="h1"
        variant="h4"
      >
        <img src={logoImage} alt="Airbnb Logo" style={{ marginRight: '10px', height: '24px' }} />
        airbrb
      </Typography>
      <OutlinedInput
        id="searchText"
        endAdornment={<InputAdornment position="end">
            <SearchIcon onClick={getListings} sx={{ cursor: 'pointer' }} />
          </InputAdornment>
        }
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          'aria-label': 'weight',
        }}
        sx={{ marginRight: '20px' }}
        placeholder='Search...'
        onKeyDown={searchKeyDown}
      />
      <Box>
        <SideBar />
      </Box>
    </Box>
    <Grid
      sx={{ height: '100px', width: '100%', display: 'flex', justifyContent: 'space-between' }}
    >
      <Grid sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '8%' }} onClick={cleanAllFilters}>
        {
          inFilter ? <><ArrowBackIcon /> All listings</> : ''
        }
      </Grid>
      <Grid
        sx={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}
      >
        <Chip icon={<TuneIcon />} label="Filters" onClick={openFilter} />
        <Select
          value={sortValue}
          onChange={handleSort}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{ marginLeft: '15px', height: '45px' }}
        >
          <MenuItem value={'0'}>Most relevant</MenuItem>
          <MenuItem value={'1'}>Rating(Highest - Lowest)</MenuItem>
          <MenuItem value={'2'}>Rating(Lowest - Highest)</MenuItem>
          <MenuItem value={'3'}>Price(Highest - Lowest)</MenuItem>
          <MenuItem value={'4'}>Price(Lowest - Highest)</MenuItem>
        </Select>
      </Grid>
    </Grid>
    <Container fixed sx={{ padding: '10px', display: 'flex', flexWrap: 'wrap', background: '#f3f3f3' }}>
      <Grid sx={{ width: '100%' }}>
        {
          userOrder.length > 0
            ? <Grid>
                <Chip avatar={<TagFacesIcon />} label="your order" sx={{ marginLeft: '10px', marginTop: '5px' }} />
                <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {
                    userOrder.map((list) => (
                      <ListCard key={list.id} {...list} homepage dateRange={dateRange} isDate={appliedDate}
                      />
                    ))
                  }
                </Grid>
                <Divider />
            </Grid>
            : null
        }
      </Grid>
      {
        listings.length > 0
          ? <Grid>
              <Chip avatar={<TagFacesIcon />} label="all list" sx={{ marginLeft: '10px', marginTop: '10px' }} />
              <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {
                  listings.map((list) => (
                    <ListCard key={list.id} {...list} homepage dateRange={dateRange} isDate={appliedDate}
                    />
                  ))
                }
              </Grid>
              <Divider />
            </Grid>
          : null
      }
    </Container>
    {
      filterOpen
        ? <FilterDialog
            handleFilterClose={handleFilterClose}
            handleFiltersApply={handleFiltersApply}
            filterData={filterData}
          />
        : null
    }
  </>
  );
}

export default memo(HomePage);
