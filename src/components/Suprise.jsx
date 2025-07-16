import React, { useEffect, useRef, useState } from "react";
import "../style/MiniGame.css";
import "../style/Suprise.css";

const BALLOON_COLORS = ["#FF5F6D", "#FFC371", "#6A82FB", "#FC5C7D", "#56CCF2"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function FireworksCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];
    let particles = [];

    class Firework {
      constructor() {
        this.x = randomInt(100, canvas.width - 100);
        this.y = canvas.height;
        this.targetY = randomInt(100, canvas.height / 2);
        this.speed = randomInt(3, 5);
        this.exploded = false;
      }
      update() {
        if (!this.exploded) {
          this.y -= this.speed;
          if (this.y <= this.targetY) {
            this.exploded = true;
            for (let i = 0; i < 30; i++) {
              particles.push(new Particle(this.x, this.y));
            }
          }
        }
      }
      draw() {
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();
        }
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
        this.alpha = 1;
        this.color = `hsl(${randomInt(0, 360)}, 100%, 60%)`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) {
        fireworks.push(new Firework());
      }

      fireworks.forEach((f, i) => {
        f.update();
        f.draw();
        if (f.exploded) {
          fireworks.splice(i, 1);
        }
      });

      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      });

      animationRef.current = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9998,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}

function Balloon({ color, left, delay }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "-150px",
        left,
        width: 50,
        height: 80,
        backgroundColor: color,
        borderRadius: "50% 50% 50% 50%",
        animation: `floatUp 8s ease-in-out infinite`,
        animationDelay: delay,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: 9997,
      }}
    >
      <div
        style={{
          width: 2,
          height: 30,
          backgroundColor: "#555",
          margin: "auto",
          marginTop: 80,
          borderRadius: 2,
        }}
      />
    </div>
  );
}

export default function BirthdayCelebration({ onClose }) {
  const [cardOpen, setCardOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setFadeIn(true); // start fade-in animation
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    return () => {
      // pause audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <>
      <FireworksCanvas />

      {/* Balloons */}
      {BALLOON_COLORS.map((color, i) => (
        <Balloon
          key={i}
          color={color}
          left={`${10 + i * 15}vw`}
          delay={`${i * 2}s`}
        />
      ))}

      {/* Background overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "radial-gradient(circle at center, #fceabb 0%, #f8b500 80%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9996,
          userSelect: "none",
          padding: 20,
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Card container */}
        <div
          onClick={() => setCardOpen((open) => !open)}
          style={{
            width: cardOpen ? 600 : 300,
            height: 400,
            backgroundColor: "#fff",
            borderRadius: 20,
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            color: "#333",
            cursor: "pointer",
            display: "flex",
            overflow: "hidden",
            userSelect: "none",
            transition: "width 0.6s ease",
            perspective: 1000,
          }}
        >
          {/* Left page */}
          <div
            style={{
              width: cardOpen ? "50%" : "100%",
              height: "100%",
              borderRight: cardOpen ? "1px solid #ccc" : "none",
              backgroundColor: cardOpen ? "#fff8e1" : "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              boxSizing: "border-box",
              transition: "width 0.6s ease, background-color 0.6s ease",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {!cardOpen ? (
              "🎂 Click to Open Your Birthday Card! 🎉"
            ) : (
              <>
                <h2 style={{ color: "#f44336", marginBottom: 10 }}>
                  Happy Birthday! 🎉
                </h2>
                <p style={{ fontWeight: "normal", fontSize: 16 }}>
                  Thanks for being so awesome.
                </p>
              </>
            )}
          </div>

          {/* Right page (only visible when open) */}
          {cardOpen && (
            <div
              style={{
                width: "50%",
                height: "100%",
                backgroundColor: "#fff",
                padding: 20,
                boxSizing: "border-box",
                fontSize: 18,
                color: "#333",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                userSelect: "text",
                position: "relative",
              }}
            >
              <p>
                Wishing you an amazing day Noob{" "}
                <span role="img" aria-label="smiley">
                  😎
                </span>{" "}
                filled with love, laughter, and lots of cake! May all your
                dreams come true.
              </p>
              <p>Enjoy every moment and have a fantastic year ahead!</p>


            </div>
          )}
        </div>
      </div>

      {/* Background music */}
      <audio
        ref={audioRef}
        src="/assets/sound/bday.mp3" 
        preload="auto"
        loop
      />

      {/* Balloon float animation */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) rotate(10deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
