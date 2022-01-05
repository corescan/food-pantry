// import React, { Component } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientAPI from '../API/ClientAPI';
import { receiveClients, receiveMaps  } from '../redux/actions/clientActions';
import css from './App.module.css';

import Header from './components/Header';
import StartView from './views/Start/StartView';
import ResolutionView from './views/Resolution/ResolutionView';
import MappingView from './views/MappingView/MappingView';

export default function App() {
  const dispatch = useDispatch();

  const fetchData = async() => {
    const mapping = await ClientAPI.fetchAllMaps();
    const clients = await ClientAPI.fetchAll();
    receiveClients(clients)(dispatch);
    receiveMaps(mapping)(dispatch);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={css.container}>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path='/' exact element={<StartView />} />
        <Route path='/resolve/:clientId' exact element={<ResolutionView />} />
        <Route path='/mapping/:trueId' element={<MappingView />} />
        <Route path='/mapping' element={<MappingView />} />
      </Routes>
    </div>
  );
}
