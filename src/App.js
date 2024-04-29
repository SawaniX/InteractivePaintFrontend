import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Board from "./Webcam"


function MainView() {
  return (
    <div className='wrapper-about'>
      <Board />
    </div>
  )
}

export default function App() {
  return <MainView />;
}
