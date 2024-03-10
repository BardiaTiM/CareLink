import React, { useEffect, useState } from "react";
import "../style/inReview.css";

// Functional component for the "In Review" page
export function InReview() {
  // State variables to manage peer helpers data, loading state, and error state
  const [peerHelpers, setPeerHelpers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch peer helpers data from the server
  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Fetch data from the server
      const response = await fetch(
        "http://localhost:8000/peer_helpers/inreview"
      );
      if (!response.ok) throw new Error("Failed to fetch");
      // Parse response data
      const data = await response.json();
      // Update peer helpers state with fetched data
      setPeerHelpers(data);
    } catch (error) {
      // Handle fetch error
      console.error("Error fetching data:", error.message);
      setError("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data from the server on component mount
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  // Function to update the status of a peer helper
  const updateStatus = async (id, status) => {
    try {
      // Send a request to update the status of the peer helper to the server
      const response = await fetch(
        "http://localhost:8000/peer_helpers/update_status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, status }), // Include peer helper ID and new status in the request body
        }
      );

      if (!response.ok) throw new Error("Failed to update status");
      // Re-fetch the list of peer helpers after a successful update
      fetchData();
    } catch (error) {
      // Handle update status error
      console.error("Error updating status:", error.message);
      setError("Failed to update status.");
    }
  };

  // Render the "In Review" page content
  return (
    <div className="InReview-Container">
      <br />
      <br />
      <h1>In Review</h1>
      <br></br>
      {isLoading ? ( // Show loading message if data is still loading
        <p>Loading...</p>
      ) : error ? ( // Show error message if there was an error fetching data
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        // Render the grid layout for peer helpers
        <div className="three-column-grid">
          {peerHelpers.map(({ id, username, email, description }) => (
            <div key={id} className="card">
              {/* Display peer helper information */}
              <p>Username: {username}</p>
              <p>Email: {email}</p>
              <p>Description: {description}</p>
              {/* Buttons to activate or deny the peer helper */}
              <button onClick={() => updateStatus(id, "ACTIVE")}>
                Activate
              </button>
              <button onClick={() => updateStatus(id, "DENY")}>Deny</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
