import React, { useEffect, useState } from 'react';

export function InReview() {
    const [peerHelpers, setPeerHelpers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to fetch peer helpers data
    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8000/peer_helpers/inreview');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setPeerHelpers(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            setError('Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Function to update peer helper status
    const updateStatus = async (id, status) => {
        try {
            const response = await fetch('http://localhost:8000/peer_helpers/update_status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            // Re-fetch the list after a successful update
            fetchData();
        } catch (error) {
            console.error("Error updating status:", error.message);
            setError('Failed to update status.');
        }
    };

    return (
        <div>
            <h1>In Review</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <ul>
                    {peerHelpers.map(({ id, username, email, description }) => (
                        <li key={id}>
                            <p>Username: {username}</p>
                            <p>Email: {email}</p>
                            <p>Description: {description}</p>
                            <button onClick={() => updateStatus(id, 'ACTIVE')}>Activate</button>
                            <button onClick={() => updateStatus(id, 'DENY')}>Deny</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
