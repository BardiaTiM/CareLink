import React, { useState } from 'react';

export function Problem() {
    const [paragraph, setParagraph] = useState('');

    const handleInputChange = (event) => {
        setParagraph(event.target.value);
    };

    const sendParagraph = async () => {
        try {
            const username = sessionStorage.getItem("username"); // Assuming user_id is the same as the username
    
            const response = await fetch('http://localhost:8000/help_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: username, description: paragraph }),
            });
            if (!response.ok) {
                throw new Error('Failed to send paragraph');
            }
            console.log('Paragraph sent successfully');
            setParagraph(''); // Reset the input after sending
        } catch (error) {
            console.error('Error sending paragraph:', error.message);
        }
    };
    
    return (
        <div>
            <h1>Input Page</h1>
            <textarea
                value={paragraph}
                onChange={handleInputChange}
                placeholder="Enter your paragraph here"
                rows={10}
                cols={50}
            />
            <br />
            <button onClick={sendParagraph}>Send</button>
        </div>
    );
}
