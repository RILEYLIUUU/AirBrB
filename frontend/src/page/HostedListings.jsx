import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Button,
  Alert,
  Typography,
  MenuItem,
  Menu,
  Grid
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { sendRequest } from '../Request';
import ListCard from '../components/ListCard';
import ProfitGraph from '../components/ProfitGraph';
import { handleLogout } from '../components/UserSidebar';
const MyList = () => {
  const [listings, setListings] = useState([])
  const [errorAlertVis, setErrorAlertVis] = useState(false)
  const [alertContent, setAlertContent] = useState('Cannot edit published listings!')
  const [alertType, setAlertType] = useState('error')
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [xAxis, setXAxis] = React.useState('')
  const [yAxis, setYAxis] = React.useState('')

  // Function for genrateing the profit Graph
  const generateProfitGraph = async (allListings) => {
    const allHostedListsId = allListings.map((listing) => listing.id);

    const x = Array.from({ length: 30 }, (_, index) => index + 1);
    setXAxis(x);

    const { bookings } = await sendRequest('bookings', 'GET');
    const filteredBookings = filterBookings(bookings, allHostedListsId);
    const y = x.map((day) => calculateTotalProfit(day, filteredBookings, allListings, allHostedListsId));
    setYAxis(y);
  };

  const filterBookings = (bookings, allHostedListsId) =>
    bookings.filter(
      (booking) =>
        allHostedListsId.includes(parseInt(booking.listingId, 10)) &&
        booking.status === 'accepted'
    );

  const calculateTotalProfit = (day, filteredBookings, allListings, allHostedListsId) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 30 + day);

    let totalProfit = 0;

    filteredBookings.forEach((booking) => {
      const idIndex = allHostedListsId.indexOf(parseInt(booking.listingId, 10));
      console.log('idIndex', idIndex);
      const bookedListing = allListings[idIndex];
      const { price } = bookedListing;
      const checkinDate = new Date(booking.dateRange.startdate);
      const checkoutDate = new Date(booking.dateRange.enddate);

      if (currentDate <= checkoutDate && currentDate >= checkinDate) {
        totalProfit += parseInt(price, 10);
      }
    });

    console.log('totalProfit', totalProfit);
    return totalProfit;
  };

  const getListings = async () => {
    const list = []
    const email = localStorage.getItem('email')
    sendRequest('listings', 'GET').then(async (data) => {
      for (const listing of data.listings) {
        if (listing.owner === email) {
          await sendRequest(`listings/${listing.id}`, 'GET').then((ress) => {
            list.push({ ...ress.listing, id: listing.id })
          })
        }
      }
      setListings(list)
      generateProfitGraph(list)
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getListings()
  }, [])

  const uploadJsonCreate = (e) => {
    handleClose()
    const files = e.target.files;
    if (files.length > 0) {
      const fr = new FileReader();
      fr.onload = (r) => {
        const jsonData = JSON.parse(fr.result);
        e.target.value = ''
        sendRequest('listings/new', 'POST', {
          ...jsonData
        }).then((res) => {
          getListings()
        });
      };
      fr.readAsText(files[0])
    }
  }

  const buttonStyle = {
    float: 'center',
    color: '#FF5A5F',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  };

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
        <Grid>
        <Button
            id='logoutButton'
            sx={buttonStyle}
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={handleClick}
            sx={{ backgroundColor: '#FF5A5F !important' }}
          >
            ADD
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                navigate('/createList')
                handleClose()
              }}
            >
              Create  List
            </MenuItem>
            <MenuItem>
              <Button component="label" variant="text" sx={{ background: 'none', color: '#000', padding: '0' }}>
                Upload JSON File
                <input hidden accept="application/json" type="file" onChange={uploadJsonCreate}/>
              </Button>
            </MenuItem>
          </Menu>
        </Grid>
      </Box>
      <Box>
        <Container fixed sx={{ padding: '10px', display: 'flex', flexWrap: 'wrap', background: '#f3f3f3' }}>
          {
            listings.map((list) => (
              <ListCard key={list.id} {...list} getListings={getListings} setErrorAlertVis={setErrorAlertVis} setAlertContent={setAlertContent} setAlertType={setAlertType} />
            ))
          }
          <Alert severity={alertType} sx={{ position: 'fixed', top: 30, left: '40%', display: errorAlertVis ? 'flex' : 'none' }}>{alertContent}</Alert>
        </Container>
      </Box>
      <ProfitGraph xAxis={xAxis} yAxis={yAxis} />
    </>
  );
}

export default MyList
