import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientAPI from '../API/ClientAPI';
import { receiveClients, receiveMaps  } from '../redux/actions/clientActions';
import css from './App.module.css';

import StartView from './views/Start/StartView';
import ResolutionView from './views/Resolution/ResolutionView';
import MappingView from './views/MappingView/MappingView';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  async componentDidMount() {
    const mapping = await ClientAPI.fetchAllMaps();
    const clients = await ClientAPI.fetchAll();
    this.props.receiveClients(clients);
    this.props.receiveMaps(mapping);
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className={css.container}>
        <ToastContainer />
        <BrowserRouter basename='/app'>
          <header className={css.header}>
            <div className={css.title_wrap}>
              <Link to='/' className={css.main_title}>Client Records</Link>
              <span className={css.title_separator}>{`>`}</span>
              <span className={css.subtitle}>Duplicate Resolution</span>
            </div>
          </header>
          <Routes>
            <Route path='/' exact element={<StartView />} />
            <Route path='/resolve/:clientId' exact element={<ResolutionView />} />
            <Route path='/mapping/:trueId' element={<MappingView />} />
            <Route path='/mapping' element={<MappingView />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      clients: state.activeClients
  }
}

export default connect(mapStateToProps, { receiveClients, receiveMaps })(App);
