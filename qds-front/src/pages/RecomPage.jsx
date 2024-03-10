import React, { useState, useEffect } from 'react';
import { RecomModal } from './RecomModal';
import { MoreRecommendations } from './MoreRecommendations';

import '../style/recomePage.css';
import '../style/Recommendations.css';

import firstTimeHelper from '../style/images/badges/First-time-helper.png';
import HelpedTenPeople from '../style/images/badges/Helped-10-people.png';
import HelpedTwentyFivePeople from '../style/images/badges/Helped-25-people.png';
import VerifiedHelper from '../style/images/badges/Verified-User.png';

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
                        </div>
                        <div className="badges">
                        <img src={VerifiedHelper} alt="Badge 4" />
                        <img src={firstTimeHelper} alt="Badge 1" />
                        <img src={HelpedTenPeople} alt="Badge 2" />
                        <img src={HelpedTwentyFivePeople} alt="Badge 3" />
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="overlay" onClick={toggleModal}>
                    <RecomModal onClose={toggleModal} description={mainRecommendation.description} />
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