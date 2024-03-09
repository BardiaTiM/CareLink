// src/pages/RecomPage.jsx

import React, { useState } from 'react';
import { RecomModal } from './RecomModal'; // Correct the import statement
import { MoreRecommendations } from './MoreRecommendations'; // Import the MoreRecommendations component
import '../style/recomePage.css';

export function RecomPage() { // Change the component name to start with uppercase
    const [showModal, setShowModal] = useState(false);
    const [showMore, setShowMore] = useState(false); // State to toggle the visibility of more recommendations

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div>
            <h1>Main Recommendation</h1>
            <div className="recommendation-card" onClick={toggleModal}>
                <div className="person-info">
                    <img src="https://via.placeholder.com/150" alt="Person" />
                    <div className="info">
                        <p>Name: John Doe</p>
                        <div className="badges">
                            <img src="https://via.placeholder.com/50" alt="Badge 1" />
                            <img src="https://via.placeholder.com/50" alt="Badge 2" />
                            <img src="https://via.placeholder.com/50" alt="Badge 3" />
                            <img src="https://via.placeholder.com/50" alt="Badge 4" />
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="overlay" onClick={toggleModal}>
                    <RecomModal onClose={toggleModal} />
                </div>
            )}

            {/* Render the "View More Recommendations" button */}
            {!showMore && (
                <div className="view-more-container">
                    <button onClick={toggleMore}>View More Recommendations</button>
                </div>
            )}

            {/* Render the MoreRecommendations component if showMore is true */}
            {showMore && <MoreRecommendations />}
        </div>
    );
}
