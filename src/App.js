import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./Navbar"
import Board from "./Webcam"


function MainView() {
  return (
    <div className='wrapper-about'>
      <Navbar />
      <Board />
    </div>
  )
}

export default function App() {
  return <MainView />;
}
