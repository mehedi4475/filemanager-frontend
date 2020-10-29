import React, { useState } from 'react';
import withAuth from './components/withAuth';
import Header from './components/Header';
import HomePage from './components/HomePage';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [page, setPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const updateHome = () => {
    setPage(page+1);
  }

  const getSelected = (item) => {
    setSelectedItem(item);
  }

  return (
    <div className="App">
      <Header callUpdateHome={updateHome} selectedItem={selectedItem} />
      <HomePage page={page} callSelectedItem={getSelected} />
    </div>
  );
}
export default withAuth(App);