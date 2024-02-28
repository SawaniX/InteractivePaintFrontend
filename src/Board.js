import { useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import socketio from "socket.io-client";
import "./Board.css";


export default function Board() {
  const handVideoRef = useRef(null);
  const sketchVideoRef = useRef(null);

  const socket = socketio("http://localhost:8000/ws/", {
    autoConnect: false,
  });

  let pc; // For RTCPeerConnection Object

  const startConnection = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          height: 350,
          width: 350,
        },
      })
      .then((stream) => {
        console.log("Local Stream found");
        handVideoRef.current.srcObject = stream;
        socket.connect();
      })
      .catch((error) => {
        console.error("Stream not found: ", error);
      });
  };

  useEffect(() => {
    startConnection();
    // return function cleanup() {
    //   pc?.close();
    // };
  }, []);

  return (
    <div>
      <video className="video" autoPlay muted playsInline ref={handVideoRef} />
      <video className="video" autoPlay muted playsInline ref={handVideoRef} />
    </div>
  );
}
