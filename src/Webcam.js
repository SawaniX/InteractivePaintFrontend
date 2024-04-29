import { useRef, useEffect, useState } from "react";
import "./Webcam.css";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';


export default function ProcessVideoComponent() {
  const [processedImage, setProcessedImage] = useState(null);
  const [sketch, setSketch] = useState(null);
  const video = useRef(null);
  const [painted, setPainted] = useState(null);

  const [colorValue, setColorValue] = useState('1');
  const colors = [
    { name: 'Black', value: '0'},
    { name: 'Red', value: '1' },
    { name: 'Green', value: '2' },
    { name: 'Blue', value: '3' },
  ];
  const [thicknessValue, setThicknessValue] = useState('1');
  const thicknesses = [
    { name: 'Tiny', value: '0'},
    { name: 'Medium', value: '1' },
    { name: 'Large', value: '2' },
    { name: 'Massive', value: '3' },
  ];
  const [shapeValue, setShapeValue] = useState('1');
  const shapes = [
    { name: 'Rectangle', value: '0'},
    { name: 'Circle', value: '1' },
  ];

  const inpaintSketch = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sketch: sketch, model: 'dogs' })
    };
    const response = await fetch('http://localhost:8000/fill_sketch', requestOptions);
    if (!response.ok) {
      throw new Error('Failed to fetch data from the server');
    }
    const data = await response.json();
    setPainted(data.inpainted);
  }

  useEffect(() => {
    const webSocketRef = new WebSocket('ws://localhost:8000/virtual_paint');

    const sendVideo = (bytes) => {
      // Check if the WebSocket is open before sending the video stream
      if (webSocketRef && webSocketRef.readyState === WebSocket.OPEN) {
        // Assuming you have a function on the backend to handle the video stream
        console.log('Wysylam')
        webSocketRef.send(bytes);
      } else {
        console.error('WebSocket is not open');
      }
    };

    const enableWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { max: 640 },
            height: { max: 480 },
          } 
        });

        if (video.current) {
          video.current.srcObject = stream;
        }

        setInterval(() => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = video.current.videoWidth;
          canvas.height = video.current.videoHeight;
          context.drawImage(video.current, 0, 0, canvas.width, canvas.height);

          const imageDataURL = canvas.toDataURL('image/jpeg');

          sendVideo(imageDataURL)
        }, 1000 / 10);
      } catch (error) {
        console.error('Error accessing websam: ', error)
      }
    };

    enableWebcam();

    webSocketRef.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setProcessedImage(data.processed_input);
      setSketch(data.sketch)
    };

    return () => {
      if (webSocketRef.readyState === WebSocket.OPEN) {
        webSocketRef.close();
      }
    };
  }, []);

  return (
    <div>
      <video ref={video} autoPlay playsInline style={{ display: "none" }}/>
      <div className="container">
        <div className="left-image">
          <img
            src={`data:image/jpeg;base64,${processedImage}`}
            alt="ProcessedInput"
            className="processed-image"
          />
        </div>
        <div className='inpaintContainer'>
          {/* <div className='download-buttons'>
            <Button variant="primary" size="lg" className="toggle-button">Download camera</Button>
            <Button variant="primary" size="lg" className="toggle-button">Download sketch</Button>
            <Button variant="primary" size="lg" className="toggle-button">Download inpaint</Button>
          </div> */}
          <ButtonGroup>
            {colors.map((color, idx) => (
              <ToggleButton
                className="toggle-button"
                key={idx}
                id={`color-${idx}`}
                type="radio"
                variant={'primary'}
                name="color"
                value={color.value}
                checked={colorValue === color.value}
                onChange={(e) => setColorValue(e.currentTarget.value)}
              >
                {color.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <ButtonGroup>
            {thicknesses.map((thickness, idx) => (
              <ToggleButton
                className="toggle-button"
                key={idx}
                id={`thickness-${idx}`}
                type="radio"
                variant={'primary'}
                name="thickness"
                value={thickness.value}
                checked={thicknessValue === thickness.value}
                onChange={(e) => setThicknessValue(e.currentTarget.value)}
              >
                {thickness.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <ButtonGroup>
            {shapes.map((shape, idx) => (
              <ToggleButton
                className="toggle-button"
                key={idx}
                id={`shape-${idx}`}
                type="radio"
                variant={'primary'}
                name="shape"
                value={shape.value}
                checked={shapeValue === shape.value}
                onChange={(e) => setShapeValue(e.currentTarget.value)}
              >
                {shape.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <Button variant="outline-light" onClick={inpaintSketch}>Inpaint Sketch</Button>
        </div>
        <div className="right-image">
          <img
            src={`data:image/jpeg;base64,${sketch}`}
            alt="Sketch"
            className="sketch-image"
          />
        </div>
      </div>
      {painted && (
        <img
          src={`data:image/jpeg;base64,${painted}`}
          alt="Inpainted sketch"
          className="inpainted-image"
        />
      )}
    </div>
  );
}
