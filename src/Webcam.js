import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./Webcam.css";


export default function ProcessVideoComponent() {
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket endpoint
    const ws = new WebSocket('ws://localhost:8000/virtual_paint');

    // Set up event listeners
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWebsocket(ws);

    // Clean up on component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const video = useRef(null);

  useEffect(() => {
    const sendVideo = (bytes) => {
      // Check if the WebSocket is open before sending the video stream
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        // Assuming you have a function on the backend to handle the video stream
        console.log('Wysylam')
        websocket.send(bytes);
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

        if (stream && stream.getVideoTracks().length > 0) {
          if (video.current) {
            video.current.srcObject = stream;
          }

          setInterval(() => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = video.current.videoWidth;
            canvas.height = video.current.videoHeight;
            context.drawImage(video.current, 0, 0, canvas.width, canvas.height);

            // canvas.toBlob(blob => sendVideo(blob), 'image/jpeg');

            const imageDataURL = canvas.toDataURL('image/jpeg');

            sendVideo(imageDataURL)
          }, 1000 / 1);
        }

      } catch (error) {
        console.error('Error accessing websam: ', error)
      }
    };

    enableWebcam();
  }, [websocket]);

  return (
    <div>
      <video ref={video} autoPlay playsInline />
    </div>
  );
}
