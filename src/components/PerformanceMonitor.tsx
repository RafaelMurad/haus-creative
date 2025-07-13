"use client";

/**
 * Performance Monitor Component - Simplified for Web Vitals
 * Phase 3.1 Chunk 3: Basic Web Vitals monitoring integration
 */

import { useEffect } from "react";
import { usePerformanceMonitoring } from "../hooks/usePerformanceMonitoring";

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export default function PerformanceMonitor({
  children,
}: PerformanceMonitorProps) {
  const { performanceScore, isMonitoring, startMonitoring } =
    usePerformanceMonitoring();

  useEffect(() => {
    // Initialize Web Vitals monitoring
    startMonitoring();
  }, [startMonitoring]);

  // Development performance indicator
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && isMonitoring) {
      const indicator = document.getElementById("perf-indicator");
      if (!indicator) {
        const perfDiv = document.createElement("div");
        perfDiv.id = "perf-indicator";
        perfDiv.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          background: ${
            performanceScore >= 90
              ? "#10b981"
              : performanceScore >= 70
              ? "#f59e0b"
              : "#ef4444"
          };
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          z-index: 9999;
          opacity: 0.8;
          pointer-events: none;
        `;
        perfDiv.textContent = `Web Vitals: ${performanceScore}/100`;
        document.body.appendChild(perfDiv);
      } else {
        indicator.style.background =
          performanceScore >= 90
            ? "#10b981"
            : performanceScore >= 70
            ? "#f59e0b"
            : "#ef4444";
        indicator.textContent = `Web Vitals: ${performanceScore}/100`;
      }
    }
  }, [performanceScore, isMonitoring]);

  return <>{children}</>;
}

// Performance debugging component for development
export function PerformanceDebugger() {
  const { metrics, performanceScore, clearMetrics, exportMetrics } =
    usePerformanceMonitoring();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleExport = () => {
    const data = exportMetrics();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "4px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <div>Performance Score: {performanceScore}/100</div>
      <div>Metrics Count: {metrics.length}</div>
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={clearMetrics}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "2px",
            marginRight: "5px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
        <button
          onClick={handleExport}
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          Export
        </button>
      </div>
      {metrics.length > 0 && (
        <div
          style={{ marginTop: "10px", maxHeight: "200px", overflow: "auto" }}
        >
          <strong>Recent Metrics:</strong>
          {metrics.slice(-5).map((metric, index) => (
            <div
              key={index}
              style={{
                padding: "2px 0",
                color:
                  metric.rating === "good"
                    ? "#10b981"
                    : metric.rating === "needs-improvement"
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            >
              {metric.name}: {Math.round(metric.value)}ms ({metric.rating})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
