import React, { useState } from "react";
import { RecomModal } from "./RecomModal";
import "../style/recomePage.css";
import firstTimeHelper from "../style/images/badges/First-time-helper.png";
import HelpedTenPeople from "../style/images/badges/Helped-10-people.png";
import HelpedTwentyFivePeople from "../style/images/badges/Helped-25-people.png";
import VerifiedHelper from "../style/images/badges/Verified-User.png";

export function MoreRecommendations({ recommendations, onClose, onSelectRecommendation }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

//   const handleCardClick = (recommendation) => {
//     setSelectedRecommendation(recommendation);
//     toggleModal();
//   };

  return (
    <div className="more-recommendations-container">
      <h2>More Recommendations</h2>
      <div className="recommendation-cards">
        {recommendations.map((recommendation, index) => (
          <div
            key={recommendation.id || index}
            className="recommendation-card"
            onClick={() => onSelectRecommendation(recommendation)}
          >
            <div className="person-info">
              <img src={recommendation.imageUrl} alt="Person" />
              <div className="info">
                <p>Name: {recommendation.username}</p>
                {/* Render badge images */}
                <div className="badges">
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
                  {index === 2 && <img src={VerifiedHelper} alt="Badge 1" />}
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
