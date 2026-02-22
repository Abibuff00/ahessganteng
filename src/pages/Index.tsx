import { useState } from "react";
import { Bot, LogIn, Users, UserPlus, Shield, KeyRound, ArrowDownToLine, Play, Square, Trophy, BookOpen, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccounts, useLogs, useJackpots } from "@/hooks/useXTState";
import AutoDrawTab from "@/components/tabs/AutoDrawTab";
import RegisterTab from "@/components/tabs/RegisterTab";
import LoginTab from "@/components/tabs/LoginTab";
import ReferralTab from "@/components/tabs/ReferralTab";
import BindTab from "@/components/tabs/BindTab";
import WithdrawTab from "@/components/tabs/WithdrawTab";
import SecretsTab from "@/components/tabs/SecretsTab";

type TabId = "autodraw" | "login" | "referral" | "register" | "bind" | "withdraw" | "secrets";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "autodraw", label: "Auto Draw", icon: <Bot size={14} /> },
  { id: "login", label: "Login", icon: <LogIn size={14} /> },
  { id: "referral", label: "Referral", icon: <Users size={14} /> },
  { id: "register", label: "Register", icon: <UserPlus size={14} /> },
  { id: "bind", label: "Bind 2FA", icon: <Shield size={14} /> },
  { id: "withdraw", label: "Withdraw", icon: <ArrowDownToLine size={14} /> },
  { id: "secrets", label: "Secrets", icon: <KeyRound size={14} /> },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("autodraw");
  const [isRunning, setIsRunning] = useState(false);
  const { accounts, addFromText, remove, setAllStatus } = useAccounts();
  const { logs, addLog, clearLogs } = useLogs();
  const { jackpots, addJackpot } = useJackpots();

  const startAll = () => {
    if (accounts.length === 0) {
      addLog("⚠️ Tidak ada akun untuk diproses", "warning");
      return;
    }
    setIsRunning(true);
    setAllStatus("Running");
    addLog(`▶️ Memulai draw untuk ${accounts.length} akun...`, "info");

    accounts.forEach((account, index) => {
      setTimeout(() => {
        addLog(`🎰 Drawing: ${account.email}...`, "info");
        setTimeout(() => {
          const prizes = ["10 USDT", "5 SHIB", "1 XT", "0.5 USDT", "100 SHIB"];
          const prize = prizes[Math.floor(Math.random() * prizes.length)];
          addLog(`🎉 ${account.email} → ${prize}`, "success");
          addJackpot(account.email, prize);
          if (index === accounts.length - 1) {
            setIsRunning(false);
            setAllStatus("Done");
            addLog("🏁 Semua draw selesai!", "success");
          }
        }, 1000);
      }, index * 2500);
    });
  };

  const stopAll = () => {
    setIsRunning(false);
    setAllStatus("Idle");
    addLog("⏹️ Proses dihentikan", "warning");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Bot className="text-primary" size={22} />
          <span className="text-base font-bold tracking-wider font-mono">XT AUTO DRAW</span>
          <span className="rounded bg-secondary px-2 py-0.5 text-[10px] text-primary font-mono">v3.0</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/guide" className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs text-secondary-foreground hover:opacity-80">
            <BookOpen size={12} /> Guide
          </Link>
          <Link to="/bookmarklet" className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs text-secondary-foreground hover:opacity-80">
            <Bookmark size={12} /> Grabber
          </Link>
          <button onClick={startAll} disabled={isRunning} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
            <Play size={14} />
          </button>
          <button onClick={stopAll} disabled={!isRunning} className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
            <Square size={14} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-border scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 text-xs font-medium transition-colors ${
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
      <div className="mx-auto max-w-2xl p-4">
        {activeTab === "autodraw" && (
          <AutoDrawTab
            accounts={accounts}
            onAddAccounts={addFromText}
            onRemove={remove}
            onStartAll={startAll}
            onStopAll={stopAll}
            isRunning={isRunning}
            logs={logs}
            onAddLog={addLog}
          />
        )}
        {activeTab === "login" && <LoginTab onAddLog={addLog} />}
        {activeTab === "referral" && <ReferralTab onAddLog={addLog} />}
        {activeTab === "register" && <RegisterTab onAddLog={addLog} />}
        {activeTab === "bind" && <BindTab onAddLog={addLog} />}
        {activeTab === "withdraw" && <WithdrawTab onAddLog={addLog} />}
        {activeTab === "secrets" && <SecretsTab />}

        {/* Jackpot - visible on autodraw */}
        {activeTab === "autodraw" && (
          <section className="mt-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Trophy size={16} className="text-warning" /> Jackpot ({jackpots.length})
            </h3>
            <div className="rounded-lg border border-border bg-card p-3">
              {jackpots.length === 0 ? (
                <span className="text-sm text-muted-foreground">Belum ada jackpot...</span>
              ) : (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {jackpots.map((j) => (
                    <div key={j.id} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{j.email}</span>
                      <span className="text-warning font-medium">{j.prize}</span>
                      <span className="text-muted-foreground">{j.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <footer className="mt-6 pb-6 text-center text-xs text-muted-foreground font-mono">
          by Mr. Silent
        </footer>
      </div>
    </div>
  );
};

export default Index;
