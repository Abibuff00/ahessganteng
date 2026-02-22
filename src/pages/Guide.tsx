import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

const Guide = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={18} /></Link>
        <BookOpen size={18} className="text-primary" />
        <span className="text-sm font-bold tracking-widest font-mono">GUIDE & TUTORIAL</span>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Section icon="🤖" title="Apa itu XT Auto Draw?">
          <p className="text-sm text-muted-foreground mb-2">XT Auto Draw adalah tool otomatis untuk:</p>
          <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
            <li><strong className="text-foreground">Auto Draw</strong> — claim hadiah event otomatis</li>
            <li><strong className="text-foreground">Batch Register</strong> — daftar banyak akun sekaligus pakai Gmail dot trick</li>
            <li><strong className="text-foreground">Auto Bind 2FA</strong> — bind Google Authenticator otomatis</li>
            <li><strong className="text-foreground">Auto Withdraw</strong> — tarik saldo semua akun ke 1 tujuan</li>
            <li><strong className="text-foreground">Auto Referral</strong> — input referral code otomatis</li>
            <li><strong className="text-foreground">Gmail Dot Trick</strong> — generate variasi email dari 1 Gmail</li>
            <li><strong className="text-foreground">Secrets Manager</strong> — kelola Google Auth secret permanen</li>
          </ul>
        </Section>

        <Section icon="1️⃣" title="Setup Gmail App Password (untuk Auto OTP)">
          <div className="space-y-3 text-sm text-muted-foreground">
            <h4 className="text-xs font-bold text-foreground tracking-wider">A. AKTIFKAN 2-STEP VERIFICATION</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Buka <a href="https://myaccount.google.com/signinoptions/two-step-verification" target="_blank" className="text-primary hover:underline">Google 2-Step Verification</a></li>
              <li>Klik <strong className="text-foreground">"Get started"</strong></li>
              <li>Ikuti langkah sampai 2FA aktif</li>
            </ol>
            <h4 className="text-xs font-bold text-foreground tracking-wider">B. BUAT APP PASSWORD</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Buka <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-primary hover:underline">Google App Passwords</a></li>
              <li>Ketik nama app: <code className="rounded bg-secondary px-1 text-xs">XT Bot</code></li>
              <li>Klik <strong className="text-foreground">"Create"</strong></li>
              <li>Copy 16-digit password — <strong className="text-destructive">hanya tampil sekali!</strong></li>
            </ol>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs">
              ✅ <strong className="text-foreground">1 App Password untuk semua!</strong> Gmail dot trick semua masuk ke inbox yang sama.
            </div>
          </div>
        </Section>

        <Section icon="2️⃣" title="Gmail Dot Trick — Generate Banyak Email">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Gmail mengabaikan titik di email: <code className="rounded bg-secondary px-1 text-xs text-info">u.ser@gmail.com</code> = <code className="rounded bg-secondary px-1 text-xs text-info">user@gmail.com</code></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Buka tab <strong className="text-foreground">"Register"</strong></li>
              <li>Isi Gmail, App Password, XT Password, Referral Code, Jumlah</li>
              <li>Klik <strong className="text-foreground">"Generate"</strong></li>
            </ol>
          </div>
        </Section>

        <Section icon="3️⃣" title="Batch Register">
          <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Klik <strong className="text-foreground">"Parse & Tambah"</strong> untuk load email ke antrian</li>
            <li>Klik <strong className="text-foreground">"Batch"</strong> untuk mulai registrasi</li>
            <li>Captcha muncul → <strong className="text-warning">selesaikan manual</strong></li>
            <li>Sistem auto: send OTP → fetch OTP → submit → login → join event</li>
          </ol>
        </Section>

        <Section icon="4️⃣" title="Auto Draw — Claim Hadiah">
          <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Buka tab <strong className="text-foreground">"Auto Draw"</strong></li>
            <li>Load akun atau paste manual <code className="rounded bg-secondary px-1 text-xs">email|token</code></li>
            <li>Pastikan custom headers terisi</li>
            <li>Klik <strong className="text-foreground">"Start"</strong></li>
            <li>Lihat progress di Log dan hadiah di Jackpot</li>
          </ol>
        </Section>

        <Section icon="📋" title="Ringkasan Flow">
          <div className="space-y-2">
            {["Setup Gmail App Password", "Grab Custom Headers", "Generate Gmail Dot Tricks", "Batch Register (captcha → auto OTP)", "Bind 2FA ke semua akun", "Withdraw saldo ke 1 akun", "Auto Draw — claim hadiah 🎉"].map((step, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">{i + 1}</span>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
        <span>{icon}</span> {title}
      </h2>
      <div className="rounded-lg border border-border bg-card p-4">{children}</div>
    </section>
  );
}

export default Guide;
