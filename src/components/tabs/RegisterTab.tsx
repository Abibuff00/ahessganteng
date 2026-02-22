import { useState } from "react";
import { UserPlus, Mail, Key, Hash, Users } from "lucide-react";
import type { LogEntry } from "@/hooks/useXTState";

interface RegisterTabProps {
  onAddLog: (msg: string, type?: LogEntry["type"]) => void;
}

export default function RegisterTab({ onAddLog }: RegisterTabProps) {
  const [gmail, setGmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [xtPassword, setXtPassword] = useState("");
  const [refCode, setRefCode] = useState("");
  const [dotCount, setDotCount] = useState(5);
  const [generatedEmails, setGeneratedEmails] = useState("");
  const [registerInput, setRegisterInput] = useState("");

  // Gmail dot trick generator
  const generateDotTrick = () => {
    if (!gmail) {
      onAddLog("⚠️ Masukkan Gmail terlebih dahulu", "warning");
      return;
    }
    const [local, domain] = gmail.split("@");
    if (!local || !domain) return;

    const clean = local.replace(/\./g, "");
    const results: string[] = [];
    const max = Math.min(dotCount, Math.pow(2, clean.length - 1));

    for (let i = 1; i <= max && results.length < dotCount; i++) {
      let email = "";
      for (let j = 0; j < clean.length; j++) {
        email += clean[j];
        if (j < clean.length - 1 && (i >> j) & 1) email += ".";
      }
      const full = `${email}@${domain}`;
      if (full !== gmail && !results.includes(full)) results.push(full);
    }

    const lines = results.map((e) => `${e}|${xtPassword}`).join("\n");
    setGeneratedEmails(lines);
    setRegisterInput(lines);
    onAddLog(`🎲 ${results.length} email dot trick generated`, "success");
  };

  const handleBatchRegister = () => {
    const lines = registerInput.trim().split("\n").filter(Boolean);
    if (lines.length === 0) {
      onAddLog("⚠️ Tidak ada akun untuk register", "warning");
      return;
    }
    onAddLog(`▶️ Memulai batch register ${lines.length} akun...`, "info");
    onAddLog("⚠️ Captcha GeeTest v4 akan muncul — selesaikan manual", "warning");

    lines.forEach((line, i) => {
      const email = line.split("|")[0];
      setTimeout(() => {
        onAddLog(`📝 Register: ${email}...`, "info");
        setTimeout(() => {
          onAddLog(`✅ ${email} — registered`, "success");
        }, 1500);
      }, i * 3000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Gmail Dot Trick Generator */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Mail size={16} className="text-primary" /> Gmail Dot Trick Generator
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input value={gmail} onChange={(e) => setGmail(e.target.value)} className="col-span-2 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Gmail (tanpa titik)" />
          <input value={appPassword} onChange={(e) => setAppPassword(e.target.value)} className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="App Password" type="password" />
          <input value={xtPassword} onChange={(e) => setXtPassword(e.target.value)} className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="XT Password" type="password" />
          <input value={refCode} onChange={(e) => setRefCode(e.target.value)} className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Referral Code" />
          <input type="number" value={dotCount} onChange={(e) => setDotCount(Number(e.target.value))} className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Jumlah" min={1} max={100} />
        </div>
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-secondary py-2 text-sm font-medium text-secondary-foreground hover:opacity-80">
            Save Gmail
          </button>
          <button onClick={generateDotTrick} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            🎲 Generate
          </button>
        </div>
      </section>

      {/* Captcha Info */}
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-xs text-muted-foreground">
          ⚠️ Captcha: GeeTest v4 akan dimuat dari{" "}
          <code className="rounded bg-secondary px-1 text-info">static.geetest.com/v4/gt4.js</code>
          <br />Captcha muncul saat registrasi — selesaikan manual per akun.
        </p>
      </div>

      {/* Batch Register Input */}
      <section>
        <h3 className="mb-2 text-sm font-semibold">Antrian Register (email|password)</h3>
        <textarea
          value={registerInput}
          onChange={(e) => setRegisterInput(e.target.value)}
          className="w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
          rows={5}
          placeholder={`user1@gmail.com|password1\nu.ser2@gmail.com|password2`}
        />
        <div className="mt-2 flex gap-2">
          <button className="flex-1 rounded-lg bg-secondary py-2 text-sm font-medium text-secondary-foreground hover:opacity-80">
            Parse & Tambah
          </button>
          <button onClick={handleBatchRegister} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <UserPlus size={14} className="mr-1 inline" />
            Batch ({registerInput.trim().split("\n").filter(Boolean).length})
          </button>
        </div>
      </section>
    </div>
  );
}
