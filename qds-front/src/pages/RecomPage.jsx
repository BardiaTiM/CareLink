import React, { useState, useEffect } from 'react';
import { RecomModal } from './RecomModal';
import { MoreRecommendations } from './MoreRecommendations';
import '../style/recomePage.css';

export function RecomPage() {
    const [showModal, setShowModal] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleMore = () => {
        setShowMore(!showMore);
    };

    useEffect(() => {
        // Fetch data when component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/help_request');
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            const contentType = response.headers.get('content-type');
    
            // Log the content type
            console.log('Content-Type:', contentType);
    
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                const users = data.recommendations.map(recommendation => ({
                    username: recommendation.username,
                    description: recommendation.description
                }));
                console.log(users);
                setRecommendations(users);
            } else if (contentType && contentType.includes('text/html')) {
                // Handle text/html response (e.g., display error message)
                console.error('Received HTML response instead of JSON');
            } else {
                throw new Error('Unexpected response type');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };
    
    
    
    
    
    

    return (
        <div>
            <h1>Main Recommendation</h1>
            {recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-card" onClick={toggleModal}>
                    <div className="person-info">
                        <img src={`https://via.placeholder.com/150?text=${recommendation.username}`} alt="Person" />
                        <div className="info">
                            <p>Name: {recommendation.username}</p>
                            <p>Description: {recommendation.description}</p>
                        </div>
                    </div>
                </div>
            ))}
            {showModal && (
                <div className="overlay" onClick={toggleModal}>
                    <RecomModal onClose={toggleModal} />
                </div>
            )}
            {!showMore && (
                <div className="view-more-container">
                    <button onClick={toggleMore}>View More Recommendations</button>
                </div>
            )}
            {showMore && <MoreRecommendations />}
        </div>
    );
}
