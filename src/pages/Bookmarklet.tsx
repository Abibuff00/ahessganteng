import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bookmark, Copy, Check } from "lucide-react";

const bookmarklets = [
  {
    id: "token",
    icon: "🔑",
    title: "Token Only (Simpel)",
    color: "text-primary",
    bgColor: "bg-primary",
    description: "Langsung ambil bearer token dari cookie/storage. Tidak perlu klik Draw — jalankan bookmarklet aja, token langsung muncul.",
    code: `javascript:void(function(){try{var t='';try{var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var c=cookies[i].trim();if(c.startsWith('token=')){t=c.substring(6)}}}catch(e){}if(!t){try{t=localStorage.getItem('token')||''}catch(e){}}if(!t){try{t=sessionStorage.getItem('token')||''}catch(e){}}var email='';if(t){try{var p=t.split('.')[1];var d=JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/')));email=d.sub||d.userName||d.email||''}catch(e){}}var result='=== XT Token Grabber ===\\n\\nEmail: '+(email||'TIDAK DITEMUKAN')+'\\nToken: '+(t||'TIDAK DITEMUKAN')+'\\n\\n--- Paste langsung ke bot ---\\nemail: '+(email||'')+'\\nbearer: '+(t||'');var ta=document.createElement('textarea');ta.value=result;ta.style.cssText='position:fixed;top:10px;left:10px;width:90vw;height:60vh;z-index:999999;background:#1a1a2e;color:#0f0;font-family:monospace;font-size:12px;padding:16px;border:2px solid #0f0;border-radius:8px';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy')}catch(e){}var btn=document.createElement('button');btn.textContent='✕ Tutup';btn.style.cssText='position:fixed;top:10px;right:10px;z-index:999999;background:#ff4444;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:14px';btn.onclick=function(){ta.remove();btn.remove()};document.body.appendChild(btn)}catch(e){alert('Error: '+e.message)}})()`,
  },
  {
    id: "full",
    icon: "🛡️",
    title: "Full Headers (Token + Fingerprint + Client-Code)",
    color: "text-success",
    bgColor: "bg-success",
    description: "Ambil semua headers termasuk fingerprint & client-code. Pakai ini kalau token aja gak cukup (draw error 403/invalid device).",
    code: `javascript:void(function(){try{var origFetch=window.fetch;var captured=false;window.fetch=function(){var args=arguments;var url=args[0]||'';var opts=args[1]||{};if(!captured&&typeof url==='string'&&url.indexOf('acapi')>-1){captured=true;var h=opts.headers||{};var t=h.token||h.Token||'';var fp=h['bangsheng-finger-print-token']||'';var cc=h['client-code']||'';var email='';if(t){try{var p=t.split('.')[1];var d=JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/')));email=d.sub||d.userName||d.email||''}catch(e){}}var result='=== XT Full Header Grabber ===\\n\\nEmail: '+(email||'?')+'\\nToken: '+(t||'?')+'\\nFingerprint: '+(fp||'?')+'\\nClient-Code: '+(cc||'?');var ta=document.createElement('textarea');ta.value=result;ta.style.cssText='position:fixed;top:10px;left:10px;width:90vw;height:60vh;z-index:999999;background:#1a1a2e;color:#0f0;font-family:monospace;font-size:12px;padding:16px;border:2px solid #0f0;border-radius:8px';document.body.appendChild(ta);ta.focus();ta.select()}return origFetch.apply(this,args)}}catch(e){alert('Error: '+e.message)}})()`,
  },
  {
    id: "spy",
    icon: "🔍",
    title: "Register API Spy",
    color: "text-warning",
    bgColor: "bg-warning",
    description: "Intercept semua API calls saat register di XT.com. Jalankan di halaman register, lalu isi form & klik Sign Up.",
    code: `javascript:void(function(){try{var origFetch=window.fetch;var logs=[];window.fetch=function(){var url=arguments[0]||'';var opts=arguments[1]||{};if(typeof url==='string'&&(url.indexOf('/uaapi/')>-1||url.indexOf('register')>-1||url.indexOf('captcha')>-1)){logs.push('FETCH: '+url+'\\nBody: '+JSON.stringify(opts.body));var div=document.getElementById('xt-spy')||document.createElement('div');div.id='xt-spy';div.style.cssText='position:fixed;top:10px;left:10px;width:90vw;max-height:70vh;z-index:999999;background:#1a1a2e;color:#0f0;font-family:monospace;font-size:11px;padding:16px;border:2px solid #ff0;border-radius:8px;overflow-y:auto;white-space:pre-wrap';div.textContent=logs.join('\\n\\n');document.body.appendChild(div)}return origFetch.apply(this,arguments)}}catch(e){alert('Error: '+e.message)}})()`,
  },
];

export default function BookmarkletPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={18} /></Link>
        <Bookmark size={18} className="text-primary" />
        <span className="text-sm font-bold tracking-widest font-mono">XT HEADER GRABBER</span>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 p-6">
        {bookmarklets.map((b) => (
          <section key={b.id}>
            <h2 className={`mb-3 flex items-center gap-2 text-base font-bold ${b.color}`}>
              <span>{b.icon}</span> {b.title}
            </h2>
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <p className="text-sm text-muted-foreground">{b.description}</p>

              <a
                href={b.code}
                className={`inline-flex items-center gap-1.5 rounded-lg ${b.bgColor} px-4 py-2 text-sm font-medium text-primary-foreground`}
                onClick={(e) => e.preventDefault()}
                draggable
              >
                <span>{b.icon}</span> XT {b.title.split(" ")[0]} {b.title.split(" ")[1]}
              </a>
              <span className="ml-2 text-xs text-muted-foreground">← Drag ke bookmark bar (desktop)</span>

              <div className="relative">
                <pre className="overflow-x-auto rounded-lg border border-border bg-input p-3 text-[10px] text-muted-foreground font-mono leading-relaxed">
                  {b.code.slice(0, 120)}...
                </pre>
                <button
                  onClick={() => copyCode(b.id, b.code)}
                  className="absolute right-2 top-2 flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:opacity-80"
                >
                  {copied === b.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>
          </section>
        ))}

        {/* Usage */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold">📱 Cara Pakai (Desktop & Mobile)</h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Login ke XT.com → buka halaman event</li>
              <li><strong className="text-foreground">Desktop:</strong> Klik bookmarklet dari bookmark bar</li>
              <li><strong className="text-foreground">Mobile:</strong> Copy kode → paste di address bar → tambah <code className="rounded bg-secondary px-1 text-xs text-info">javascript:</code> di depan → Enter</li>
              <li><strong className="text-foreground">Token Only:</strong> Data langsung muncul & ter-copy</li>
              <li><strong className="text-foreground">Full Headers:</strong> Muncul banner hijau → klik Draw 1x → data muncul</li>
              <li>Paste langsung ke bot — format otomatis dikenali</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
