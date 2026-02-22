import { useState } from "react";
import { KeyRound, Copy } from "lucide-react";

interface Secret {
  email: string;
  secret: string;
}

export default function SecretsTab() {
  const [secrets] = useState<Secret[]>([]);

  const copyAll = () => {
    const text = secrets.map((s) => `${s.email}|${s.secret}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <KeyRound size={16} className="text-warning" /> Google Auth Secrets
        </h3>
        {secrets.length > 0 && (
          <button onClick={copyAll} className="flex items-center gap-1 rounded bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:opacity-80">
            <Copy size={12} /> Copy All
          </button>
        )}
      </div>

      {secrets.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Belum ada secret. Bind 2FA dulu untuk menyimpan Google Auth secret.
        </div>
      ) : (
        <div className="space-y-1">
          {secrets.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
              <span className="truncate text-sm">{s.email}</span>
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 text-xs text-warning font-mono">{s.secret}</code>
                <Copy size={14} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => navigator.clipboard.writeText(s.secret)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
