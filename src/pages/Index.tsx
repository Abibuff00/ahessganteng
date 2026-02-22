import { useState } from "react";
import { Bot, LogIn, Users, UserPlus, Lock, Play, Square, Terminal, Trophy } from "lucide-react";

type TabId = "autodraw" | "login" | "referral" | "register" | "bind";

interface Account {
  id: string;
  email: string;
  status: "Idle" | "Running" | "Done" | "Error";
}

interface LogEntry {
  id: number;
  time: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "autodraw", label: "Auto Draw", icon: <Bot size={16} /> },
  { id: "login", label: "Login", icon: <LogIn size={16} /> },
  { id: "referral", label: "Referral", icon: <Users size={16} /> },
  { id: "register", label: "Register", icon: <UserPlus size={16} /> },
  { id: "bind", label: "Bind", icon: <Lock size={16} /> },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("autodraw");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountInput, setAccountInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [referralLink, setReferralLink] = useState("https://www.xt.com/en/accounts/register?ref=");
  const [jackpots, setJackpots] = useState<string[]>([]);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now(), time: new Date().toLocaleTimeString(), message, type },
    ]);
  };

  const addAccounts = () => {
    const lines = accountInput.trim().split("\n").filter(Boolean);
    const newAccounts: Account[] = lines.map((line, i) => ({
      id: `${Date.now()}-${i}`,
      email: line.split("|")[0].trim(),
      status: "Idle",
    }));
    setAccounts((prev) => [...prev, ...newAccounts]);
    setAccountInput("");
    addLog(`✅ ${newAccounts.length} akun ditambahkan`, "success");
  };

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const startAll = () => {
    if (accounts.length === 0) {
      addLog("⚠️ Tidak ada akun untuk diproses", "warning");
      return;
    }
    setIsRunning(true);
    setAccounts((prev) => prev.map((a) => ({ ...a, status: "Running" })));
    addLog(`▶️ Memulai proses untuk ${accounts.length} akun...`, "info");

    // Simulate processing
    accounts.forEach((account, index) => {
      setTimeout(() => {
        setAccounts((prev) =>
          prev.map((a) => (a.id === account.id ? { ...a, status: "Done" } : a))
        );
        addLog(`✅ ${account.email} - Selesai`, "success");
        if (index === accounts.length - 1) {
          setIsRunning(false);
          addLog("🏁 Semua proses selesai", "success");
        }
      }, (index + 1) * 2000);
    });
  };

  const stopAll = () => {
    setIsRunning(false);
    setAccounts((prev) => prev.map((a) => ({ ...a, status: "Idle" })));
    addLog("⏹️ Proses dihentikan", "warning");
  };

  const statusColor = (status: Account["status"]) => {
    switch (status) {
      case "Running": return "text-info";
      case "Done": return "text-success";
      case "Error": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const logColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success": return "text-success";
      case "error": return "text-destructive";
      case "warning": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Bot className="text-primary" size={24} />
          <span className="text-lg font-bold tracking-tight">XT Auto Tool</span>
          <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startAll}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Play size={14} /> Start
          </button>
          <button
            onClick={stopAll}
            disabled={!isRunning}
            className="flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Square size={14} /> Stop
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-4 p-4">
        {/* Auto Draw Tab */}
        {activeTab === "autodraw" && (
          <>
            {/* Saved Accounts */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Saved Akun ({accounts.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => addLog("🔍 Checking semua akun...", "info")}
                    className="rounded bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:opacity-80"
                  >
                    Check All
                  </button>
                  <button
                    onClick={startAll}
                    className="flex items-center gap-1 rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90"
                  >
                    <Play size={12} /> Start All
                  </button>
                </div>
              </div>

              {accounts.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
                  Belum ada akun...
                </div>
              ) : (
                <div className="space-y-1">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2"
                    >
                      <span className="text-sm text-foreground">{account.email}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium ${statusColor(account.status)}`}>
                          {account.status}
                        </span>
                        <button
                          onClick={() => removeAccount(account.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Add Accounts */}
            <section>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Akun (email|token)
              </h3>
              <textarea
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder={`email1@gmail.com|bearer_token_1\nemail2@gmail.com|bearer_token_2\n\n— atau paste langsung output bookmarklet —`}
                className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                rows={5}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={addAccounts}
                  className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Tambah Akun
                </button>
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground transition-opacity hover:opacity-80">
                  📤 Upload
                  <input type="file" className="hidden" accept=".txt,.csv" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setAccountInput(ev.target?.result as string);
                      addLog(`📄 File ${file.name} dimuat`, "info");
                    };
                    reader.readAsText(file);
                  }} />
                </label>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={startAll}
                  disabled={isRunning}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Play size={14} /> Start All ({accounts.length})
                </button>
                <button
                  onClick={stopAll}
                  disabled={!isRunning}
                  className="flex items-center gap-1.5 rounded-lg bg-destructive px-6 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Square size={14} /> Stop
                </button>
              </div>
            </section>
          </>
        )}

        {/* Register Tab */}
        {activeTab === "register" && (
          <section className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Link Referral</h3>
              <input
                value={referralLink}
                onChange={(e) => setReferralLink(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="https://www.xt.com/en/accounts/register?ref=YOUR_CODE"
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Email List (satu per baris)</h3>
              <textarea
                placeholder={`email1@gmail.com|password1\nemail2@gmail.com|password2`}
                className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                rows={5}
              />
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">
                ⚠️ Captcha: GeeTest v4 akan diload otomatis dari{" "}
                <code className="rounded bg-secondary px-1 text-info">static.geetest.com/v4/gt4.js</code>
              </p>
            </div>
            <button
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <UserPlus size={14} /> Start Register
            </button>
          </section>
        )}

        {/* Login Tab */}
        {activeTab === "login" && (
          <section className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Login Akun</h3>
              <textarea
                placeholder={`email1@gmail.com|password1\nemail2@gmail.com|password2`}
                className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                rows={5}
              />
            </div>
            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <LogIn size={14} /> Start Login
            </button>
          </section>
        )}

        {/* Referral Tab */}
        {activeTab === "referral" && (
          <section className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Referral Code</h3>
              <input
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Masukkan referral code"
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Akun untuk referral</h3>
              <textarea
                placeholder={`email1@gmail.com|bearer_token_1\nemail2@gmail.com|bearer_token_2`}
                className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                rows={4}
              />
            </div>
            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Users size={14} /> Start Referral
            </button>
          </section>
        )}

        {/* Bind Tab */}
        {activeTab === "bind" && (
          <section className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Bind Akun</h3>
              <textarea
                placeholder={`email1@gmail.com|bearer_token_1\nemail2@gmail.com|bearer_token_2`}
                className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                rows={5}
              />
            </div>
            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Lock size={14} /> Start Bind
            </button>
          </section>
        )}

        {/* Log Section */}
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Terminal size={16} /> Log ({logs.length})
          </h3>
          <div className="h-48 overflow-y-auto rounded-lg border border-border bg-card p-3 font-mono text-xs">
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

        {/* Jackpot Section */}
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Trophy size={16} className="text-warning" /> Jackpot ({jackpots.length})
          </h3>
          <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            {jackpots.length === 0 ? "Belum ada jackpot..." : jackpots.map((j, i) => <div key={i}>{j}</div>)}
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-6 pt-2 text-center text-xs text-muted-foreground">
          by XT Auto Tool
        </footer>
      </div>
    </div>
  );
};

export default Index;
