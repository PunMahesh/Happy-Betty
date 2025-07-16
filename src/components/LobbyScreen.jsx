import { useEffect, useRef } from "react";
import "../style/LobbyScreen.css";
import lobbySound from "../assets/sound/lobby.mp3";

export default function LobbyScreen({ onEnter }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay prevented:", err);
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="lobby-container">
      <audio ref={audioRef} src={lobbySound} loop />
      <h1 className="lobby-title">🎮 Connecting to Birthday Royale...</h1>
      <div className="lobby-info">
        <p>🔫 Mode: Solo vs. Another Year</p>
        <p>💀 Difficulty: Hardcore Adulting</p>
        <p>🎯 Ping: 999ms (It’s emotional lag)</p>
      </div>
      <button onClick={onEnter} className="lobby-button">
        Deploy!
      </button>
    </div>
  );
}
