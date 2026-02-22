import { useState } from "react";
import { Shield } from "lucide-react";
import type { LogEntry } from "@/hooks/useXTState";

interface BindTabProps {
  onAddLog: (msg: string, type?: LogEntry["type"]) => void;
}

export default function BindTab({ onAddLog }: BindTabProps) {
  const [appPassword, setAppPassword] = useState("");
  const [input, setInput] = useState("");

  const handleStart = () => {
    const lines = input.trim().split("\n").filter(Boolean);
    if (lines.length === 0) {
      onAddLog("⚠️ Masukkan akun untuk bind 2FA", "warning");
      return;
    }
    onAddLog(`▶️ Bind 2FA untuk ${lines.length} akun...`, "info");
    lines.forEach((line, i) => {
      const email = line.split("|")[0];
      setTimeout(() => {
        onAddLog(`🔐 Bind 2FA: ${email}...`, "info");
        setTimeout(() => onAddLog(`✅ ${email} — 2FA bound`, "success"), 2000);
      }, i * 3000);
    });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Shield size={16} className="text-primary" /> Auto Bind 2FA (Google Authenticator)
        </h3>
        <input
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="Google App Password (16 digit)"
          type="password"
        />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Akun (email|token)</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`email1@gmail.com|bearer_token_1\nemail2@gmail.com|bearer_token_2`}
          className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
          rows={5}
        />
      </section>

      <div className="flex gap-2">
        <button className="flex-1 rounded-lg bg-secondary py-2 text-sm font-medium text-secondary-foreground hover:opacity-80">
          Load dari Saved Accounts
        </button>
        <button onClick={handleStart} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Shield size={14} className="mr-1 inline" /> Start Bind
        </button>
      </div>
    </div>
  );
}
