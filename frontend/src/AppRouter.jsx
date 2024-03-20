import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './page/HomePage';
import Login from './page/Login';
import Regist from './page/Regist';
import HostedListings from './page/HostedListings';
import CreateList from './page/CreateList';
import ListingDetail from './page/listingDetail';
import BookingHistory from './page/BookingHistory';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/regist" element={<Regist/>} />
      <Route path="/hostedlistings" element={<HostedListings/>} />
      <Route path="/createList" element={<CreateList/>} />
      <Route path="/listingDetail" element={<ListingDetail/>} />
      <Route path="/listings/:listingId/:dateRange" element={<ListingDetail/>}/>
      <Route path="/BookingHistory/:id" element={<BookingHistory/>}/>
    </Routes>
  );
}

export default AppRouter;
