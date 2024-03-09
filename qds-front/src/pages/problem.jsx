import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Problem() {
    const [paragraph, setParagraph] = useState('');
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleInputChange = (event) => {
        setParagraph(event.target.value);
    };

    const sendParagraph = () => {
        try {
            const username = sessionStorage.getItem("username");
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:8000/help_request');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        // Parse and save the JSON response from the server in local storage
                        const responseData = JSON.parse(xhr.responseText);
                        localStorage.setItem('recommendations', JSON.stringify(responseData.recommendations));
                        console.log('Paragraph sent successfully');
                        setParagraph('');
                        navigate('/recomPage');
                    } else {
                        console.error('Failed to send paragraph');
                    }
                }
            };
            xhr.send(JSON.stringify({ user_id: username, description: paragraph }));
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
