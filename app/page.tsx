"use client";

import { useState } from "react";

type Currency = "money" | "gold";

export default function VaultSMPFlip() {
  const [money, setMoney] = useState(50000);
  const [gold, setGold] = useState(5);
  const [bet, setBet] = useState(1000);
  const [currency, setCurrency] = useState<Currency>("money");
  const [message, setMessage] = useState("Welcome to VaultSMPFlip");
  const [history, setHistory] = useState<string[]>([]);
  const [popup, setPopup] = useState(false);

  function addHistory(text: string) {
    setHistory((old) => [text, ...old.slice(0, 6)]);
  }

  function getBalance() {
    return currency === "money" ? money : gold;
  }

  function addBalance(amount: number) {
    if (currency === "money") {
      setMoney((old) => Math.max(0, old + amount));
    }

    if (currency === "gold") {
      setGold((old) => Math.max(0, old + amount));
    }
  }

  function currencyName() {
    return currency === "money" ? "Money" : "Gold";
  }

  function formatAmount(amount: number) {
    return currency === "money"
      ? `$${amount.toLocaleString()}`
      : `${amount} Gold`;
  }

  function showPopup(text: string) {
    setMessage(text);
    setPopup(true);
  }

  function checkBet() {
    if (bet <= 0) {
      showPopup("Enter a valid bet.");
      return false;
    }

    if (bet > getBalance()) {
      showPopup(`Not enough ${currencyName()}.`);
      return false;
    }

    return true;
  }

  function coinflip() {
    if (!checkBet()) return;

    const win = Math.random() < 0.5;

    if (win) {
      addBalance(bet);
      showPopup(`🪙 Coinflip WIN! You gained ${formatAmount(bet)}.`);
      addHistory(`Coinflip Won ${formatAmount(bet)}`);
    } else {
      addBalance(-bet);
      showPopup(`🪙 Coinflip LOSS! You lost ${formatAmount(bet)}.`);
      addHistory(`Coinflip Lost ${formatAmount(bet)}`);
    }
  }

  function dice() {
    if (!checkBet()) return;

    const player = Math.floor(Math.random() * 6) + 1;
    const bot = Math.floor(Math.random() * 6) + 1;

    if (player > bot) {
      addBalance(bet);
      showPopup(`🎲 You rolled ${player}. Bot rolled ${bot}. You WIN!`);
      addHistory(`Dice Won ${formatAmount(bet)}`);
    } else if (player < bot) {
      addBalance(-bet);
      showPopup(`🎲 You rolled ${player}. Bot rolled ${bot}. You LOST!`);
      addHistory(`Dice Lost ${formatAmount(bet)}`);
    } else {
      showPopup(`🎲 Tie! Both rolled ${player}.`);
      addHistory("Dice Tie");
    }
  }

  function roulette(color: "red" | "black" | "green") {
    if (!checkBet()) return;

    const roll = Math.random();
    const result = roll < 0.05 ? "green" : roll < 0.5 ? "red" : "black";

    if (result === color) {
      const reward = color === "green" ? bet * 10 : bet;

      addBalance(reward);

      showPopup(`🎰 Roulette WIN! Landed on ${result}.`);
      addHistory(`Roulette Won ${formatAmount(reward)}`);
    } else {
      addBalance(-bet);

      showPopup(`🎰 Roulette LOSS! Landed on ${result}.`);
      addHistory(`Roulette Lost ${formatAmount(bet)}`);
    }
  }

  function jackpot() {
    if (!checkBet()) return;

    const win = Math.random() < 0.25;

    if (win) {
      const reward = bet * 3;

      addBalance(reward);

      showPopup(`💰 JACKPOT WIN! You gained ${formatAmount(reward)}.`);
      addHistory(`Jackpot Won ${formatAmount(reward)}`);
    } else {
      addBalance(-bet);

      showPopup(`💰 Jackpot LOSS!`);
      addHistory(`Jackpot Lost ${formatAmount(bet)}`);
    }
  }

  function crash() {
    if (!checkBet()) return;

    const multiplier = Number((Math.random() * 4).toFixed(2));

    if (multiplier >= 1.75) {
      const reward = Math.floor(bet * 1.75);

      addBalance(reward);

      showPopup(`📈 Crash WIN! Multiplier: ${multiplier}x`);
      addHistory(`Crash Won ${formatAmount(reward)}`);
    } else {
      addBalance(-bet);

      showPopup(`📈 Crash LOSS! Crashed at ${multiplier}x`);
      addHistory(`Crash Lost ${formatAmount(bet)}`);
    }
  }

  function openCrate() {
    if (!checkBet()) return;

    addBalance(-bet);

    const rewards = [
      "Common Trail",
      "Rare Tag",
      "Epic Aura",
      "Legendary Effect",
      "Mythic Wings",
    ];

    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    showPopup(`📦 You opened a crate and got: ${reward}`);
    addHistory(`Opened Crate`);
  }

  function blackjack() {
    if (!checkBet()) return;

    const player = Math.floor(Math.random() * 11) + 11;
    const dealer = Math.floor(Math.random() * 11) + 11;

    if (player > 21) {
      addBalance(-bet);

      showPopup(`🃏 Blackjack BUST! You got ${player}. Dealer got ${dealer}.`);

      addHistory(`Blackjack Lost ${formatAmount(bet)}`);
      return;
    }

    if (dealer > 21 || player > dealer) {
      addBalance(bet);

      showPopup(`🃏 Blackjack WIN! You got ${player}. Dealer got ${dealer}.`);

      addHistory(`Blackjack Won ${formatAmount(bet)}`);
      return;
    }

    if (player === dealer) {
      showPopup(`🃏 Blackjack PUSH! Both got ${player}.`);
      addHistory(`Blackjack Tie`);
      return;
    }

    addBalance(-bet);

    showPopup(`🃏 Blackjack LOSS! You got ${player}. Dealer got ${dealer}.`);

    addHistory(`Blackjack Lost ${formatAmount(bet)}`);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {popup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-10 max-w-md w-full text-center">
            <h2 className="text-4xl font-black text-emerald-400 mb-6">
              Game Result
            </h2>

            <p className="text-2xl font-bold mb-8">{message}</p>

            <button
              onClick={() => setPopup(false)}
              className="bg-emerald-500 hover:bg-emerald-400 transition text-black font-black px-8 py-4 rounded-2xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-emerald-400">
              VaultSMPFlip
            </h1>

            <p className="text-zinc-400 mt-2">Minecraft Gambling Website</p>
          </div>

          <a
            href="https://discord.gg/EmsdeMbzMq"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-400 transition text-black font-black px-6 py-3 rounded-2xl h-fit"
          >
            Join Discord
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-4xl font-black mb-8">Wallet</h2>

            <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="bg-black border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400 mb-2">Money</p>

                <h3 className="text-3xl font-black text-emerald-400">
                  ${money.toLocaleString()}
                </h3>
              </div>

              <div className="bg-black border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400 mb-2">Gold</p>

                <h3 className="text-3xl font-black text-yellow-400">{gold}</h3>
              </div>
            </div>

            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none mb-5"
            />

            <div className="grid grid-cols-2 gap-4 mb-5">
              <button
                onClick={() => setCurrency("money")}
                className={`py-4 rounded-2xl font-black transition ${
                  currency === "money"
                    ? "bg-emerald-500 text-black"
                    : "bg-black border border-zinc-800"
                }`}
              >
                Money
              </button>

              <button
                onClick={() => setCurrency("gold")}
                className={`py-4 rounded-2xl font-black transition ${
                  currency === "gold"
                    ? "bg-yellow-400 text-black"
                    : "bg-black border border-zinc-800"
                }`}
              >
                Gold
              </button>
            </div>

            <div className="bg-black border border-zinc-800 rounded-2xl p-5 text-center font-bold text-lg text-zinc-300">
              {message}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-4xl font-black mb-8">Deposit</h2>

            <div className="bg-black border border-zinc-800 rounded-2xl p-5 mb-5">
              <p className="text-zinc-400">Send server money to:</p>

              <p className="text-3xl font-black mt-3 text-emerald-400">
                Coolsmans
              </p>
            </div>

            <div className="bg-black border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-400 mb-2">Example:</p>

              <p className="text-xl font-black text-cyan-400">
                /pay Coolsmans 50000
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-black mb-8">Playable Games</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <button
              onClick={coinflip}
              className="bg-black hover:border-emerald-400 border border-zinc-800 rounded-2xl p-6 text-left transition"
            >
              <h3 className="text-2xl font-black text-emerald-400 mb-2">
                🪙 Coinflip
              </h3>

              <p className="text-zinc-400">50/50 chance to double your bet.</p>
            </button>

            <button
              onClick={dice}
              className="bg-black hover:border-red-400 border border-zinc-800 rounded-2xl p-6 text-left transition"
            >
              <h3 className="text-2xl font-black text-red-400 mb-2">🎲 Dice</h3>

              <p className="text-zinc-400">Roll higher than the bot.</p>
            </button>

            <button
              onClick={() => roulette("red")}
              className="bg-black hover:border-red-400 border border-zinc-800 rounded-2xl p-6 text-left transition"
            >
              <h3 className="text-2xl font-black text-red-400 mb-2">
                🎰 Roulette
              </h3>

              <p className="text-zinc-400">Bet on red and win.</p>
            </button>

            <button
              onClick={jackpot}
              className="bg-black hover:border-yellow-400 border border-zinc-800 rounded-2xl p-6 text-left transition"
            >
              <h3 className="text-2xl font-black text-yellow-400 mb-2">
                💰 Jackpot
              </h3>

              <p className="text-zinc-400">25% chance for 3x reward.</p>
            </button>

            <button
              onClick={crash}
              className="bg-black hover:border-orange-400 border border-zinc-800 rounded-2xl p-6 text-left transition"
            >
              <h3 className="text-2xl font-black text-orange-400 mb-2">
                📈 Crash
              </h3>

              <p className="text-zinc-400">Cash out before crash.</p>
            </button>

            <button
              onClick={openCrate}
              className="bg-black hover:border-purple-400 border border-zinc-800 rounded-2xl p-6 text-left transition"
            >
              <h3 className="text-2xl font-black text-purple-400 mb-2">
                📦 Crates
              </h3>

              <p className="text-zinc-400">Open mystery crates.</p>
            </button>

            <button
              onClick={blackjack}
              className="bg-black hover:border-cyan-400 border border-zinc-800 rounded-2xl p-6 text-left transition"
            >
              <h3 className="text-2xl font-black text-cyan-400 mb-2">
                🃏 Blackjack
              </h3>

              <p className="text-zinc-400">Beat the dealer to 21.</p>
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mt-10">
          <h2 className="text-4xl font-black mb-8">Recent Games</h2>

          <div className="space-y-3">
            {history.length === 0 && (
              <p className="text-zinc-500">No games played yet.</p>
            )}

            {history.map((item, index) => (
              <div
                key={index}
                className="bg-black border border-zinc-800 rounded-2xl p-4 font-bold text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
