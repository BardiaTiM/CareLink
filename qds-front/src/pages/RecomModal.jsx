// src/pages/RecomModal.jsx

import React from 'react';
import '../style/recomePage.css';

export function RecomModal({ onClose, description }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src="https://via.placeholder.com/400" alt="Person" />
                <h2>Bio</h2>
                <p>Description: {description}</p> {/* Display the description dynamically */}
                <button>Start Chat</button>
            </div>
        </div>
    );
}
