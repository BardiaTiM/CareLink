import React, { useState, useEffect } from "react";
import { RecomModal } from "./RecomModal";
import { MoreRecommendations } from "./MoreRecommendations";

import "../style/recomePage.css";
import "../style/Recommendations.css";

import firstTimeHelper from "../style/images/badges/First-time-helper.png";
import HelpedTenPeople from "../style/images/badges/Helped-10-people.png";
import HelpedTwentyFivePeople from "../style/images/badges/Helped-25-people.png";
import VerifiedHelper from "../style/images/badges/Verified-User.png";
import logoImageBlack from "../style/images/CareLink v1 - black.png";

import plant from "../style/images/plant.png";

import plant1 from "../style/images/plantPFPs/plant1.png";
import plant2 from "../style/images/plantPFPs/plant2.png";
import plant3 from "../style/images/plantPFPs/plant3.png";
import plant4 from "../style/images/plantPFPs/plant4.png";
import plant5 from "../style/images/plantPFPs/plant5.png";

const plantPFPs = [plant1, plant2, plant3, plant4, plant5];

// Array of recommendation objects
export function RecomPage() {
  const [showModal, setShowModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [mainRecommendation, setMainRecommendation] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  // Function to toggle the visibility of the modal
  const toggleModal = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setShowModal(!showModal);
  };
  // Function to toggle the visibility of the "More Recommendations" section
  const toggleMore = () => {
    setShowMore(!showMore);
  };
  // Function to handle the click event on a recommendation card
  const handleRecommendationSelect = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setShowModal(true);
  };

  useEffect(() => {
    // Retrieve data from local storage when component mounts
    const storedRecommendations = localStorage.getItem('recommendations');
    if (storedRecommendations) {
      const parsedRecommendations = JSON.parse(storedRecommendations);
      // Generate a random plant profile picture for each recommendation
      const recommendationsWithImages = parsedRecommendations.map((recommendation) => ({
        ...recommendation,
        imageUrl: getRandomPlantPFP(),
      }));
      setMainRecommendation(recommendationsWithImages[0]); // Display the first item as the main recommendation
      setRecommendations(recommendationsWithImages.slice(1)); // Set the rest of the recommendations for "More Recommendations"
    }
  }, []);

  const getRandomPlantPFP = () => {
    const randomIndex = Math.floor(Math.random() * plantPFPs.length);
    return plantPFPs[randomIndex];
  };

  return (
    <div className="RecomPage">
      <h1>Peer For You</h1>

      {mainRecommendation && (
        <div className="recommendation-card" onClick={() => toggleModal(mainRecommendation)}>
          <div className="person-info">
            {/* Use a random plant profile picture for the main recommendation */}
            <img src={mainRecommendation.imageUrl} alt="Plant" className="plant" />
            <div className="info">
              <h3>Username</h3>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <p>@{mainRecommendation.username}</p>
                <img src={logoImageBlack} alt="CareLink Logo" className="verified-CL" />
              </div>

              <br />

              <div className="badges">
                <h3>Badge(s)</h3>
                <img src={VerifiedHelper} alt="Badge 4" />
                <img src={firstTimeHelper} alt="Badge 1" />
                <img src={HelpedTenPeople} alt="Badge 2" />
                <img src={HelpedTwentyFivePeople} alt="Badge 3" />
              </div>

              <br />

              <div>
                <p style={{ color: 'grey', fontSize: '12px' }}>(Click Card for more info)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedRecommendation && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <RecomModal
            onClose={() => setShowModal(false)}
            description={selectedRecommendation.description}
            peerId={selectedRecommendation.peerID}
            imageUrl={selectedRecommendation.imageUrl} // Pass imageUrl to the modal
          />
        </div>
      )}

      {!showMore && recommendations.length > 0 && (
        <div className="view-more-container">
          <button onClick={toggleMore}>View More Recommendations</button>
        </div>
      )}
      {showMore && (
        <MoreRecommendations
          recommendations={recommendations}
          onSelectRecommendation={handleRecommendationSelect}
        />
      )}

      {/* Pass recommendations and toggleModal function to MoreRecommendations component */}
    </div>
  );
}

