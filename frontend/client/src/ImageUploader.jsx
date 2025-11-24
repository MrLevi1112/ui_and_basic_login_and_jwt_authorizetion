import { useState } from "react";
    import api from "./services/api";

    function ImageUploader({ onAnalysisStart, onAnalysisComplete, onError }) {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files[0] || null;
        setFile(selected);
        setLocalError("");
        onError(""); 
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0];
        if (!droppedFile) {
        return;
        }

        setFile(droppedFile);
        setLocalError("");
        onError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
        const msg = "please select an image first";
        setLocalError(msg);
        onError(msg);
        return;
        }

        try {
        setLocalLoading(true);
        onAnalysisStart(); // Notify parent loading started
        setLocalError("");
        
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/estimate", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        onAnalysisComplete(response.data); // Pass data to parent

        } catch (err) {
        console.error(err);
        const msg = "failed to analyze image";
        setLocalError(msg);
        onError(msg);
        } finally {
        setLocalLoading(false);
        }
    };

    return (
        <section className="card card-left">
        <div className="card-header">
            <h2 className="card-title">upload frame</h2>
            <span className="card-chip">step 1</span>
        </div>
        <p className="card-subtitle">
            drop or select a damaged car image. we&apos;ll decode it and send it
            through the crash2cost pipeline.
        </p>

        <form onSubmit={handleSubmit} className="form">
            <label
            className={`file-input-label ${isDragging ? "drag-active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            >
            <div className="file-input-inner">
                <div className="file-icon" />
                <div className="file-text">
                <span className="file-main">click to browse or drag & drop</span>
                <span className="file-sub">supported: jpg, png, webp</span>
                </div>
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
            />
            </label>

            <button
            type="submit"
            className="primary-button"
            disabled={localLoading || !file}
            >
            <span className="btn-glow" />
            <span className="btn-text">
                {localLoading ? "analyzing frame..." : "upload and analyze"}
            </span>
            </button>

            {localError && <div className="error-banner">{localError}</div>}
        </form>

        {file && (
            <div className="preview-card">
            <div className="preview-header">
                <span className="preview-badge">live preview</span>
                <span className="preview-filename">{file.name}</span>
            </div>
            <div className="preview-frame">
                <div className="preview-overlay" />
                <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="preview-image"
                />
            </div>
            </div>
        )}
        </section>
    );
    }

    export default ImageUploader;