import React, { useState, useEffect } from 'react';
import '../style/main.css'; // Make sure this points to your CSS file
import { useNavigate } from 'react-router-dom';
import loading from '../style/images/loading-plant.gif';

export function Main() {
    const [paragraph, setParagraph] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // Manage the sequence of displays
    const [animationClass, setAnimationClass] = useState('fade-in');

    useEffect(() => {
        // Sequence: 1. First message, 2. Second message, 3. Input form
        const transitions = [
            { timeout: 2000, nextStep: 2, nextAnimation: 'fade-out' },
            { timeout: 2000, nextStep: 3, nextAnimation: 'fade-out' },
        ];

        if (currentStep < 3) {
            const { timeout, nextStep, nextAnimation } = transitions[currentStep - 1];

            const timer = setTimeout(() => {
                setAnimationClass(nextAnimation); // Transition animation

                // Change step after animation allows for a smooth transition
                setTimeout(() => {
                    setCurrentStep(nextStep);
                    setAnimationClass('fade-in'); // Prepare for next content's fade in
                }, 1000); // Match this delay with your fade-out animation duration
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const handleInputChange = (event) => {
        setParagraph(event.target.value);
    };

    const sendParagraph = () => {
        try {
            setIsLoading(true); // Set loading state to true
            const username = sessionStorage.getItem('username');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:8000/help_request');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    setIsLoading(false); // Set loading state to false after response
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
            setIsLoading(false); // Set loading state to false in case of error
            console.error('Error sending paragraph:', error.message);
        }
    };

    return (
        <div className="main-container">
            {currentStep === 1 && (
                <h1 className={animationClass} style={{ color: 'black' }}>
                    Feeling Overwhelmed? Let's Balance Life Together.
                </h1>
            )}
            {currentStep === 2 && (
                <h1 className={animationClass} style={{ color: 'black' }}>
                    Looking for Support? Connect with Peers and Counselors Here.
                </h1>
            )}
            {currentStep === 3 && (
                <div>
                    {isLoading ? ( // Conditionally render loading GIF or card
                        <img src={loading} alt="Loading..." key={Date.now()} />
                    ) : (
                        <div className="cards">
                            <div className={animationClass}>
                                <h2>Share Your BCIT Experience</h2>
                                <textarea
                                    value={paragraph}
                                    onChange={handleInputChange}
                                    placeholder="Describe any challenges or issues you're facing at BCIT"
                                    rows={10}
                                    cols={50}
                                />
                                <br />
                                <button onClick={sendParagraph}>Submit</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
