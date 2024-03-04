import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./Webcam.css";


export default function ProcessVideoComponent() {
  const [websocket, setWebsocket] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const webSocketRef = useRef();
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
        }, 1000 / 25);
      } catch (error) {
        console.error('Error accessing websam: ', error)
      }
    };

    enableWebcam();

    webSocketRef.onmessage = (event) => {
      const processedImageData = event.data;
      console.log(processedImageData)
      // Update state with processed image data
      setProcessedImage(processedImageData);
    };

    return () => {
      if (webSocketRef.readyState === WebSocket.OPEN) {
        webSocketRef.close();
      }
    };
  }, []);

  return (
    <div>
      lol
      <video ref={video} autoPlay playsInline />
      <img
        src={`data:image/jpeg;base64,${processedImage}`} // Adjust the MIME type based on your image format
        alt="Processed"
      />
    </div>
  );
}
