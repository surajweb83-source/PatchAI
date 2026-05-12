import { useState, useRef } from "react";

const S = {
  app: {
    minHeight: "100vh",
    background: "#07080d",
    color: "#e2e8f0",
    fontFamily: "'Fira Code', 'Courier New', monospace",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    borderBottom: "1px solid #1a1f2e",
    background: "#090b12",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: { display: "flex", alignItems: "center", gap: 2 },
  logoBracket: { color: "#00e5ff", fontSize: 22, fontWeight: 700 },
  logoName: { color: "#f0f4ff", fontSize: 20, fontWeight: 700, letterSpacing: 1 },
  logoSub: { color: "#4a5568", fontSize: 11, marginLeft: 10, letterSpacing: 2 },
  fileTag: {
    background: "#111827",
    border: "1px solid #1e2d40",
    color: "#00e5ff",
    padding: "3px 10px",
    borderRadius: 4,
    fontSize: 12,
  },
  main: { padding: "24px 20px", maxWidth: 1200, margin: "0 auto" },
  dropZone: {
    border: "2px dashed #1e2d40",
    borderRadius: 12,
    padding: "60px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    background: "#0c0e17",
    marginTop: 20,
  },
  dropZoneActive: {
    border: "2px dashed #00e5ff",
    background: "#0a1520",
    transform: "scale(1.01)",
  },
  dropIcon: { fontSize: 52, marginBottom: 14 },
  dropTitle: { fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 },
  dropSub: { color: "#64748b", fontSize: 14, marginBottom: 6 },
  dropHint: {
    color: "#334155",
    fontSize: 12,
    marginTop: 14,
    background: "#0f1117",
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: 20,
    border: "1px solid #1e2d40",
  },
  layout: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  codePanel: {
    flex: "1 1 480px",
    background: "#0c0e17",
    border: "1px solid #1a1f2e",
    borderRadius: 10,
    overflow: "hidden",
  },
  panelBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "#0f1219",
    borderBottom: "1px solid #1a1f2e",
  },
  panelBarLeft: { display: "flex", gap: 6 },
  dot: {
    width: 11, height: 11, borderRadius: "50%",
  },
  panelTitle: { color: "#94a3b8", fontSize: 12, marginLeft: 8 },
  closeBtn: {
    background: "none",
    border: "1px solid #1e2d40",
    color: "#64748b",
    fontSize: 11,
    padding: "2px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },
  codeTextarea: {
    width: "100%",
    minHeight: 460,
    background: "#0c0e17",
    color: "#a8d8a8",
    border: "none",
    outline: "none",
    padding: "16px",
    fontSize: 12.5,
    lineHeight: 1.7,
    fontFamily: "'Fira Code', monospace",
    resize: "vertical",
    boxSizing: "border-box",
    tabSize: 2,
  },
  controlPanel: {
    flex: "0 1 320px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  card: {
    background: "#0c0e17",
    border: "1px solid #1a1f2e",
    borderRadius: 10,
    padding: 16,
  },
  cardTitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  exTitle: { color: "#475569", fontSize: 11, marginBottom: 6 },
  exampleChip: {
    background: "#111827",
    border: "1px solid #1e2d40",
    borderRadius: 5,
    padding: "5px 10px",
    fontSize: 11,
    color: "#64748b",
    cursor: "pointer",
    marginBottom: 5,
    display: "block",
    transition: "all 0.15s",
    lineHeight: 1.4,
  },
  promptTextarea: {
    width: "100%",
    background: "#090b12",
    border: "1px solid #1e2d40",
    borderRadius: 7,
    color: "#e2e8f0",
    fontSize: 13,
    padding: "10px 12px",
    fontFamily: "'Fira Code', monospace",
    resize: "vertical",
    outline: "none",
    marginTop: 8,
    boxSizing: "border-box",
    lineHeight: 1.6,
  },
  aiButton: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #003d52, #005f7a)",
    border: "1px solid #00e5ff44",
    color: "#00e5ff",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 10,
    letterSpacing: 0.5,
    transition: "all 0.2s",
    fontFamily: "'Fira Code', monospace",
  },
  aiButtonLoading: {
    background: "linear-gradient(135deg, #1a1f2e, #242938)",
    color: "#4a5568",
    cursor: "not-allowed",
  },
  statusSuccess: {
    background: "#052010",
    border: "1px solid #134726",
    color: "#4ade80",
    padding: "10px 14px",
    borderRadius: 7,
    fontSize: 12,
  },
  statusError: {
    background: "#150505",
    border: "1px solid #3b1111",
    color: "#f87171",
    padding: "10px 14px",
    borderRadius: 7,
    fontSize: 12,
  },
  downloadBtn: {
    width: "100%",
    padding: "11px",
    background: "linear-gradient(135deg, #003520, #004d30)",
    border: "1px solid #00ff8844",
    color: "#4ade80",
    fontSize: 13,
    fontWeight: 700,
    borderRadius: 7,
    cursor: "pointer",
    fontFamily: "'Fira Code', monospace",
    letterSpacing: 0.3,
  },
  undoBtn: {
    width: "100%",
    padding: "10px",
    background: "#0f1117",
    border: "1px solid #1e2d40",
    color: "#64748b",
    fontSize: 13,
    borderRadius: 7,
    cursor: "pointer",
    fontFamily: "'Fira Code', monospace",
    marginTop: 7,
  },
  statsRow: {
    display: "flex",
    gap: 8,
  },
  statCard: {
    flex: 1,
    background: "#090b12",
    border: "1px solid #1a1f2e",
    borderRadius: 8,
    padding: "10px 8px",
    textAlign: "center",
  },
  statNum: { fontSize: 18, fontWeight: 700, color: "#00e5ff", display: "block" },
  statLabel: { fontSize: 10, color: "#4a5568", letterSpacing: 0.5 },
};

const EXAMPLES = [
  "Replace API_ID = 33405683 with API_ID = 0",
  "Delete all #comment lines",
  "Remove the function named old_func completely",
  "Add try-except to every function",
];

export default function PatchAI() {
  const [fileName, setFileName] = useState("");
  const [code, setCode] = useState("");
  const [origCode, setOrigCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // {type, msg}
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);

  const loadFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const txt = e.target.result;
      setCode(txt);
      setOrigCode(txt);
      setFileName(file.name);
      setStatus(null);
      setPrompt("");
    };
    reader.readAsText(file);
  };

  const runAI = async () => {
    if (!code) return setStatus({ type: "err", msg: "⚠️ Pehle file upload karo!" });
    if (!prompt.trim()) return setStatus({ type: "err", msg: "⚠️ Prompt khali hai, kuch likho!" });
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: `You are a precise code file editor.
The user will send you a code file and an instruction.
Return ONLY the modified raw code — no explanation, no markdown, no triple backticks, no comments about what you changed.
Just the final file content exactly as it should be saved.`,
          messages: [{
            role: "user",
            content: `FILE NAME: ${fileName}\n\nFILE CONTENT:\n${code}\n\nINSTRUCTION: ${prompt}`,
          }],
        }),
      });
      const data = await res.json();
      const result = data.content?.[0]?.text || "";
      if (result) {
        // Strip any accidental backtick wrapping
        const clean = result.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
        setCode(clean);
        setStatus({ type: "ok", msg: "✅ Done! AI ne code edit kar diya. Download karo." });
        setPrompt("");
      } else {
        setStatus({ type: "err", msg: "❌ AI se response nahi aaya. Dobara try karo." });
      }
    } catch (e) {
      setStatus({ type: "err", msg: "❌ Error: " + e.message });
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "edited_code.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lines = code ? code.split("\n").length : 0;

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        textarea:focus { border-color: #00e5ff44 !important; }
        .ex:hover { border-color: #00e5ff55 !important; color: #94a3b8 !important; background: #0f1419 !important; }
        .ai-btn:hover:not(:disabled) { background: linear-gradient(135deg,#004d66,#007a9e) !important; box-shadow: 0 0 18px #00e5ff22; }
        .dl-btn:hover { background: linear-gradient(135deg,#004228,#006640) !important; box-shadow: 0 0 14px #00ff8818; }
        .undo-btn:hover { background: #111827 !important; color: #94a3b8 !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #090b12; }
        ::-webkit-scrollbar-thumb { background: #1e2d40; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <header style={S.header}>
        <div style={S.logo}>
          <span style={S.logoBracket}>&lt;</span>
          <span style={S.logoName}>PatchAI</span>
          <span style={S.logoBracket}>/&gt;</span>
          <span style={S.logoSub}>AI CODE EDITOR</span>
        </div>
        {fileName && <span style={S.fileTag}>📄 {fileName} · {lines} lines</span>}
      </header>

      <main style={S.main}>
        {/* Upload zone */}
        {!code && (
          <div
            style={{ ...S.dropZone, ...(drag ? S.dropZoneActive : {}) }}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
          >
            <div style={S.dropIcon}>⚡</div>
            <div style={S.dropTitle}>Code File Upload Karo</div>
            <div style={S.dropSub}>Drag & drop ya click karo</div>
            <div style={S.dropHint}>.py · .js · .html · .css · .txt · koi bhi file</div>
            <input ref={fileRef} type="file" style={{ display: "none" }}
              onChange={(e) => loadFile(e.target.files[0])} />
          </div>
        )}

        {/* Editor layout */}
        {code && (
          <div style={S.layout}>
            {/* Code panel */}
            <div style={S.codePanel}>
              <div style={S.panelBar}>
                <div style={S.panelBarLeft}>
                  <div style={{ ...S.dot, background: "#ff5f57" }} />
                  <div style={{ ...S.dot, background: "#ffbd2e" }} />
                  <div style={{ ...S.dot, background: "#28c840" }} />
                  <span style={S.panelTitle}>{fileName}</span>
                </div>
                <button style={S.closeBtn} onClick={() => { setCode(""); setFileName(""); setOrigCode(""); setStatus(null); }}>
                  ✕ Close
                </button>
              </div>
              <textarea
                style={S.codeTextarea}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            {/* Control panel */}
            <div style={S.controlPanel}>

              {/* Stats */}
              <div style={S.statsRow}>
                {[
                  { n: lines, l: "Lines" },
                  { n: code.length, l: "Chars" },
                  { n: (code.match(/def |function |const |class /g) || []).length, l: "Funcs" },
                ].map((s, i) => (
                  <div key={i} style={S.statCard}>
                    <span style={S.statNum}>{s.n}</span>
                    <span style={S.statLabel}>{s.l}</span>
                  </div>
                ))}
              </div>

              {/* AI Prompt */}
              <div style={S.card}>
                <div style={S.cardTitle}>
                  <span>🤖</span> AI Prompt
                </div>
                <div style={S.exTitle}>Quick examples (click karke use karo):</div>
                {EXAMPLES.map((ex, i) => (
                  <span key={i} className="ex" style={S.exampleChip}
                    onClick={() => setPrompt(ex)}>{ex}</span>
                ))}
                <textarea
                  style={S.promptTextarea}
                  placeholder={"Yahan likho kya karna hai...\n\nJaise: 'BOT_TOKEN wali line delete karo'\nYa: 'Replace X with Y'"}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
                <button
                  className="ai-btn"
                  style={{ ...S.aiButton, ...(loading ? S.aiButtonLoading : {}) }}
                  onClick={runAI}
                  disabled={loading}
                >
                  {loading ? "⏳ AI kaam kar raha hai..." : "✨ AI se Edit Karo"}
                </button>
              </div>

              {/* Status */}
              {status && (
                <div style={status.type === "ok" ? S.statusSuccess : S.statusError}>
                  {status.msg}
                </div>
              )}

              {/* Download & Undo */}
              <div>
                <button className="dl-btn" style={S.downloadBtn} onClick={download}>
                  ⬇️ Download {fileName}
                </button>
                <button className="undo-btn" style={S.undoBtn}
                  onClick={() => { setCode(origCode); setStatus({ type: "ok", msg: "↩️ Original code restore ho gaya!" }); }}>
                  ↩️ Original Restore (Undo All)
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
