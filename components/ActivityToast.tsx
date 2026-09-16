"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

const NAMES = [
  "Peter",
  "Kelvin",
  "Maria",
  "James",
  "Sofia",
  "Daniel",
  "Aisha",
  "Chen",
  "Omar",
  "Lila",
  "Noah",
  "Grace",
];

type Post = {
  id: number;
  name: string;
  type: "deposit" | "withdrawal";
  amount: number;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextPost(): Post {
  const type = Math.random() > 0.45 ? "deposit" : "withdrawal";
  return {
    id: Date.now() + randomInt(1, 999),
    name: NAMES[randomInt(0, NAMES.length - 1)],
    type,
    amount: type === "deposit" ? randomInt(20, 480) : randomInt(15, 260),
  };
}

function delayMs(first: boolean) {
  return first ? randomInt(12_000, 28_000) : randomInt(120_000, 240_000);
}

export function ActivityToast() {
  const [post, setPost] = useState<Post | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let showTimer: ReturnType<typeof setTimeout>;
    let first = true;

    const schedule = () => {
      showTimer = setTimeout(() => {
        setPost(nextPost());
        setVisible(true);
        hideTimer = setTimeout(() => {
          setVisible(false);
          first = false;
          schedule();
        }, 6200);
      }, delayMs(first));
    };

    schedule();
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!post) return null;

  const deposited = post.type === "deposit";

  return (
    <div
      className={`pointer-events-none fixed bottom-5 left-5 z-[80] w-[min(92vw,320px)] transition duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            deposited ? "bg-green/15 text-green" : "bg-accent/15 text-accent-2"
          }`}
        >
          {deposited ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}
        </span>
        <p className="text-sm text-white">
          <span className="font-semibold">{post.name}</span>{" "}
          {deposited ? "deposited" : "withdrew"}{" "}
          <span className="font-semibold text-accent-2">${post.amount}</span>
        </p>
      </div>
    </div>
  );
}
