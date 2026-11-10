// import { useEffect, useState } from "react";

// function App() {
//   const [message, setMessage] = useState("Подключаемся к серверу...");

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}`);
//         }
//         return response.text();
//       })
//       .then((data) => setMessage(data))
//       .catch((error) => {
//         console.error(error);
//         setMessage("Ошибка подключения к серверу");
//       });
//   }, []);

//   return (
//     <div>
//       <h1>ITCHgramm</h1>
//       <p>{message}</p>
//     </div>
//   );
// }

// export default App;

import { useEffect, useRef } from "react";

const WIDTH = 640;
const HEIGHT = 230;
const GROUND = 185;
const DRAGON_X = 60;
const DRAGON_SIZE = 34;

function newGame() {
  return {
    status: "ready",
    jumpHeight: 0,
    jumpSpeed: 0,
    cactusX: WIDTH + 30,
    score: 0,
  };
}

export default function App() {
  const canvasRef = useRef(null);
  const gameRef = useRef(newGame());

  function jump() {
    if (gameRef.current.status === "over") {
      gameRef.current = newGame();
    }

    const game = gameRef.current;
    game.status = "playing";

    if (game.jumpHeight === 0) {
      game.jumpSpeed = 570;
    }
  }

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    let frameId;
    let previousTime;

    function draw(time) {
      const dt = Math.min((time - (previousTime ?? time)) / 1000, 0.032);
      previousTime = time;
      const game = gameRef.current;

      if (game.status === "playing") {
        game.jumpHeight = Math.max(0, game.jumpHeight + game.jumpSpeed * dt);
        game.jumpSpeed = game.jumpHeight > 0 ? game.jumpSpeed - 1700 * dt : 0;
        game.cactusX -= (280 + Math.min(game.score * 18, 240)) * dt;

        if (game.cactusX < -30) {
          game.score += 1;
          game.cactusX = WIDTH + 30 + Math.random() * 100;
        }

        const hitsCactus =
          game.cactusX < DRAGON_X + DRAGON_SIZE - 5 &&
          game.cactusX + 22 > DRAGON_X + 5 &&
          game.jumpHeight < 27;

        if (hitsCactus) game.status = "over";
      }

      context.fillStyle = "#f0fdf4";
      context.fillRect(0, 0, WIDTH, HEIGHT);

      context.fillStyle = "#d1fae5";
      context.fillRect(0, GROUND, WIDTH, HEIGHT - GROUND);

      context.fillStyle = "#14532d";
      context.font = "bold 20px system-ui";
      context.textAlign = "right";
      context.fillText(`Счёт ${game.score}`, WIDTH - 20, 32);

      context.textAlign = "left";
      context.textBaseline = "alphabetic";
      context.font = "34px sans-serif";
      context.fillText("🐉", DRAGON_X, GROUND - game.jumpHeight);
      context.font = "28px sans-serif";
      context.fillText("🌵", game.cactusX, GROUND);

      if (game.status !== "playing") {
        context.textAlign = "center";
        context.fillStyle = "#14532d";
        context.font = "bold 26px system-ui";
        context.fillText(
          game.status === "ready" ? "Дракон готов!" : "Поймал кактус!",
          WIDTH / 2,
          90,
        );

        context.font = "18px system-ui";
        context.fillText(
          game.status === "ready"
            ? "Пробел или тап, чтобы начать"
            : "Пробел или тап, чтобы сыграть ещё",
          WIDTH / 2,
          122,
        );
      }

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>ITCHgram</h1>
        <p style={styles.subtitle}>
          Мы ещё работаем над приложением. А пока — сыграй с драконом!
        </p>

        <button
          type="button"
          aria-label="Игровое поле. Начать игру, прыгнуть или сыграть заново"
          style={styles.game}
          onClick={jump}
          onKeyDown={(event) => {
            if (event.code === "Space" || event.code === "ArrowUp") {
              event.preventDefault();
              if (!event.repeat) jump();
            }
          }}
        >
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            aria-hidden="true"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </button>

        <p style={styles.hint}>
          Тапни по полю или выдели его клавишей Tab. Прыжок — пробел или ↑.
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100dvh",
    boxSizing: "border-box",
    display: "grid",
    placeItems: "center",
    padding: "24px 16px",
    background: "#10231c",
    color: "#f0fdf4",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    width: "min(100%, 640px)",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "clamp(36px, 8vw, 64px)",
  },
  subtitle: {
    margin: "12px 0 24px",
    fontSize: 18,
  },
  game: {
    display: "block",
    width: "100%",
    padding: 0,
    border: 0,
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
    touchAction: "manipulation",
  },
  hint: {
    margin: "14px 0 0",
    color: "#bbd8ca",
    fontSize: 14,
  },
};