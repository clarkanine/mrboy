import React, { useEffect, useRef, useState } from "react";

export default function RunnerGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("START"); // START, PLAYING, GAMEOVER
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("runner_highscore") || "0", 10);
  });

  // Keep game loop state in a ref so the animation loop always reads fresh data
  const gameRef = useRef({
    state: "START",
    score: 0,
    highScore: 0,
    speed: 6,
    timer: 0,
    obstacles: [],
    keys: {},
    player: {
      x: 100,
      y: 270, // GROUND_Y (320) - height (50)
      width: 40,
      height: 50,
      baseHeight: 50,
      vY: 0,
      gravity: 0.6,
      jumpForce: -13,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
    },
    layers: {
      bg1: 0,
      bg2: 0,
      bg3: 0,
    }
  });

  // Sync highscore from ref back to local storage when state changes
  useEffect(() => {
    gameRef.current.highScore = highScore;
  }, [highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const game = gameRef.current;
    const GROUND_Y = 320;
    let animId;

    const handleKeyDown = (e) => {
      game.keys[e.key.toLowerCase()] = true;
      game.keys[e.key] = true;

      if (game.state === "START" && e.key === " ") {
        startGame();
      } else if (game.state === "GAMEOVER" && e.key === " ") {
        resetGame();
      }
    };

    const handleKeyUp = (e) => {
      game.keys[e.key.toLowerCase()] = false;
      game.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function startGame() {
      game.state = "PLAYING";
      setGameState("PLAYING");
    }

    function resetGame() {
      game.score = 0;
      game.speed = 6;
      game.timer = 0;
      game.obstacles = [];
      game.player.y = GROUND_Y - game.player.baseHeight;
      game.player.height = game.player.baseHeight;
      game.player.vY = 0;
      game.player.isGrounded = true;
      game.player.isSliding = false;
      setScore(0);
      game.state = "PLAYING";
      setGameState("PLAYING");
    }

    function spawnObstacle() {
      const isTall = Math.random() > 0.5;
      if (isTall) {
        game.obstacles.push({
          x: canvas.width,
          y: GROUND_Y - 45,
          width: 25,
          height: 45,
          color: "#FF5252",
        });
      } else {
        game.obstacles.push({
          x: canvas.width,
          y: GROUND_Y - 80,
          width: 45,
          height: 35,
          color: "#FFEB3B",
        });
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Environment Parallax Rendering logic
      const activeSpeed = game.state === "PLAYING" ? game.speed : 0;
      ctx.fillStyle = "#1e1e2f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      game.layers.bg1 = (game.layers.bg1 - activeSpeed * 0.1) % 400;
      ctx.fillStyle = "#2b2b40";
      for (let i = 0; i < 4; i++) {
        let mX = game.layers.bg1 + i * 300;
        ctx.beginPath();
        ctx.moveTo(mX, GROUND_Y);
        ctx.lineTo(mX + 150, GROUND_Y - 120);
        ctx.lineTo(mX + 300, GROUND_Y);
        ctx.fill();
      }

      game.layers.bg2 = (game.layers.bg2 - activeSpeed * 0.3) % 300;
      ctx.fillStyle = "#3c3c54";
      for (let i = 0; i < 4; i++) {
        let hX = game.layers.bg2 + i * 260;
        ctx.beginPath();
        ctx.arc(hX + 130, GROUND_Y, 100, Math.PI, 0);
        ctx.fill();
      }

      ctx.fillStyle = "#111116";
      ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(canvas.width, GROUND_Y);
      ctx.stroke();

      if (game.state === "PLAYING") {
        const p = game.player;

        if ((game.keys["arrowup"] || game.keys["w"]) && p.isGrounded && !p.isSliding) {
          p.vY = p.jumpForce;
          p.isGrounded = false;
        }

        p.y += p.vY;
        if (!p.isGrounded) {
          p.vY += p.gravity;
          if (p.y >= GROUND_Y - p.height) {
            p.y = GROUND_Y - p.height;
            p.vY = 0;
            p.isGrounded = true;
          }
        }

        if ((game.keys["arrowdown"] || game.keys["s"]) && p.isGrounded && !p.isSliding) {
          p.isSliding = true;
          p.height = p.baseHeight / 2;
          p.y = GROUND_Y - p.height;
          p.slideTimer = 50;
        }

        if (p.isSliding) {
          p.slideTimer--;
          if (p.slideTimer <= 0 || (!game.keys["arrowdown"] && !game.keys["s"])) {
            p.isSliding = false;
            p.height = p.baseHeight;
            p.y = GROUND_Y - p.height;
          }
        }

        game.timer++;
        const spawnInterval = Math.max(50, 110 - Math.floor(game.score / 2));
        if (game.timer > spawnInterval) {
          spawnObstacle();
          game.timer = 0;
        }

        for (let i = game.obstacles.length - 1; i >= 0; i--) {
          let obs = game.obstacles[i];
          obs.x -= game.speed;

          ctx.fillStyle = obs.color;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

          if (
            p.x < obs.x + obs.width &&
            p.x + p.width > obs.x &&
            p.y < obs.y + obs.height &&
            p.y + p.height > obs.y
          ) {
            game.state = "GAMEOVER";
            setGameState("GAMEOVER");
            if (game.score > game.highScore) {
              setHighScore(game.score);
              localStorage.setItem("runner_highscore", game.score.toString());
            }
          }

          if (obs.x + obs.width < 0) {
            game.obstacles.splice(i, 1);
            game.score++;
            setScore(game.score);
            if (game.score % 4 === 0) game.speed += 0.4;
          }
        }

        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Trick to trigger custom event listeners via programmatic click handlers
  const triggerSpaceKey = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "sans-serif", background: "#121214", padding: "20px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "800px", marginBottom: "12px", color: "#e2e8f0" }}>
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Score: <b style={{ color: "#38bdf8" }}>{score}</b></span>
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>High Score: <b style={{ color: "#f43f5e" }}>{highScore}</b></span>
      </div>

      <div style={{ position: "relative", width: "800px", height: "400px" }}>
        <canvas ref={canvasRef} width={800} height={400} style={{ display: "block", borderRadius: "8px", border: "2px solid #334" }} />

        {gameState === "START" && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.85)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#fff", borderRadius: "8px" }}>
            <h1 style={{ fontSize: "42px", margin: "0 0 10px 0", color: "#4CAF50", letterSpacing: "1px" }}>NEON RUNNER</h1>
            <p style={{ fontSize: "18px", margin: "0 0 20px 0", color: "#94a3b8" }}>Avoid obstacles by switching heights</p>
            <button onClick={triggerSpaceKey} style={{ padding: "12px 30px", fontSize: "18px", background: "#4CAF50", border: "none", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
              Press SPACEBAR to Run
            </button>
          </div>
        )}

        {gameState === "GAMEOVER" && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.8)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#fff", borderRadius: "8px" }}>
            <h1 style={{ fontSize: "48px", margin: "0 0 10px 0", color: "#ef4444" }}>CRASHED!</h1>
            <p style={{ fontSize: "20px", margin: "0 0 25px 0" }}>Final Score: <b style={{ color: "#38bdf8" }}>{score}</b></p>
            <button onClick={triggerSpaceKey} style={{ padding: "12px 28px", fontSize: "16px", background: "#ef4444", border: "none", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
              Press SPACEBAR to Try Again
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: "16px", color: "#64748b", fontSize: "14px", textAlign: "center", lineHeight: "1.6" }}>
        🎮 <b>Controls:</b> Jump: <b style={{ color: "#cbd5e1" }}>W / Up Arrow</b> | Slide: <b style={{ color: "#cbd5e1" }}>S / Down Arrow</b><br />
        🔴 Dodge red walls by jumping. 🟡 Slide under yellow hanging beams.
      </div>
    </div>
  );
}
