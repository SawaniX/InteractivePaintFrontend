import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";

import Navbar from "./Navbar"
import Board from "./Webcam"


function MainView() {
  const [painted, setPainted] = useState(null);

  const inpaintSketch = async () => {
    const response = await fetch('http://localhost:8000/fill_sketch'); // Replace 'your-backend-url' with the actual URL
    if (!response.ok) {
      throw new Error('Failed to fetch data from the server');
    }
    const data = await response.json();
    setPainted(data.inpainted);
  }

  return (
    <div className='wrapper-about'>
      <Navbar inpaintSketch={inpaintSketch} />
      <Board />
      {painted && (
        <img
          src={`data:image/jpeg;base64,${painted}`}
          alt="Inpainted sketch"
        />
      )}
    </div>
  )
}

export default function App() {
  return <MainView />;
}
