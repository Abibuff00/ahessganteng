import { useState } from "react";
import { LogIn } from "lucide-react";
import type { LogEntry } from "@/hooks/useXTState";

interface LoginTabProps {
  onAddLog: (msg: string, type?: LogEntry["type"]) => void;
}

export default function LoginTab({ onAddLog }: LoginTabProps) {
  const [input, setInput] = useState("");

  const handleStart = () => {
    const lines = input.trim().split("\n").filter(Boolean);
    if (lines.length === 0) {
      onAddLog("⚠️ Masukkan akun untuk login", "warning");
      return;
    }
    onAddLog(`▶️ Login ${lines.length} akun...`, "info");
    lines.forEach((line, i) => {
      const email = line.split("|")[0];
      setTimeout(() => {
        onAddLog(`🔑 Login: ${email}...`, "info");
        setTimeout(() => onAddLog(`✅ ${email} — token captured`, "success"), 1000);
      }, i * 2000);
    });
  };

  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-2 text-sm font-semibold">Login Akun (email|password)</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`email1@gmail.com|password1\nemail2@gmail.com|password2`}
          className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
          rows={6}
        />
      </section>
      <div className="flex gap-2">
        <button className="flex-1 rounded-lg bg-secondary py-2 text-sm font-medium text-secondary-foreground hover:opacity-80">
          Load dari Saved Accounts
        </button>
        <button onClick={handleStart} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <LogIn size={14} className="mr-1 inline" /> Start Login
        </button>
      </div>
    </div>
  );
}
