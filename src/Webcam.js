import { useRef, useEffect, useState, useMemo } from "react";
import "./Webcam.css";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';


export default function ProcessVideoComponent() {
  const [processedImage, setProcessedImage] = useState(null);
  const [sketch, setSketch] = useState(null);
  const video = useRef(null);
  const [painted, setPainted] = useState(null);

  const [colorValue, setColorValue] = useState('BLACK');
  const colors = [
    { name: 'Black', value: 'BLACK'},
    { name: 'Red', value: 'RED' },
    { name: 'Green', value: 'GREEN' },
    { name: 'Blue', value: 'BLUE' },
  ];
  const [thicknessValue, setThicknessValue] = useState('MEDIUM');
  const thicknesses = [
    { name: 'Tiny', value: 'TINY'},
    { name: 'Medium', value: 'MEDIUM' },
    { name: 'Large', value: 'LARGE' },
    { name: 'Massive', value: 'MASSIVE' },
  ];
  const [modelValue, setModelValue] = useState('dogs');
  const models = [
    { name: 'Dog', value: 'dogs'},
    { name: 'Butterfly', value: 'butterfly' },
    { name: 'Shoe', value: 'shoes' },
  ];

  const inpaintSketch = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sketch: sketch, model: modelValue })
    };
    const response = await fetch('http://localhost:8000/fill_sketch', requestOptions);
    if (!response.ok) {
      throw new Error('Failed to fetch data from the server');
    }
    const data = await response.json();
    setPainted(data.inpainted);
  }

  const webSocketRef = useMemo(() => new WebSocket('ws://localhost:8000/virtual_paint'), []);

  const sendData = (setting, value) => {
    if (setting === 'color') {
      setColorValue(value)
    } else if (setting === 'thickness') {
      setThicknessValue(value)
    }

    if (webSocketRef && webSocketRef.readyState === WebSocket.OPEN) {
      const request = {
        [setting]: value
      }
      webSocketRef.send(JSON.stringify(request));
    } else {
      console.error('WebSocket is not open');
    }
  }

  useEffect(() => {
    const sendVideo = (bytes) => {
      // Check if the WebSocket is open before sending the video stream
      if (webSocketRef && webSocketRef.readyState === WebSocket.OPEN) {
        // Assuming you have a function on the backend to handle the video stream
        console.log('Wysylam')
        const request = {
          'image': bytes
        }
        webSocketRef.send(JSON.stringify(request));
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
      setColorValue(data.color)
      setThicknessValue(data.thickness)
    };

    return () => {
      if (webSocketRef.readyState === WebSocket.OPEN) {
        webSocketRef.close();
      }
    };
  }, [webSocketRef]);

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
                onChange={(e) => sendData('color', e.currentTarget.value)}
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
                onChange={(e) => sendData('thickness', e.currentTarget.value)}
              >
                {thickness.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <ButtonGroup>
            {models.map((model, idx) => (
              <ToggleButton
                className="toggle-button"
                key={idx}
                id={`model-${idx}`}
                type="radio"
                variant={'primary'}
                name="model"
                value={model.value}
                checked={modelValue === model.value}
                onChange={(e) => setModelValue(e.currentTarget.value)}
              >
                {model.name}
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
