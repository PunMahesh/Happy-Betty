import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import avatar from "../assets/avatar_parachute.png";
import cloud1 from "../assets/cloud1.png";
import cloud2 from "../assets/cloud2.png";
import parachuteSound from "../assets/sound/parachute.mp3";  // import your parachute sound
import "../style/DropZone.css";

export default function DropZone({ onDropComplete }) {
  const audioRef = useRef(null);

  useEffect(() => {
    // Play sound on component mount
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay prevented:", err);
      });
    }

    // Pause and reset sound on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="dropzone-container">
      {/* Parachute sound */}
      <audio ref={audioRef} src={parachuteSound} loop />

      {/* Cloud moving right */}
      <motion.img
        src={cloud1}
        alt="Cloud Right"
        className="cloud1"
        initial={{ x: 0 }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      {/* Falling avatar */}
      <motion.img
        src={avatar}
        alt="Parachuting Avatar"
        className="avatar"
        style={{ height: "300px", width: "auto", transformOrigin: "center" }}
        initial={{ x: "-50%", y: -300, scale: 0.95 }}
        animate={{ x: "-50%", y: 350, scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
        onAnimationComplete={onDropComplete}
      />

      {/* Cloud moving left */}
      <motion.img
        src={cloud2}
        alt="Cloud Left"
        className="cloud2"
        initial={{ x: 0 }}
        animate={{ x: "-100vw" }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </div>
  );
}
