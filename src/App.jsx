import { useState } from "react";
import LobbyScreen from "./components/LobbyScreen";
import DropZone from "./components/DropZone";
import LootCrateScreen from "./components/LootCrateScreen";
import MiniGame from "./components/MiniGame";

function App() {
  const [stage, setStage] = useState("start");

  const handleStart = () => {
    setStage("lobby");
  };

  return (
    <>
      {stage === "start" && (
        <div className="start-screen">
          <button className="start-button" onClick={handleStart}>
            Start Game 🚀
          </button>
        </div>
      )}

      {stage === "lobby" && (
        <LobbyScreen onEnter={() => setStage("dropzone")} />
      )}

      {stage === "dropzone" && (
        <DropZone onDropComplete={() => setStage("minigame")} />
      )}

      {stage === "minigame" && (
        <MiniGame onLooted={() => setStage("loot")} />
      )}

      {stage === "loot" && (
        <LootCrateScreen onFinish={() => setStage("victory")} />
      )}

      {stage === "victory" && (
        <div className="h-screen w-screen bg-black text-green-400 flex items-center justify-center text-3xl font-mono">
          👑 Mission Complete: Level Up to Birthday Legend
        </div>
      )}
    </>
  );
}

export default App;
