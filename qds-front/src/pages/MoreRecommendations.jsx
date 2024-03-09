// MoreRecommendations.jsx
import React, { useState } from 'react';
import { RecomModal } from './RecomModal';
import '../style/recomePage.css';

export function MoreRecommendations({ recommendations, onClose }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedRecommendation, setSelectedRecommendation] = useState(null);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleCardClick = (recommendation) => {
        setSelectedRecommendation(recommendation);
        toggleModal();
    };

    return (
        <div className="more-recommendations-container">
            <h2>More Recommendations</h2>
            <div className="recommendation-cards">
                {recommendations.map((recommendation, index) => (
                    <div key={index} className="recommendation-card" onClick={() => handleCardClick(recommendation)}>
                        <div className="person-info">
                            <img src={recommendation.imageUrl} alt="Person" />
                            <div className="info">
                                <p>Name: {recommendation.username}</p>
                                <p>Description: {recommendation.description}</p>
                                {/* Render badge images */}
                                <div className="badges">
                                    <img src={recommendation.badge1Url} alt="Badge 1" />
                                    <img src={recommendation.badge2Url} alt="Badge 2" />
                                    <img src={recommendation.badge3Url} alt="Badge 3" />
                                    <img src={recommendation.badge4Url} alt="Badge 4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="overlay" onClick={toggleModal}>
                    <RecomModal onClose={onClose} recommendation={selectedRecommendation} />
                </div>
            )}
        </div>
    );
}
