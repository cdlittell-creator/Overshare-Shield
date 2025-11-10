import React, { useState } from "react";

function App() {
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [text, setText] = useState("");
    const [analysis, setAnalysis] = useState(null);

    // Image upload handler
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://127.0.0.1:8000/analyze-image/", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setMetadata(data.metadata || data.error);
    };

    // Text analysis handler
    const handleTextAnalysis = async (e) => {
        e.preventDefault();

        const res = await fetch("http://127.0.0.1:8000/analyze-text/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(text),
        });

        const data = await res.json();
        setAnalysis(data);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
            <h1>??? OverShare Shield</h1>

            {/* IMAGE UPLOAD */}
            <form onSubmit={handleUpload}>
                <h3>1?? Image Metadata Analysis</h3>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit" style={{ marginLeft: "10px" }}>
                    Analyze Image
                </button>
            </form>

            {metadata && (
                <div style={{ marginTop: "20px", textAlign: "left", display: "inline-block" }}>
                    <h4>Extracted Metadata:</h4>
                    <pre>{JSON.stringify(metadata, null, 2)}</pre>
                </div>
            )}

            <hr style={{ margin: "40px 0" }} />

            {/* TEXT ANALYSIS */}
            <form onSubmit={handleTextAnalysis}>
                <h3>2?? Text Oversharing Analysis</h3>
                <textarea
                    rows="5"
                    cols="50"
                    placeholder="Paste your caption, message, or post here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <br />
                <button type="submit" style={{ marginTop: "10px" }}>
                    Analyze Text
                </button>
            </form>

            {analysis && (
                <div style={{ marginTop: "20px", textAlign: "left", display: "inline-block" }}>
                    <h4>Analysis Result:</h4>
                    <pre>{JSON.stringify(analysis, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
