export type TuxMood = "idle" | "correct" | "wrong";

export function BuffTux({ mood }: { mood: TuxMood }) {
  return (
    <div
      className={`transition-transform duration-300 ${
        mood === "wrong" ? "animate-shake" : mood === "correct" ? "animate-bounce-once" : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 340"
        className="w-24 h-24"
        aria-label="Buff Tux"
      >
        {/* Shadow */}
        <ellipse cx="150" cy="330" rx="90" ry="8" fill="rgba(0,0,0,0.3)" />

        {/* Feet */}
        <ellipse cx="110" cy="322" rx="28" ry="10" fill="#e8a735" />
        <ellipse cx="190" cy="322" rx="28" ry="10" fill="#e8a735" />

        {/* Body */}
        <ellipse cx="150" cy="220" rx="85" ry="100" fill="#2d2d2d" />

        {/* Belly */}
        <ellipse cx="150" cy="230" rx="52" ry="75" fill="#e8e3d0" />
        {/* Pec line */}
        <path d="M120 185 Q150 195 180 185" stroke="#d4cdb8" strokeWidth="1.5" fill="none" />
        {/* Abs */}
        <line x1="130" y1="210" x2="170" y2="210" stroke="#d4cdb8" strokeWidth="1.2" />
        <line x1="132" y1="232" x2="168" y2="232" stroke="#d4cdb8" strokeWidth="1.2" />
        <line x1="134" y1="254" x2="166" y2="254" stroke="#d4cdb8" strokeWidth="1.2" />
        <line x1="150" y1="195" x2="150" y2="270" stroke="#d4cdb8" strokeWidth="1.2" />

        {/* Left arm */}
        <path d="M68 190 Q40 170 38 135 Q36 110 55 105 Q72 100 75 125 Q78 145 72 165 Z" fill="#2d2d2d" />
        <ellipse cx="52" cy="120" rx="18" ry="14" fill="#3a3a3a" />
        <ellipse cx="68" cy="170" rx="22" ry="16" fill="#2d2d2d" />

        {/* Right arm */}
        <path d="M232 190 Q260 170 262 135 Q264 110 245 105 Q228 100 225 125 Q222 145 228 165 Z" fill="#2d2d2d" />
        <ellipse cx="248" cy="120" rx="18" ry="14" fill="#3a3a3a" />
        <ellipse cx="232" cy="170" rx="22" ry="16" fill="#2d2d2d" />

        {/* Head */}
        <ellipse cx="150" cy="108" rx="44" ry="42" fill="#2d2d2d" />

        {/* Headband */}
        <path
          d="M106 100 Q150 85 194 100"
          stroke={mood === "wrong" ? "#e53e3e" : mood === "correct" ? "#48bb78" : "#e53e3e"}
          strokeWidth="5"
          fill="none"
        />
        <path d="M194 100 L210 92 L205 105 Z" fill={mood === "wrong" ? "#e53e3e" : mood === "correct" ? "#48bb78" : "#e53e3e"} />
        <path d="M210 92 L222 88 L218 100 Z" fill={mood === "wrong" ? "#c53030" : mood === "correct" ? "#38a169" : "#c53030"} />

        {/* Eyes */}
        <ellipse cx="135" cy="105" rx="13" ry="14" fill="white" />
        <ellipse cx="165" cy="105" rx="13" ry="14" fill="white" />

        {mood === "wrong" ? (
          <>
            {/* Angry eyebrows - V shape, steeper */}
            <line x1="118" y1="85" x2="145" y2="95" stroke="#2d2d2d" strokeWidth="5" strokeLinecap="round" />
            <line x1="182" y1="85" x2="155" y2="95" stroke="#2d2d2d" strokeWidth="5" strokeLinecap="round" />
            {/* Angry pupils - smaller, intense */}
            <ellipse cx="138" cy="108" rx="5" ry="7" fill="#1a1a1a" />
            <ellipse cx="162" cy="108" rx="5" ry="7" fill="#1a1a1a" />
            {/* Red tint around eyes */}
            <ellipse cx="135" cy="105" rx="13" ry="14" fill="#e53e3e" opacity="0.15" />
            <ellipse cx="165" cy="105" rx="13" ry="14" fill="#e53e3e" opacity="0.15" />
            {/* Eye shine */}
            <circle cx="140" cy="105" r="2" fill="white" />
            <circle cx="164" cy="105" r="2" fill="white" />
            {/* Angry beak - frowning */}
            <ellipse cx="150" cy="124" rx="14" ry="6" fill="#e8a735" />
            <path d="M140 128 Q150 122 160 128" stroke="#c4820a" strokeWidth="2" fill="none" />
            {/* Steam from head */}
            <path d="M115 75 Q110 60 115 50" stroke="#e53e3e" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M185 75 Q190 60 185 50" stroke="#e53e3e" strokeWidth="2" fill="none" opacity="0.6" />
            {/* Anger vein mark */}
            <path d="M175 78 L180 73 L185 78 L180 83 Z" fill="#e53e3e" opacity="0.7" />
          </>
        ) : mood === "correct" ? (
          <>
            {/* Happy eyebrows - raised */}
            <line x1="122" y1="90" x2="143" y2="92" stroke="#2d2d2d" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="178" y1="90" x2="157" y2="92" stroke="#2d2d2d" strokeWidth="3.5" strokeLinecap="round" />
            {/* Happy eyes - squinting (closed happy) */}
            <path d="M127 107 Q135 100 143 107" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M157 107 Q165 100 173 107" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Happy beak - big smile */}
            <ellipse cx="150" cy="122" rx="14" ry="6" fill="#e8a735" />
            <path d="M138 124 Q150 136 162 124" fill="#d4922a" />
            {/* Sparkles */}
            <path d="M105 70 L108 63 L111 70 L108 77 Z" fill="#fbbf24" opacity="0.8" />
            <path d="M189 70 L192 63 L195 70 L192 77 Z" fill="#fbbf24" opacity="0.8" />
            <circle cx="200" cy="58" r="2" fill="#fbbf24" opacity="0.6" />
          </>
        ) : (
          <>
            {/* Idle - determined look */}
            <line x1="120" y1="88" x2="145" y2="93" stroke="#2d2d2d" strokeWidth="4" strokeLinecap="round" />
            <line x1="180" y1="88" x2="155" y2="93" stroke="#2d2d2d" strokeWidth="4" strokeLinecap="round" />
            {/* Pupils */}
            <ellipse cx="138" cy="107" rx="6" ry="8" fill="#1a1a1a" />
            <ellipse cx="162" cy="107" rx="6" ry="8" fill="#1a1a1a" />
            {/* Eye shine */}
            <circle cx="140" cy="104" r="2.5" fill="white" />
            <circle cx="164" cy="104" r="2.5" fill="white" />
            {/* Beak - smirk */}
            <ellipse cx="150" cy="124" rx="14" ry="6" fill="#e8a735" />
            <path d="M138 124 Q150 132 162 124" fill="#d4922a" />
            <path d="M158 126 Q164 128 166 125" stroke="#c4820a" strokeWidth="1.2" fill="none" />
            {/* Sweat drop */}
            <path d="M190 95 Q192 105 190 112 Q188 105 190 95" fill="#63b3ed" opacity="0.8" />
          </>
        )}
      </svg>

      {/* Speech bubble */}
      {mood !== "idle" && (
        <div
          className={`mt-1 text-center text-xs font-bold ${
            mood === "correct" ? "text-green-400" : "text-red-400"
          }`}
        >
          {mood === "correct" ? "Nice!" : "Hmm..."}
        </div>
      )}
    </div>
  );
}
