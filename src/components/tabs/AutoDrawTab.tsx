import { useState, useRef, useEffect } from "react";
import { Play, Square, Key, Trash2, RefreshCw, Copy } from "lucide-react";
import type { Account, LogEntry } from "@/hooks/useXTState";

interface AutoDrawTabProps {
  accounts: Account[];
  onAddAccounts: (text: string) => number;
  onRemove: (id: string) => void;
  onStartAll: () => void;
  onStopAll: () => void;
  isRunning: boolean;
  logs: LogEntry[];
  onAddLog: (msg: string, type?: LogEntry["type"]) => void;
}

export default function AutoDrawTab({
  accounts, onAddAccounts, onRemove, onStartAll, onStopAll, isRunning, logs, onAddLog,
}: AutoDrawTabProps) {
  const [input, setInput] = useState("");
  const [customHeaders, setCustomHeaders] = useState("");
  const [showHeaders, setShowHeaders] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const handleAdd = () => {
    if (!input.trim()) return;
    const count = onAddAccounts(input);
    setInput("");
    onAddLog(`✅ ${count} akun ditambahkan`, "success");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      onAddLog(`📄 File ${file.name} dimuat`, "info");
    };
    reader.readAsText(file);
  };

  const statusColor = (s: Account["status"]) => {
    if (s === "Running") return "text-info";
    if (s === "Done") return "text-success";
    if (s === "Error") return "text-destructive";
    return "text-muted-foreground";
  };

  const logColor = (t: LogEntry["type"]) => {
    if (t === "success") return "text-success";
    if (t === "error") return "text-destructive";
    if (t === "warning") return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      {/* Saved Accounts */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Saved Akun ({accounts.length})</h3>
          <div className="flex gap-2">
            <button onClick={() => onAddLog("🔍 Checking all accounts...", "info")} className="rounded bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:opacity-80">
              ✅ Check All
            </button>
            <button className="rounded bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:opacity-80">
              Load
            </button>
            <button onClick={onStartAll} disabled={isRunning} className="flex items-center gap-1 rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-50">
              <Play size={10} /> Start All
            </button>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            Belum ada akun. Paste di bawah atau klik Load.
          </div>
        ) : (
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {accounts.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                <span className="truncate text-sm">{a.email}</span>
                <div className="flex items-center gap-2">
                  <Key size={14} className="cursor-pointer text-muted-foreground hover:text-foreground" />
                  <Copy size={14} className="cursor-pointer text-muted-foreground hover:text-foreground" />
                  <Trash2 size={14} className="cursor-pointer text-muted-foreground hover:text-destructive" onClick={() => onRemove(a.id)} />
                  <span className={`text-xs font-medium ${statusColor(a.status)}`}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Custom Headers Toggle */}
      <section>
        <button onClick={() => setShowHeaders(!showHeaders)} className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
          <span>🛡️ Custom Headers</span>
          <span className="text-xs text-muted-foreground">{showHeaders ? "▲" : "▼"}</span>
        </button>
        {showHeaders && (
          <div className="mt-2 space-y-2">
            <textarea
              value={customHeaders}
              onChange={(e) => setCustomHeaders(e.target.value)}
              className="w-full rounded-lg border border-border bg-input p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              rows={4}
              placeholder="Paste headers dari bookmarklet di sini..."
            />
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                <RefreshCw size={12} className="mr-1 inline" /> Auto Generate
              </button>
              <button className="flex-1 rounded-lg bg-secondary py-1.5 text-xs font-medium text-secondary-foreground hover:opacity-80">
                Save Headers
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Akun Input */}
      <section>
        <h3 className="mb-2 text-sm font-semibold">Akun (email|token)</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`email1@gmail.com|bearer_token_1\nemail2@gmail.com|bearer_token_2\n\n— atau paste langsung output bookmarklet —`}
          className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
          rows={4}
        />
        <div className="mt-2 flex gap-2">
          <button onClick={handleAdd} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Tambah Akun
          </button>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:opacity-80">
            📤 Upload
            <input type="file" className="hidden" accept=".txt,.csv" onChange={handleFile} />
          </label>
        </div>
        <div className="mt-2 flex gap-2">
          <button onClick={onStartAll} disabled={isRunning || accounts.length === 0} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
            <Play size={14} /> Start All ({accounts.length})
          </button>
          <button onClick={onStopAll} disabled={!isRunning} className="flex items-center gap-1.5 rounded-lg bg-destructive px-6 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50">
            <Square size={14} /> Stop
          </button>
        </div>
      </section>

      {/* Log */}
      <section>
        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
          📟 Log ({logs.length})
        </h3>
        <div ref={logRef} className="h-52 overflow-y-auto rounded-lg border border-border bg-card p-3 font-mono text-xs">
          {logs.length === 0 ? (
            <span className="text-muted-foreground">Belum ada log...</span>
          ) : (
            logs.map((log) => (
              <div key={log.id} className={logColor(log.type)}>
                <span className="text-muted-foreground">[{log.time}]</span> {log.message}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
