import { useState, useRef } from "react";

export default function PatchAI() {
  const [file, setFile] = useState(null); // {name, content}
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [tab, setTab] = useState("replace"); // "replace" | "ai"
  const [msg, setMsg] = useState(null); // {ok, text}
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const loadFile = (f) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile({ name: f.name, content: e.target.result });
      setMsg(null);
    };
    reader.readAsText(f);
  };

  const doReplace = () => {
    if (!file) return setMsg({ ok: false, text: "Pehle file upload karo!" });
    if (!oldCode.trim()) return setMsg({ ok: false, text: "Purana code khali hai!" });
    if (!file.content.includes(oldCode))
      return setMsg({ ok: false, text: "❌ Yeh code file mein nahi mila!\nExact copy-paste karo." });
    const count = file.content.split(oldCode).length - 1;
    const updated = file.content.split(oldCode).join(newCode);
    setFile({ ...file, content: updated });
    setOldCode("");
    setNewCode("");
    setMsg({ ok: true, text: `✅ ${count} jagah replace ho gaya!` });
  };

  const doAI = async () => {
    if (!file) return setMsg({ ok: false, text: "Pehle file upload karo!" });
    if (!aiPrompt.trim()) return setMsg({ ok: false, text: "Prompt likho!" });
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: `You are a code editor. User gives you a file and instruction.
Return ONLY the modified raw code. No explanation. No markdown. No backticks. Just the file content.`,
          messages: [{ role: "user", content: `FILE: ${file.name}\n\n${file.content}\n\nINSTRUCTION: ${aiPrompt}` }],
        }),
      });
      const data = await res.json();
      const result = (data.content?.[0]?.text || "").replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
      if (result) {
        setFile({ ...file, content: result });
        setAiPrompt("");
        setMsg({ ok: true, text: "✅ AI ne edit kar diya!" });
      } else {
        setMsg({ ok: false, text: "AI se jawab nahi aaya, dobara try karo." });
      }
    } catch (e) {
      setMsg({ ok: false, text: "Error: " + e.message });
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!file) return;
    const blob = new Blob([file.content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#f1f5f9", fontFamily: "monospace", padding: 16 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        textarea { font-family: 'JetBrains Mono', monospace !important; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace" }}>
          &lt;PatchAI /&gt;
        </div>
        {file && (
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            📄 {file.name} · {file.content.split("\n").length} lines
          </div>
        )}
      </div>

      {/* Step 1 — Upload */}
      <div style={box}>
        <div style={label}>Step 1 — File Upload karo</div>
        {!file ? (
          <button style={uploadBtn} onClick={() => fileRef.current?.click()}>
            📂 File Choose Karo
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: "#1e293b", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#4ade80" }}>
              ✅ {file.name}
            </div>
            <button style={{ ...smallBtn, color: "#f87171" }} onClick={() => { setFile(null); setMsg(null); }}>
              ✕
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => loadFile(e.target.files[0])} />
      </div>

      {/* Step 2 — Tabs */}
      <div style={box}>
        <div style={label}>Step 2 — Kya karna hai?</div>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            style={{ ...tabBtn, ...(tab === "replace" ? tabActive : {}) }}
            onClick={() => setTab("replace")}
          >
            🔍 Search & Replace
          </button>
          <button
            style={{ ...tabBtn, ...(tab === "ai" ? tabActive : {}) }}
            onClick={() => setTab("ai")}
          >
            🤖 AI se Kaho
          </button>
        </div>

        {/* Search & Replace Tab */}
        {tab === "replace" && (
          <div>
            <div style={subLabel}>Purana Code (jo badalna hai) — exact copy karo:</div>
            <textarea
              style={ta}
              rows={5}
              placeholder={"Yahan purana code paste karo...\n\n(Bot prompt se seedha copy karo)"}
              value={oldCode}
              onChange={(e) => setOldCode(e.target.value)}
            />
            <div style={{ ...subLabel, marginTop: 12 }}>Naya Code (jo daalna hai):</div>
            <textarea
              style={{ ...ta, borderColor: "#14532d" }}
              rows={5}
              placeholder={"Yahan naya code paste karo...\n\n(Khali chhodo agar sirf delete karna hai)"}
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
            <button style={mainBtn} onClick={doReplace}>
              🔄 Replace Karo
            </button>
          </div>
        )}

        {/* AI Tab */}
        {tab === "ai" && (
          <div>
            <div style={subLabel}>AI ko batao kya karna hai (Hindi/English dono chalega):</div>
            <textarea
              style={ta}
              rows={4}
              placeholder={"Jaise:\n• BOT_TOKEN wali line delete karo\n• API_ID 12345 se replace karo\n• Saare comments hata do"}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button
              style={{ ...mainBtn, ...(loading ? { opacity: 0.5 } : {}) }}
              onClick={doAI}
              disabled={loading}
            >
              {loading ? "⏳ AI kaam kar raha hai..." : "✨ AI se Edit Karo"}
            </button>
          </div>
        )}
      </div>

      {/* Status message */}
      {msg && (
        <div style={{
          background: msg.ok ? "#052e16" : "#1c0a0a",
          border: `1px solid ${msg.ok ? "#166534" : "#7f1d1d"}`,
          color: msg.ok ? "#4ade80" : "#f87171",
          borderRadius: 10,
          padding: "12px 16px",
          fontSize: 14,
          marginBottom: 12,
          whiteSpace: "pre-line",
        }}>
          {msg.text}
        </div>
      )}

      {/* Download */}
      {file && (
        <button style={dlBtn} onClick={download}>
          ⬇️ Download {file.name}
        </button>
      )}
    </div>
  );
}

// Styles
const box = {
  background: "#161b27",
  border: "1px solid #1e293b",
  borderRadius: 12,
  padding: 16,
  marginBottom: 14,
};

const label = {
  fontSize: 15,
  fontWeight: 700,
  color: "#94a3b8",
  marginBottom: 12,
  fontFamily: "'JetBrains Mono', monospace",
};

const subLabel = {
  fontSize: 12,
  color: "#64748b",
  marginBottom: 6,
};

const uploadBtn = {
  width: "100%",
  padding: 14,
  background: "#1e293b",
  border: "2px dashed #334155",
  color: "#94a3b8",
  borderRadius: 10,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'JetBrains Mono', monospace",
};

const smallBtn = {
  padding: "10px 14px",
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  color: "#94a3b8",
};

const tabBtn = {
  flex: 1,
  padding: 11,
  background: "#1e293b",
  border: "1px solid #334155",
  color: "#64748b",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 13,
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 600,
};

const tabActive = {
  background: "#0c2340",
  border: "1px solid #0ea5e9",
  color: "#38bdf8",
};

const ta = {
  width: "100%",
  background: "#0f1117",
  border: "1px solid #1e293b",
  borderRadius: 8,
  color: "#e2e8f0",
  fontSize: 13,
  padding: 12,
  outline: "none",
  resize: "vertical",
  lineHeight: 1.6,
};

const mainBtn = {
  width: "100%",
  marginTop: 12,
  padding: 14,
  background: "#0c4a6e",
  border: "1px solid #0ea5e9",
  color: "#38bdf8",
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'JetBrains Mono', monospace",
};

const dlBtn = {
  width: "100%",
  padding: 16,
  background: "#052e16",
  border: "1px solid #166534",
  color: "#4ade80",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'JetBrains Mono', monospace",
};
