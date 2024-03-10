import React, { useState } from 'react';
import { RecomModal } from './RecomModal';
import '../style/recomePage.css';
import firstTimeHelper from '../style/images/badges/First-time-helper.png';
import HelpedTenPeople from '../style/images/badges/Helped-10-people.png';
import HelpedTwentyFivePeople from '../style/images/badges/Helped-25-people.png';
import VerifiedHelper from '../style/images/badges/Verified-User.png';
import logoImageBlack from '../style/images/CareLink v1 - black.png';

import plant from '../style/images/plant.png';

import plant1 from '../style/images/plantPFPs/plant1.png';
import plant2 from '../style/images/plantPFPs/plant2.png';
import plant3 from '../style/images/plantPFPs/plant3.png';
import plant4 from '../style/images/plantPFPs/plant4.png';
import plant5 from '../style/images/plantPFPs/plant5.png';

const plantPFPs = [plant1, plant2, plant3, plant4, plant5];

export function MoreRecommendations({ recommendations, onClose, onSelectRecommendation }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

    const getRandomPlantPFP = () => {
        const randomIndex = Math.floor(Math.random() * plantPFPs.length);
        return plantPFPs[randomIndex];
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
                    <div key={recommendation.id || index}
                        className="recommendation-card"
                        onClick={() => onSelectRecommendation(recommendation)}>

                        <div className="person-info">

                            {/* Use a random plant profile picture */}
                            <img src={getRandomPlantPFP()} alt="Plant" className="plant"></img>

                            <div className="info">
                                <h3>Username</h3>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <p>@{recommendation.username}</p>
                                    <img src={logoImageBlack} alt="CareLink Logo" className="verified-CL" />
                                </div>

                                <br></br>

                                <div className="badges">
                                    <h3>Badge(s)</h3>
                                    {index === 0 && (
                                        <>
                                            <img src={VerifiedHelper} alt="Badge 1" />
                                            <img src={firstTimeHelper} alt="Badge 2" />
                                        </>
                                    )}
                                    {index === 1 && (
                                        <>
                                            <img src={VerifiedHelper} alt="Badge 1" />
                                            <img src={firstTimeHelper} alt="Badge 2" />
                                            <img src={HelpedTenPeople} alt="Badge 3" />
                                        </>
                                    )}
                                    {index === 2 && (
                                        <img src={VerifiedHelper} alt="Badge 1" />
                                    )}
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
                ))}
            </div>
      {showModal && (
        <div className="overlay" onClick={toggleModal}>
          {/* Pass the selected recommendation to RecomModal */}
          <RecomModal
            onClose={onClose}
            description={selectedRecommendation.description}
          />
        </div>
      )}
    </div>
  );
}