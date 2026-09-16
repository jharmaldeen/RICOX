export function HeroVisuals() {
  return (
    <div className="relative mx-auto mt-14 w-full min-w-0 max-w-4xl overflow-hidden px-1 lg:overflow-visible">
      <div className="glass absolute left-0 top-8 z-20 hidden w-40 rounded-2xl p-3 lg:block">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Live deals</p>
        <div className="mt-3 space-y-2.5">
          {[
            { name: "Quantum Chain", change: "+12.4%", up: true },
            { name: "BlockVault", change: "+8.1%", up: true },
            { name: "CryptoNexus", change: "-1.2%", up: false },
          ].map((row) => (
            <div key={row.name} className="flex items-center justify-between gap-2">
              <span className="truncate text-xs text-white">{row.name}</span>
              <span className={`text-[10px] font-semibold ${row.up ? "text-green" : "text-red"}`}>
                {row.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass relative z-10 mx-auto w-full min-w-0 max-w-[560px] rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Portfolio</p>
            <p className="text-lg font-semibold text-white sm:text-xl">$750.2M</p>
          </div>
          <div className="rounded-full bg-green/15 px-2.5 py-1 text-xs font-semibold text-green">+27.8%</div>
        </div>
        <svg
          viewBox="0 0 520 140"
          preserveAspectRatio="none"
          className="block h-[120px] w-full sm:h-[150px]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hero-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#4d7cff" />
            </linearGradient>
            <linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4d7cff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#4d7cff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 110 C40 108 70 96 100 88 C140 76 170 92 210 70 C250 48 280 58 320 42 C360 26 400 50 440 28 C470 14 500 22 520 18 L520 140 L0 140 Z"
            fill="url(#hero-fill)"
          />
          <path
            d="M0 110 C40 108 70 96 100 88 C140 76 170 92 210 70 C250 48 280 58 320 42 C360 26 400 50 440 28 C470 14 500 22 520 18"
            fill="none"
            stroke="url(#hero-line)"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      <div className="glass absolute right-0 top-10 z-20 hidden w-[168px] rounded-2xl p-4 lg:block">
        <p className="text-xs text-muted">Allocation</p>
        <div className="mt-3 flex items-center justify-center">
          <div
            className="relative h-24 w-24 rounded-full"
            style={{
              background:
                "conic-gradient(#4d7cff 0 46%, #6ea0ff 46% 72%, #5eead4 72% 88%, #34d399 88% 100%)",
            }}
          >
            <div className="absolute inset-[18px] flex items-center justify-center rounded-full bg-surface text-center">
              <div>
                <p className="text-sm font-bold text-white">88.02</p>
                <p className="text-[9px] text-muted">deployed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
