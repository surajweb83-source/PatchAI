import { useState, useRef } from "react";

function smartReplace(content, search, replace) {
  // 1. Exact match
  if (content.includes(search)) {
    const count = content.split(search).length - 1;
    return { result: content.split(search).join(replace), count, method: "exact" };
  }

  // 2. Smart match — spaces/tabs ignore karke dhundho
  const norm = (str) => str.split("\n").map((l) => l.trim().replace(/\s+/g, " ")).join("\n");
  const normContent = norm(content);
  const normSearch = norm(search);

  if (normContent.includes(normSearch)) {
    const contentLines = content.split("\n");
    const searchNormLines = search.split("\n").map((l) => l.trim().replace(/\s+/g, " "));
    const replaceLines = replace.split("\n");

    let matchStart = -1;
    outer: for (let i = 0; i <= contentLines.length - searchNormLines.length; i++) {
      for (let j = 0; j < searchNormLines.length; j++) {
        if (contentLines[i + j].trim().replace(/\s+/g, " ") !== searchNormLines[j]) continue outer;
      }
      matchStart = i;
      break;
    }

    if (matchStart !== -1) {
      const newLines = [
        ...contentLines.slice(0, matchStart),
        ...replaceLines,
        ...contentLines.slice(matchStart + searchNormLines.length),
      ];
      return { result: newLines.join("\n"), count: 1, method: "smart" };
    }
  }

  return null;
}

export default function PatchAI() {
  const [file, setFile] = useState(null);
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [msg, setMsg] = useState(null);
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
    if (!file) return setMsg({ ok: false, text: "⚠️ Pehle file upload karo!" });
    if (!oldCode.trim()) return setMsg({ ok: false, text: "⚠️ Purana code khali hai!" });

    const res = smartReplace(file.content, oldCode, newCode);

    if (!res) {
      return setMsg({
        ok: false,
        text: "❌ Yeh code file mein nahi mila!\n\nCheck karo:\n• Sahi file upload hui?\n• Purana code sahi copy kiya?",
      });
    }

    setFile({ ...file, content: res.result });
    setOldCode("");
    setNewCode("");
    setMsg({
      ok: true,
      text: res.method === "exact"
        ? `✅ ${res.count} jagah replace ho gaya!`
        : `✅ Replace ho gaya! (Spaces ignore karke mila)`,
    });
  };

  const download = () => {
    if (!file) return;
    const blob = new Blob([file.content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
  };

  const lines = file ? file.content.split("\n").length : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#f1f5f9", padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; font-family: 'JetBrains Mono', monospace; }
        body { margin: 0; background: #0f1117; }
        textarea:focus { outline: none; border-color: #0ea5e9 !important; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#38bdf8" }}>&lt;PatchAI /&gt;</div>
        <div style={{ fontSize: 11, color: "#334155", marginTop: 4, letterSpacing: 3 }}>CODE EDITOR</div>
      </div>

      {/* STEP 1 — Upload */}
      <div style={card}>
        <div style={stepLabel}>① File Upload</div>
        {!file ? (
          <button style={uploadBtn} onClick={() => fileRef.current?.click()}>
            📂 &nbsp; File Choose Karo
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: "#052e16", border: "1px solid #166534", borderRadius: 8, padding: "11px 14px", color: "#4ade80", fontSize: 13 }}>
              ✅ &nbsp;{file.name} &nbsp;·&nbsp; {lines} lines
            </div>
            <button style={{ padding: "11px 14px", background: "#1c0a0a", border: "1px solid #7f1d1d", borderRadius: 8, color: "#f87171", cursor: "pointer" }}
              onClick={() => { setFile(null); setMsg(null); setOldCode(""); setNewCode(""); }}>
              ✕
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => loadFile(e.target.files[0])} />
      </div>

      {/* STEP 2 — Replace */}
      <div style={card}>
        <div style={stepLabel}>② Search &amp; Replace</div>

        <div style={fieldLabel}>🔴 &nbsp;Purana Code — jo hatana / badalna hai</div>
        <textarea
          style={{ ...ta, borderColor: "#7f1d1d", background: "#150505" }}
          rows={6}
          placeholder={"Yahan purana code paste karo...\n\nTelegram se copy karo — spaces bhi chalenge"}
          value={oldCode}
          onChange={(e) => setOldCode(e.target.value)}
        />

        <div style={{ ...fieldLabel, marginTop: 14 }}>🟢 &nbsp;Naya Code — jo daalna hai</div>
        <textarea
          style={{ ...ta, borderColor: "#14532d", background: "#052e16" }}
          rows={6}
          placeholder={"Yahan naya code paste karo...\n\n(Khali chhodo agar sirf delete karna hai)"}
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
        />

        <button style={replaceBtn} onClick={doReplace}>
          🔄 &nbsp; Replace Karo
        </button>
      </div>

      {/* Status */}
      {msg && (
        <div style={{
          background: msg.ok ? "#052e16" : "#150505",
          border: `1px solid ${msg.ok ? "#166534" : "#7f1d1d"}`,
          color: msg.ok ? "#4ade80" : "#f87171",
          borderRadius: 10, padding: "14px 16px",
          fontSize: 13, marginBottom: 14, whiteSpace: "pre-line", lineHeight: 1.8,
        }}>
          {msg.text}
        </div>
      )}

      {/* Download */}
      {file && (
        <button style={dlBtn} onClick={download}>
          ⬇️ &nbsp; Download &nbsp;{file.name}
        </button>
      )}

      <div style={{ height: 40 }} />
    </div>
  );
}

const card = { background: "#161b27", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 14 };
const stepLabel = { fontSize: 14, fontWeight: 700, color: "#38bdf8", marginBottom: 12, letterSpacing: 0.5 };
const fieldLabel = { fontSize: 12, color: "#64748b", marginBottom: 6 };
const uploadBtn = { width: "100%", padding: 16, background: "#1e293b", border: "2px dashed #334155", color: "#94a3b8", borderRadius: 10, fontSize: 15, cursor: "pointer" };
const ta = { width: "100%", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", padding: 12, resize: "vertical", lineHeight: 1.7, fontSize: 13 };
const replaceBtn = { width: "100%", marginTop: 14, padding: 15, background: "#0c4a6e", border: "1px solid #0ea5e9", color: "#38bdf8", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" };
const dlBtn = { width: "100%", padding: 16, background: "#052e16", border: "1px solid #166534", color: "#4ade80", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" };
