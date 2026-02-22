import { useState } from "react";
import { Users, Copy, Gift } from "lucide-react";
import type { LogEntry } from "@/hooks/useXTState";

interface ReferralTabProps {
  onAddLog: (msg: string, type?: LogEntry["type"]) => void;
}

export default function ReferralTab({ onAddLog }: ReferralTabProps) {
  const [refLink] = useState("https://www.xt.com/en/accounts/register?ref=YOUR_CODE");
  const [input, setInput] = useState("");

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    onAddLog("📋 Link referral disalin!", "success");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Users size={16} className="text-primary" /> Referral Link
        </h3>
        <div className="flex gap-2">
          <input value={refLink} readOnly className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground font-mono focus:outline-none" />
          <button onClick={copyLink} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
            <Copy size={14} />
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Akun untuk Claim Referral (email|token)</h3>
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
          Load dari Saved
        </button>
        <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Gift size={14} className="mr-1 inline" /> Claim Semua
        </button>
      </div>
    </div>
  );
}
