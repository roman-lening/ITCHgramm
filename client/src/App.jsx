// import "./App.css";

// function App() {
//   return (
//     <div>
//       <p>Клиент работает</p>
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Подключаемся к серверу...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error(error);
        setMessage("Ошибка подключения к серверу");
      });
  }, []);

  return (
    <div>
      <h1>ITCHgramm</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;