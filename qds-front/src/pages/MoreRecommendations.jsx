// src/pages/MoreRecommendations.jsx

import React, { useState, useEffect } from 'react';
import { RecomModal } from './RecomModal'; // Import the RecomModal component
import '../style/recomePage.css';

export function MoreRecommendations() {
    const [recommendations, setRecommendations] = useState([]); // State to store recommendation data
    const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
    const [selectedRecommendation, setSelectedRecommendation] = useState(null); // State to store selected recommendation

    useEffect(() => {
        // Retrieve recommendations from local storage
        const storedRecommendations = localStorage.getItem('recommendations');
        if (storedRecommendations) {
            // Parse stored JSON data and set in state
            setRecommendations(JSON.parse(storedRecommendations));
        }
    }, []); // Fetch recommendations on component mount

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
                {recommendations.slice(0, 3).map((recommendation, index) => (
                    <div key={index} className="recommendation-card" onClick={() => handleCardClick(recommendation)}>
                        <div className="person-info">
                            <img src={recommendation.imageUrl} alt="Person" />
                            <div className="info">
                                <p>Name: {recommendation.name}</p>
                                {/* Add more information as needed */}
                                {/* Example: <p>Description: {recommendation.description}</p> */}
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
                    {/* Render the modal with details */}
                    {/* You can reuse the RecomModal component or create a new one */}
                    {/* Pass necessary data to RecomModal */}
                    <RecomModal onClose={toggleModal} recommendation={selectedRecommendation} />
                </div>
            )}
        </div>
    );
}
