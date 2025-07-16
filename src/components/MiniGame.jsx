import { useEffect, useRef, useState } from "react";
import avatar from "../assets/avatar.png";
import crateImg from "../assets/loot_crate.png";
import Suprise from "./suprise";
import explosionImg from "../assets/explosion.png";
import "../style/MiniGame.css";
import boomSoundFile from "../assets/sound/bomb_boom.mp3";
import bdaySoundFile from "../assets/sound/bday.mp3";
import walkSoundFile from "../assets/sound/walk.mp3";

// Assets
import flowerImg from "../assets/game/flower.png";
import grassImg from "../assets/game/grass.png";
import grassImg2 from "../assets/game/grass-2.png";
import grassImg3 from "../assets/game/grass-3.png";
import grassImg4 from "../assets/game/grass-4.png";
import rockImg from "../assets/game/rock.png";
import rockImg2 from "../assets/game/rock-2.png";
import rockImg3 from "../assets/game/rock-3.png";
import treeImg from "../assets/game/tree.png";
import treeImg2 from "../assets/game/tree-2.png";
import woodImg from "../assets/game/wood.png";
import woodImg2 from "../assets/game/wood-2.png";
import woodImg3 from "../assets/game/wood-3.png";

const grassTiles = [grassImg, grassImg2, grassImg3, grassImg4];
const treeTiles = [treeImg, treeImg2];
const rockTiles = [rockImg, rockImg2, rockImg3];
const woodTiles = [woodImg, woodImg2, woodImg3];

const kbdStyle = {
  display: "inline-block",
  padding: "2px 6px",
  margin: "0 1px",
  borderRadius: "4px",
  backgroundColor: "#333",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "13px",
  fontFamily: "monospace",
  userSelect: "none",
};

export default function MiniGame() {
  const avatarSize = 64;
  const tileSize = 64;
  const crateSize = 64;
  const moveBy = 4;
  const boomSound = useRef(null);
  const successAudioRef = useRef(null);
  const walkSoundRef = useRef(null);

  const [pos, setPos] = useState({ top: 100, left: 100 });
  const [facing, setFacing] = useState("right");
  const [elements, setElements] = useState([]);
  const [crates, setCrates] = useState([]);
  const [openedCrates, setOpenedCrates] = useState([]);
  const [result, setResult] = useState(null);
  const [firstCrateOpened, setFirstCrateOpened] = useState(false);
  const [correctCrateId, setCorrectCrateId] = useState(null);

  const cratesData = [];
  const minDistance = 250;
  const usedPositions = [];

  const keysPressed = useRef(new Set());
  const animationRef = useRef();

  function isFarEnough(newPos, existingPositions, minDistance) {
    return existingPositions.every(
      (pos) =>
        Math.sqrt((newPos.x - pos.x) ** 2 + (newPos.y - pos.y) ** 2) >=
        minDistance
    );
  }

  useEffect(() => {
    if (result === "success" && successAudioRef.current) {
      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play().catch((err) => {
        console.warn("Audio play failed:", err);
      });
    }
  }, [result]);

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const generateRandomPositions = (count) => {
      const positions = [];
      for (let i = 0; i < count; i++) {
        positions.push({
          x: Math.random() * (viewportWidth - tileSize),
          y: Math.random() * (viewportHeight - tileSize),
        });
      }
      return positions;
    };

    const grassCount = 30;
    const treeCount = 10;
    const rockCount = 10;

    const grassPositions = generateRandomPositions(grassCount);
    const treePositions = generateRandomPositions(treeCount);
    const rockPositions = generateRandomPositions(rockCount);

    const allElements = [];

    grassPositions.forEach((pos) =>
      allElements.push({
        type: "grass",
        x: pos.x,
        y: pos.y,
        img: grassTiles[Math.floor(Math.random() * grassTiles.length)],
        id: `grass-${pos.x}-${pos.y}`,
      })
    );

    treePositions.forEach((pos) =>
      allElements.push({
        type: "tree",
        x: pos.x,
        y: pos.y,
        img: treeTiles[Math.floor(Math.random() * treeTiles.length)],
        id: `tree-${pos.x}-${pos.y}`,
      })
    );

    rockPositions.forEach((pos) =>
      allElements.push({
        type: "rock",
        x: pos.x,
        y: pos.y,
        img: rockTiles[Math.floor(Math.random() * rockTiles.length)],
        id: `rock-${pos.x}-${pos.y}`,
      })
    );

    setElements(allElements);

    // Crate placement logic
    const grassElements = allElements.filter((el) => el.type === "grass");

    const cratesData = [];
    const minDistance = 250;
    const usedPositions = [];

    const isFarEnough = (newPos, existingPositions, minDistance) => {
      return existingPositions.every(
        (pos) =>
          Math.sqrt((newPos.x - pos.x) ** 2 + (newPos.y - pos.y) ** 2) >=
          minDistance
      );
    };

    for (let i = 0; i < grassElements.length && cratesData.length < 3; i++) {
      const spot = grassElements[i];

      if (isFarEnough(spot, usedPositions, minDistance)) {
        usedPositions.push({ x: spot.x, y: spot.y });
        cratesData.push({
          id: `crate${cratesData.length}`,
          x: spot.x,
          y: spot.y,
          isCorrect: false,
        });
      }
    }

    // Randomly assign one crate as correct
    if (cratesData.length > 0) {
      const correctIndex = Math.floor(Math.random() * cratesData.length);
      cratesData[correctIndex].isCorrect = true;
      setCorrectCrateId(cratesData[correctIndex].id);
    }

    setCrates(cratesData);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => keysPressed.current.add(e.key.toLowerCase());
    const handleKeyUp = (e) => keysPressed.current.delete(e.key.toLowerCase());

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const move = () => {
      setPos((prev) => {
        let { top, left } = prev;
        const maxW = window.innerWidth - avatarSize;
        const maxH = window.innerHeight - avatarSize;

        const isMoving =
          keysPressed.current.has("arrowup") ||
          keysPressed.current.has("arrowdown") ||
          keysPressed.current.has("arrowleft") ||
          keysPressed.current.has("arrowright") ||
          keysPressed.current.has("w") ||
          keysPressed.current.has("a") ||
          keysPressed.current.has("s") ||
          keysPressed.current.has("d");

        // Play or pause walking sound based on movement
        if (isMoving) {
          if (walkSoundRef.current && walkSoundRef.current.paused) {
            walkSoundRef.current.loop = true;
            walkSoundRef.current.play().catch((e) => {});
          }
        } else {
          if (walkSoundRef.current && !walkSoundRef.current.paused) {
            walkSoundRef.current.pause();
            walkSoundRef.current.currentTime = 0;
          }
        }

        if (keysPressed.current.has("arrowup") || keysPressed.current.has("w"))
          top = Math.max(top - moveBy, 0);
        if (
          keysPressed.current.has("arrowdown") ||
          keysPressed.current.has("s")
        )
          top = Math.min(top + moveBy, maxH);
        if (
          keysPressed.current.has("arrowleft") ||
          keysPressed.current.has("a")
        ) {
          left = Math.max(left - moveBy, 0);
          setFacing("left");
        }
        if (
          keysPressed.current.has("arrowright") ||
          keysPressed.current.has("d")
        ) {
          left = Math.min(left + moveBy, maxW);
          setFacing("right");
        }

        return { top, left };
      });

      animationRef.current = requestAnimationFrame(move);
    };

    animationRef.current = requestAnimationFrame(move);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (walkSoundRef.current) {
        walkSoundRef.current.pause();
        walkSoundRef.current.currentTime = 0;
      }
    };
  }, [facing]);

  // Play boom sound
  useEffect(() => {
    if (result === "boom" && boomSound.current) {
      boomSound.current.currentTime = 0;
      boomSound.current.play();
    }

    if (result === "boom") {
      const timeout = setTimeout(() => {
        setResult(null);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [result]);

  useEffect(() => {
    if (result === "success") return;

    crates.forEach((crate) => {
      if (openedCrates.includes(crate.id)) return;

      const dx = pos.left - crate.x;
      const dy = pos.top - crate.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) {
        // Mark crate as opened
        setOpenedCrates((prev) => [...prev, crate.id]);

        if (!firstCrateOpened) {
          setFirstCrateOpened(true);
          setResult("boom");

          // Choose a random crate from the remaining unopened ones
          const remaining = crates.filter(
            (c) => c.id !== crate.id // not the one just opened
          );
          const random =
            remaining[Math.floor(Math.random() * remaining.length)];
          setCorrectCrateId(random.id); // now this one is the winner
        } else {
          if (crate.id === correctCrateId) {
            setResult("success");
          } else {
            setResult("boom");
          }
        }
      }
    });
  }, [pos, crates, openedCrates, result, firstCrateOpened, correctCrateId]);

  return (
    <div
      className={`game-container ${result === "boom" ? "shake" : ""}`}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#88cc55",
        overflow: "hidden",
      }}
    >
      {result !== "success" && (
        <div
          className="moves"
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "white",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "Arial, sans-serif",
            zIndex: 1001,
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>Use</span>
          <kbd style={kbdStyle}>↑</kbd>
          <kbd style={kbdStyle}>↓</kbd>
          <kbd style={kbdStyle}>←</kbd>
          <kbd style={kbdStyle}>→</kbd>
          <span>or</span>
          <kbd style={kbdStyle}>W</kbd>
          <kbd style={kbdStyle}>A</kbd>
          <kbd style={kbdStyle}>S</kbd>
          <kbd style={kbdStyle}>D</kbd>
          <span>to move</span>
        </div>
      )}

      <audio ref={boomSound} src={boomSoundFile} preload="auto" />
      <audio ref={successAudioRef} src={bdaySoundFile} preload="auto" />
      <audio ref={walkSoundRef} src={walkSoundFile} preload="auto" />

      {/* Scattered elements */}
      {elements.map(({ id, img, x, y }) => (
        <img
          key={id}
          src={img}
          alt=""
          style={{
            position: "absolute",
            top: y,
            left: x,
            width: tileSize,
            height: tileSize,
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />
      ))}

      {crates.map((crate) => {
        const isOpened = openedCrates.includes(crate.id);
        const isSuccess = crate.id === correctCrateId && isOpened;

        return (
          <img
            key={crate.id}
            src={isOpened ? (isSuccess ? crateImg : explosionImg) : crateImg}
            alt="crate"
            className="crate"
            style={{
              position: "absolute",
              top: crate.y,
              left: crate.x,
              width: crateSize,
              height: crateSize,
              userSelect: "none",
            }}
            draggable={false}
          />
        );
      })}

      {/* Avatar */}
      <img
        src={avatar}
        alt="Avatar"
        className="avatar"
        style={{
          position: "absolute",
          top: pos.top,
          left: pos.left,
          width: "auto",
          height: "100px",
          transform: facing === "left" ? "scaleX(-1)" : "scaleX(1)",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />

      {/* Result message */}
      {result === "success" && (
        <div style={{ animation: "fadeIn 1s ease forwards" }}>
          <Suprise onClose={() => setResult(null)} />
        </div>
      )}

      {result === "boom" && (
        <div
          className="message boom"
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            backgroundColor: "rgba(255,0,0,0.8)",
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            userSelect: "none",
            zIndex: 1000,
          }}
        >
          💥 BOOM! Wrong crate. Try Another 😎
        </div>
      )}

      <style>
        {`
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
`}
      </style>
    </div>
  );
}
