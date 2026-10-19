import React from 'react';

export default function CameraModal({ isOpen, onClose, onMarkSafe }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <i className="fa-solid fa-video"></i> Patio Perimeter Camera • 10:42 AM
          </div>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-content">
          <div className="cam-feed-mock">
            <div className="cam-badge">
              <i className="fa-solid fa-circle"></i> MOTION DETECTED AT 10:42:15 AM
            </div>
            {/* SVG Mock Security Camera view */}
            <svg
              viewBox="0 0 600 350"
              className="cam-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="600" height="350" fill="#0b1329" />
              {/* Yard & Fence */}
              <rect y="180" width="600" height="170" fill="#061f1c" />
              <line
                x1="0"
                y1="180"
                x2="600"
                y2="180"
                stroke="#155e4b"
                strokeWidth="3"
              />
              {/* Patio Pavers */}
              <polygon
                points="100,350 220,180 380,180 500,350"
                fill="#1b2a47"
                opacity="0.6"
              />
              {/* Delivery Courier Silhouette */}
              <circle cx="300" cy="140" r="18" fill="#38bdf8" opacity="0.8" />
              <rect
                x="286"
                y="158"
                width="28"
                height="50"
                rx="6"
                fill="#38bdf8"
                opacity="0.8"
              />
              {/* Package in hand */}
              <rect
                x="316"
                y="175"
                width="24"
                height="20"
                rx="3"
                fill="#fbbf24"
              />
              {/* Motion Tracking Box */}
              <rect
                x="270"
                y="115"
                width="80"
                height="110"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
              <text
                x="275"
                y="110"
                fill="#f43f5e"
                fontSize="12"
                fontFamily="monospace"
              >
                PERSON DETECTED (98%)
              </text>
              <text
                x="20"
                y="330"
                fill="#94a3b8"
                fontSize="13"
                fontFamily="monospace"
              >
                CAM-04 BACK PATIO • TIMESTAMP: 10:42:15 AM • FPS: 30
              </text>
            </svg>
          </div>
          <div className="cam-analysis">
            <p>
              <i className="fa-solid fa-circle-check text-success"></i>{' '}
              <strong>AI Visual Triage:</strong> Courier dropped package on back
              porch. No unauthorized dwell time or forced entry attempt detected.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-action secondary" onClick={onClose}>
            Dismiss
          </button>
          <button className="btn-action primary" onClick={onMarkSafe}>
            <i className="fa-solid fa-box"></i> Confirm Package Delivery (Mark Safe)
          </button>
        </div>
      </div>
    </div>
  );
}
