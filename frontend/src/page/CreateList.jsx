import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  TextField,
  Button,
  IconButton,
  Grid,
  Switch,
  Select,
  MenuItem,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest } from '../Request';

const Label = (props) => {
  const { title } = props
  return (
    <Grid sx={{ margin: '25px 16px 10px 16px' }}>
      {title}
    </Grid>
  )
}


const CreateList = () => {
  const navigate = useNavigate()
  const formRef = useRef(null);
  const [bedroomList, setBedroomList] = useState([{
    numBeds: '',
    roomType: '',
    index: Math.random()
  }])
  const [propertyType, setPropertyType] = useState('')
  const [thumbnail, setThumbnail] = useState();
  const [editData, setEditData] = useState({})
  const [thumbnailType, setThumbnailType] = useState(false)

  // Effect hook to fetch and populate listing data for editing
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const id = searchParams.get('id')
    id && sendRequest(`listings/${id}`, 'GET').then((res) => {
      setEditData({ ...res.listing, id })
      setThumbnail(res.listing.thumbnail)
      setThumbnailType(res.listing.thumbnail && !(typeof (res.listing.thumbnail) === 'object'))
      setBedroomList(res.listing.metadata.bedrooms)
    })
  }, [])

  // Function to navigate to the hosted listings page
  const jumpToMyList = () => {
    navigate('/hostedlistings')
  }

  // Function to remove a room from the bedroom list
  const removeRoom = (index) => {
    const list = [...bedroomList].filter(i => i.index !== index)
    setBedroomList(list)
  }

  // Function to add a new room to the bedroom list
  const addRoom = () => {
    setBedroomList([...bedroomList, {
      numBeds: '',
      roomType: '',
      index: Math.random()
    }])
  }

  // Function to handle the form submission for creating/editing a listing
  const createListing = (event) => {
    event.preventDefault()
    const {
      title,
      address,
      city,
      state,
      postcode,
      country,
      price,
      numBaths,
      amenities,
      thumbnail: thumbnailUrl
    } = formRef.current

    // Calculating total number of beds from the bedroom list
    let numBeds = 0
    const newBedroomList = bedroomList.map(room => {
      numBeds += parseInt(formRef.current[`numBeds${room.index}`].value)
      return {
        index: room.index,
        numBeds: formRef.current[`numBeds${room.index}`].value,
        roomType: formRef.current[`roomType${room.index}`].value
      }
    })

    const data = {
      title: title.value,
      address: {
        street: address.value,
        city: city.value,
        state: state.value,
        postcode: postcode.value,
        country: country.value
      },
      price: price.value,
      thumbnail: (thumbnailType ? thumbnailUrl.value : thumbnail) || '',
      published: false,
      metadata: {
        amenities: amenities.value,
        propertyType,
        numBaths: numBaths.value,
        numBedrooms: bedroomList.length,
        numBeds,
        bedrooms: newBedroomList
      }
    }

    // Sending API request to create/edit the listing
    sendRequest(`listings/${editData.id || 'new'}`, editData.id ? 'PUT' : 'POST', {
      ...data
    }).then((res) => {
      jumpToMyList()
    });
  }

  // Callback function to handle file uploads for thumbnail
  const uploadFileHandle = useCallback((e) => {
    const files = e.target.files;
    const fileList = [...(typeof (thumbnail) === 'object' ? thumbnail : [])]
    if (files.length > 0) {
      Array(files.length).fill(1).forEach((_, index) => {
        const fr = new FileReader();
        fr.readAsDataURL(files[index]);
        fr.onload = (e) => {
          e.target.value = ''
          fileList.push(e.currentTarget.result)
          setThumbnail(fileList)
        };
      })
    }
  }, [JSON.stringify(thumbnail)])

  const thumbnailTypeChange = (e, val) => {
    setThumbnailType(val)
  }

  return (
    <Box>
      <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid sx={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
          <IconButton aria-label="edit" sx={{ marginRight: '20px' }} onClick={jumpToMyList}>
            <ClearIcon />
          </IconButton>
          Create a new listing
        </Grid>
      </Grid>
      <Container fixed sx={{ padding: '10px' }}>
        <form onSubmit={createListing} ref={formRef}>
          <Grid container direction="column" justifyContent="center" spacing={2}>
            <Label title="LISTING INFORMATION" />
            <Grid item>
              <TextField
                key={`${editData.title}title`}
                id="title"
                label="Title"
                multiline
                fullWidth
                required
                defaultValue={editData.title || ''}
              />
            </Grid>
            <Label title="PROPERTY ADDRESS" />
            <Grid item>
              <TextField
                key={`${editData.address?.street}address`}
                id="address"
                label="Address Line"
                multiline
                fullWidth
                required
                defaultValue={editData.address?.street || ''}
              />
            </Grid>
            <Grid item sx={{ display: 'flex' }}>
              <TextField
                key={`${editData.address?.city}city`}
                id="city"
                label="City/Suburb"
                multiline
                required
                defaultValue={editData.address?.city || ''}
                sx={{ width: '100%' }}
              />
              <TextField
                key={`${editData.address?.state}state`}
                id="state"
                label="State"
                multiline
                required
                defaultValue={editData.address?.state || ''}
                sx={{ width: '100%', margin: '0 15px' }}
              />
              <TextField
                key={`${editData.address?.postcode}postcode`}
                id="postcode"
                label="Postcode"
                multiline
                required
                defaultValue={editData.address?.postcode || ''}
                sx={{ width: '100%', marginRight: '15px' }}
              />
              <TextField
                key={`${editData.address?.country}country`}
                id="country"
                label="Country"
                multiline
                required
                defaultValue={editData.address?.country || ''}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Label title="PROPERTY INFORMATION" />
            <Grid item sx={{ display: 'flex' }}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel htmlFor="propertyType">Property Type*</InputLabel>
                <Select
                  key={`${editData.metadata?.propertyType}propertyType`}
                  id="propertyType"
                  label="Property Type"
                  required
                  onChange={(e) => setPropertyType(e.target.value)}
                  defaultValue={editData.metadata?.propertyType || ''}
                >
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="SingleRoom">Single Room</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: '100%', margin: '0 15px' }}>
                <InputLabel htmlFor="price">Price(per night)*</InputLabel>
                <OutlinedInput
                key={`${editData.price}price`}
                  id="price"
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  label="Price(per night)"
                  required
                  defaultValue={editData.price || ''}
                />
              </FormControl>
              <TextField
                key={`${editData.metadata?.numBaths}numBaths`}
                id="numBaths"
                label="Number of Bathrooms"
                type="number"
                min="0"
                required
                defaultValue={editData.metadata?.numBaths || ''}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item>
              <TextField
                key={`${editData.metadata?.amenities}amenities`}
                id="amenities"
                label="Amenities"
                multiline
                fullWidth
                defaultValue={editData.metadata?.amenities || ''}
              />
            </Grid>
            <Label title="BEDROOMS INFORMATION" />
            <Grid item>
              {
                bedroomList.map((room) => (
                  <Grid key={room.index}>
                    <TextField
                      key={`roomType${room.index}`}
                      id={`roomType${room.index}`}
                      label="Type of Room"
                      multiline
                      required
                      defaultValue={room.roomType || ''}
                    />
                    <TextField
                      key={`numBeds${room.index}`}
                      id={`numBeds${room.index}`}
                      label="Number of beds"
                      min="0"
                      type="number"
                      required
                      defaultValue={room.numBeds || ''}
                    />
                    <Button variant="text" onClick={() => removeRoom(room.index)} >REMOVE</Button>
                  </Grid>
                ))
              }
              <Button variant="text" onClick={addRoom} >ADD ROOM</Button>
            </Grid>
            <Label title="UPLOAD NEW THUMBNAIL" />
            <Grid item>
              Image <Switch key={`${editData.thumbnail}thumbnail`} defaultChecked={(editData.thumbnail && !(typeof (editData.thumbnail) === 'object')) || false} onChange={thumbnailTypeChange} /> Youtube Video
            </Grid>
            <Grid item>
            {
              thumbnailType
                ? <Grid>
              <TextField
                key={`${editData.thumbnail}thumbnail1`}
                id="thumbnail"
                label="Youtube Video Url"
                multiline
                fullWidth
                defaultValue={editData.thumbnail || ''}
              />
              </Grid>
                : <>
                <Grid sx={{ display: 'flex' }}>
              {
                (typeof thumbnail === 'object' && thumbnail?.length > 0)
                  ? thumbnail.map((i, index) => (
                    <Grid key={Math.random()} sx={{ position: 'relative' }}>
                      <img
                        style={{ width: '200px', height: '200px' }}
                        src={i}
                        alt="thumbnail"
                      />
                      <IconButton aria-label="delete" sx={{ position: 'absolute', zIndex: '2', right: '10px' }}>
                        <DeleteIcon
                          onClick={() => {
                            const list = [...thumbnail]
                            list[index] = null
                            const newList = list.filter(i => i)
                            setThumbnail(newList)
                          }}
                        />
                      </IconButton>
                    </Grid>
                  ))
                  : null
              }
              </Grid>
              <Button
                component="label"
                name="thumbnail-upload-input"
                variant="text"
              >
                UPLOAD IMAGE
                <input hidden accept="image/*" type="file" onChange={uploadFileHandle}/>
              </Button>
              </>
            }
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="outlined"
                sx={{ width: '100%' }}
              >
                SAVE
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
}

export default CreateList
