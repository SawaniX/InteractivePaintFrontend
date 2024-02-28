import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// import React, {useState, useEffect} from 'react';
// import api from './api'
import Navbar from "./Navbar"
import Board from "./Board"


function MainView() {
  return (
    <div>
      <Navbar />
      <Board />
    </div>
  )
}

export default function App() {
  return <MainView />;
}
