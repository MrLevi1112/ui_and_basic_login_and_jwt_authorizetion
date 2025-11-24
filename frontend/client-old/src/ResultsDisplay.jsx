    function ResultsDisplay({ result, loading }) {
    return (
        <section className="card card-right">
        <div className="card-header">
            <h2 className="card-title">damage analysis</h2>
            <span className="card-chip alt">step 2</span>
        </div>

        {loading && (
            <div className="loading-overlay">
            <div className="loading-spinner" />
            <p className="loading-text">running damage inference...</p>
            </div>
        )}

        {!result && !loading && (
            <div className="empty-state">
            <div className="empty-orbit" />
            <p className="empty-title">no analysis yet</p>
            <p className="empty-subtitle">
                upload an image on the left to run a full damage inference.
            </p>
            </div>
        )}

        {result && !loading && (
            <>
            <div className="summary-row">
                <div className="pill">
                <span className="pill-label">estimate id</span>
                <span className="pill-value">{result.estimateId || "n/a"}</span>
                </div>
                <div className="pill">
                <span className="pill-label">file</span>
                <span className="pill-value">{result.filename}</span>
                </div>
                {result.totalCost !== undefined && (
                <div className="pill strong">
                    <span className="pill-label">total cost</span>
                    <span className="pill-value">{result.totalCost} ₪</span>
                </div>
                )}
            </div>

            {result.analysis &&
                result.analysis.detected &&
                result.analysis.detected.length > 0 && (
                <div className="detected-list">
                    {result.analysis.detected.map((d, index) => (
                    <div key={index} className="detected-item">
                        <div className="detected-main">
                        <span className="part">{d.part}</span>
                        <span className="badge">sev {d.severity}</span>
                        <span className="badge secondary">{d.damageType}</span>
                        </div>
                        <div className="detected-meta">
                        bbox: [{d.bbox.join(", ")}] · repair:
                        <span className="price"> {d.repairCost} ₪</span>
                        </div>
                    </div>
                    ))}
                </div>
                )}

            <div className="json-header">
                <span className="json-title">raw payload</span>
                <span className="json-tag">debug · dev only</span>
            </div>
            <pre className="json-box">{JSON.stringify(result, null, 2)}</pre>
            </>
        )}
        </section>
    );
    }

    export default ResultsDisplay;