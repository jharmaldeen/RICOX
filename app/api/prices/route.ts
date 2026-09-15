import { json } from "@/lib/api";

const FALLBACK = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 67420.18, price_change_percentage_24h: 1.2, sparkline_in_7d: { price: [] } },
  { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 1845.32, price_change_percentage_24h: 2.5, sparkline_in_7d: { price: [] } },
  { id: "solana", symbol: "sol", name: "Solana", current_price: 98.75, price_change_percentage_24h: 4.8, sparkline_in_7d: { price: [] } },
  { id: "cardano", symbol: "ada", name: "Cardano", current_price: 0.45, price_change_percentage_24h: -0.8, sparkline_in_7d: { price: [] } },
];

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano&sparkline=true",
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return json({ coins: FALLBACK, source: "fallback" });
    const coins = await res.json();
    return json({ coins, source: "live" });
  } catch {
    return json({ coins: FALLBACK, source: "fallback" });
  }
}
