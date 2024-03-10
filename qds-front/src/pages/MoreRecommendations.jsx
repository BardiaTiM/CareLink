import React, { useState } from "react";
// Import the modal component for recommendations
import { RecomModal } from "./RecomModal";
// Import CSS for styling
import "../style/recomePage.css";
// Import badge images
import firstTimeHelper from "../style/images/badges/First-time-helper.png";
import HelpedTenPeople from "../style/images/badges/Helped-10-people.png";
import HelpedTwentyFivePeople from "../style/images/badges/Helped-25-people.png";
import VerifiedHelper from "../style/images/badges/Verified-User.png";
// Import logo image
import logoImageBlack from "../style/images/CareLink v1 - black.png";

// Import plant image
import plant from "../style/images/plant.png";

// Import plant profile pictures
import plant1 from "../style/images/plantPFPs/plant1.png";
import plant2 from "../style/images/plantPFPs/plant2.png";
import plant3 from "../style/images/plantPFPs/plant3.png";
import plant4 from "../style/images/plantPFPs/plant4.png";
import plant5 from "../style/images/plantPFPs/plant5.png";

// Array of plant profile pictures
const plantPFPs = [plant1, plant2, plant3, plant4, plant5];

export function MoreRecommendations({
                                      recommendations, // Prop: array of recommendation objects
                                      onClose, // Prop: function to close the modal
                                      onSelectRecommendation, // Prop: function to handle recommendation selection
                                    }) {
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  // State to store the currently selected recommendation
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  // Function to toggle the visibility of the modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Function to get a random plant profile picture
  const getRandomPlantPFP = () => {
    const randomIndex = Math.floor(Math.random() * plantPFPs.length);
    return plantPFPs[randomIndex];
  };

  // Function to handle the click event on a recommendation card
  const handleCardClick = (recommendation) => {
    setSelectedRecommendation(recommendation);
    toggleModal();
  };

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
                  {/* Display the image and information for each recommendation */}
                  <img src={recommendation.imageUrl} alt="Plant" className="plant" />
                  <div className="info">
                    <h3>Username</h3>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <p>@{recommendation.username}</p>
                      <img src={logoImageBlack} alt="CareLink Logo" className="verified-CL" />
                    </div>
                    <br />
                    <div className="badges">
                      <h3>Badge(s)</h3>
                      {/* Display badges based on the recommendation index */}
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
                    <br />
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
              {/* Modal for displaying detailed recommendation info */}
              <RecomModal
                  onClose={onClose}
                  description={selectedRecommendation.description}
              />
            </div>
        )}
      </div>
  );
}
