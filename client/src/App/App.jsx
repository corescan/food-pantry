// import React, { Component } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientAPI from '../API/ClientAPI';
import { receiveClients, receiveMaps  } from '../redux/actions/clientActions';
import css from './App.module.css';

import Button from './components/Button';
import StartView from './views/Start/StartView';
import ResolutionView from './views/Resolution/ResolutionView';
import MappingView from './views/MappingView/MappingView';

export default function App() {
  const nav = useNavigate();
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
        <header className={css.header}>
          <div className={css.title_wrap}>
            <Link to='/' className={css.main_title}>Client Records</Link>
            <span className={css.title_separator}>{`>`}</span>
            <span className={css.subtitle}>Duplicate Resolution</span>
          </div>
          <div className={css.buttonWrap}>
            <Button
              text='Review Mappings'
              onClick={() => nav(`/mapping`)}
            />
          </div>
        </header>
        <Routes>
          <Route path='/' exact element={<StartView />} />
          <Route path='/resolve/:clientId' exact element={<ResolutionView />} />
          <Route path='/mapping/:trueId' element={<MappingView />} />
          <Route path='/mapping' element={<MappingView />} />
        </Routes>
    </div>
  );
}
