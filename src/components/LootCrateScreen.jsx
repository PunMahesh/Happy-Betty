import { useState } from "react";

const lootItems = [
  {
    emoji: "🎂",
    title: "Cake Grenade",
    description: "Deals emotional damage with frosting blast.",
  },
  {
    emoji: "🧁",
    title: "Muffin Helmet",
    description: "Reduces aging damage by 2%. Stylish but ineffective.",
  },
  {
    emoji: "🧃",
    title: "Juice of Immortality",
    description: "Powerful... but expired yesterday.",
  },
];

export default function LootCrateScreen({ onFinish }) {
  const [opened, setOpened] = useState([false, false, false]);

  const handleOpen = (index) => {
    const updated = [...opened];
    updated[index] = true;
    setOpened(updated);
  };

  const allOpened = opened.every(Boolean);

  return (
    <div className="h-screen w-screen bg-stone-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-8">🎁 Choose Your Birthday Loot</h1>
      <div className="flex gap-8">
        {lootItems.map((item, index) => (
          <div
            key={index}
            className="w-40 h-40 bg-stone-800 border-4 border-yellow-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleOpen(index)}
          >
            {opened[index] ? (
              <div className="text-center px-2">
                <div className="text-4xl mb-2">{item.emoji}</div>
                <p className="font-bold">{item.title}</p>
                <p className="text-sm">{item.description}</p>
              </div>
            ) : (
              <div className="text-6xl">📦</div>
            )}
          </div>
        ))}
      </div>
      {allOpened && (
        <button
          onClick={onFinish}
          className="mt-10 px-6 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition"
        >
          Claim Victory!
        </button>
      )}
    </div>
  );
}
