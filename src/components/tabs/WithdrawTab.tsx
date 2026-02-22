import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import type { LogEntry } from "@/hooks/useXTState";

interface WithdrawTabProps {
  onAddLog: (msg: string, type?: LogEntry["type"]) => void;
}

export default function WithdrawTab({ onAddLog }: WithdrawTabProps) {
  const [appPassword, setAppPassword] = useState("");
  const [destUserId, setDestUserId] = useState("");
  const [asset, setAsset] = useState("");
  const [amountAll, setAmountAll] = useState(true);
  const [amount, setAmount] = useState("");
  const [input, setInput] = useState("");

  const handleStart = () => {
    const lines = input.trim().split("\n").filter(Boolean);
    if (lines.length === 0) {
      onAddLog("⚠️ Masukkan akun untuk withdraw", "warning");
      return;
    }
    if (!destUserId) {
      onAddLog("⚠️ Masukkan Destination User ID", "warning");
      return;
    }
    onAddLog(`▶️ Withdraw ${lines.length} akun → User ${destUserId}...`, "info");
    lines.forEach((line, i) => {
      const email = line.split("|")[0];
      setTimeout(() => {
        onAddLog(`💸 Withdraw: ${email} → ${asset || "USDT"}...`, "info");
        setTimeout(() => onAddLog(`✅ ${email} — withdrawn`, "success"), 2000);
      }, i * 3000);
    });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ArrowDownToLine size={16} className="text-primary" /> Auto Withdraw (Internal Transfer)
        </h3>
        <input value={appPassword} onChange={(e) => setAppPassword(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Google App Password" type="password" />
        <div className="grid grid-cols-2 gap-2">
          <input value={destUserId} onChange={(e) => setDestUserId(e.target.value)} className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Destination XT User ID" />
          <div className="flex gap-1">
            <input value={asset} onChange={(e) => setAsset(e.target.value)} className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Asset (USDT, SHIB...)" />
            <button className="rounded-lg bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:opacity-80">Cek</button>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={amountAll} onChange={(e) => setAmountAll(e.target.checked)} className="accent-primary" />
              All
            </label>
            {!amountAll && (
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Amount" type="number" />
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Akun (email|token)</h3>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" rows={4} placeholder={`email1@gmail.com|bearer_token_1`} />
      </section>

      <div className="flex gap-2">
        <button className="flex-1 rounded-lg bg-secondary py-2 text-sm font-medium text-secondary-foreground hover:opacity-80">Load dari Saved</button>
        <button onClick={handleStart} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <ArrowDownToLine size={14} className="mr-1 inline" /> Start Withdraw
        </button>
      </div>
    </div>
  );
}
