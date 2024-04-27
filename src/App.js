import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

import Navbar from "./Navbar"
import Board from "./Webcam"


function MainView() {
  const [uniqueId, setUniqueId] = useState(null);
  const [painted, setPainted] = useState(null);

  useEffect(() => {
    // Generate a unique ID when the component mounts
    const id = uuidv4(); // Generate a UUID
    setUniqueId(id);
  }, []);

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
      <Board uuid={uniqueId} />
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
