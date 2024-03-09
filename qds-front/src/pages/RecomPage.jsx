// RecomPage.jsx
import React, { useState, useEffect } from 'react';
import { RecomModal } from './RecomModal';
import { MoreRecommendations } from './MoreRecommendations';
import '../style/recomePage.css';

export function RecomPage() {
    const [showModal, setShowModal] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [mainRecommendation, setMainRecommendation] = useState(null);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleMore = () => {
        setShowMore(!showMore);
    };

    useEffect(() => {
        // Retrieve data from local storage when component mounts
        const storedRecommendations = localStorage.getItem('recommendations');
        if (storedRecommendations) {
            const parsedRecommendations = JSON.parse(storedRecommendations);
            setMainRecommendation(parsedRecommendations[0]); // Display the first item as the main recommendation
            setRecommendations(parsedRecommendations.slice(1)); // Set the rest of the recommendations for "More Recommendations"
        }
    }, []);

    return (
        <div>
            <h1>Main Recommendation</h1>
            {mainRecommendation && (
                <div className="recommendation-card" onClick={toggleModal}>
                    <div className="person-info">
                        <img src={`https://via.placeholder.com/150?text=${mainRecommendation.username}`} alt="Person" />
                        <div className="info">
                            <p>Name: {mainRecommendation.username}</p>
                            <p>Description: {mainRecommendation.description}</p>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="overlay" onClick={toggleModal}>
                    <RecomModal onClose={toggleModal} recommendation={mainRecommendation} />
                </div>
            )}
            {!showMore && recommendations.length > 0 && (
                <div className="view-more-container">
                    <button onClick={toggleMore}>View More Recommendations</button>
                </div>
            )}
            {showMore && <MoreRecommendations recommendations={recommendations} onClose={toggleModal} />} {/* Pass recommendations and toggleModal function to MoreRecommendations component */}
        </div>
    );
}
