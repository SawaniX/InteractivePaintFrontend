import { useRef, useEffect, useState } from "react";
import "./Webcam.css";


export default function ProcessVideoComponent() {
  const [processedImage, setProcessedImage] = useState(null);
  const [sketch, setSketch] = useState(null);
  const video = useRef(null);

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
      <img
        src={`data:image/jpeg;base64,${processedImage}`}
        alt="ProcessedInput"
      />
      <img
        src={`data:image/jpeg;base64,${sketch}`}
        alt="Sketch"
      />
    </div>
  );
}
