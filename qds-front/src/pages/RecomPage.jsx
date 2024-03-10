import React, { useState, useEffect } from 'react';
import { RecomModal } from './RecomModal';
import { MoreRecommendations } from './MoreRecommendations';

import '../style/recomePage.css';
import '../style/Recommendations.css';

import firstTimeHelper from '../style/images/badges/First-time-helper.png';
import HelpedTenPeople from '../style/images/badges/Helped-10-people.png';
import HelpedTwentyFivePeople from '../style/images/badges/Helped-25-people.png';
import VerifiedHelper from '../style/images/badges/Verified-User.png';
import logoImageBlack from '../style/images/CareLink v1 - black.png';

import plant from '../style/images/plant.png';

import Plant1 from '../style/images/plantPFPs/plant1.png';
import Plant2 from '../style/images/plantPFPs/plant2.png';
import Plant3 from '../style/images/plantPFPs/plant3.png';
import Plant4 from '../style/images/plantPFPs/plant4.png';
import Plant5 from '../style/images/plantPFPs/plant5.png';

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
        <div className="RecomPage">
            <h1>Peer For You</h1>

            {mainRecommendation && (
                <div className="recommendation-card" onClick={toggleModal}>

                    <div className="person-info">

                        {/* <img
                            src={`https://via.placeholder.com/150?text=${mainRecommendation.username}&bg=042A2B&fg=f4f4f4`}
                            alt="Main Peer"
                        /> */}
                        <img src={plant} alt="Plant" className="plant"></img>


                        <div className="info">
                            <h3>Username</h3>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <p>@{mainRecommendation.username}</p>
                                <img src={logoImageBlack} alt="CareLink Logo" className="verified-CL" />
                            </div>

                            <br></br>

                            <div className="badges">
                                <h3>Badge(s)</h3>
                                <img src={VerifiedHelper} alt="Badge 4" />
                                <img src={firstTimeHelper} alt="Badge 1" />
                                <img src={HelpedTenPeople} alt="Badge 2" />
                                <img src={HelpedTwentyFivePeople} alt="Badge 3" />
                            </div>

                            <br></br>

                            <div>
                                <p style={{ color: 'grey', fontSize: '12px' }}>
                                    (Click Card for more info)
                                </p>
                            </div>

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
                    <button onClick={toggleMore}>View More</button>
                </div>
            )}

            {showMore && <MoreRecommendations recommendations={recommendations} onClose={toggleModal} />}
        </div>
    );
}