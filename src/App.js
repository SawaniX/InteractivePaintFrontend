import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Board from "./Webcam"


function MainView() {
  document.body.style.backgroundColor = "#191719";

  return (
    <div>
      <Board />
    </div>
  )
}

export default function App() {
  return <MainView />;
}
