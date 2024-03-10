import React, {useState} from 'react';
import '../style/faq.css'; // Make sure the CSS file path is correct

export const FAQ = () => {
    const [active, setActive] = useState({});

    // An array of your questions and answers
    const faqs = [
        {
            question: 'What is BCIT CareLink?',
            answer: 'BCIT CareLink is an exclusive platform connecting BCIT students with counselors and peers to discuss various challenges confidentially, supported by AI-driven matching.'
        },
        {
            question: 'How does the anonymity feature work?',
            answer: 'You can choose to remain anonymous while sharing your challenges and seeking support, ensuring privacy and comfort in your conversations.'
        },
        {
            question: 'What types of problems can I seek support for on CareLink?',
            answer: 'CareLink offers support for a wide range of issues, not limited to mental health. Whether academic, personal, or social, you can find assistance.'
        },
        {
            question: 'How does the AI matching system work?',
            answer: 'Our AI system carefully analyzes your described problem to match you with counselors or peers who have the most relevant experience or advice to offer.'
        },
        {
            question: 'Is BCIT CareLink monitored for safety?',
            answer: 'Yes, actual counselors oversee all interactions on the platform to ensure a safe and supportive environment for every student.'
        },
        {
            question: 'How do I sign up for BCIT CareLink?',
            answer: 'Sign up using your BCIT email for verification. This exclusive process ensures a trusted community space.'
        },
        {
            question: 'Can I meet with counselors or peers in person?',
            answer: 'For security reasons, in-person meetups are not initially approved unless endorsed by a counselor after thorough consideration.'
        },
        {
            question: 'Are the support services on CareLink BCIT-specific?',
            answer: 'Yes, CareLink is tailored specifically for the BCIT community, addressing unique challenges faced by our students.'
        },
        {
            question: 'How can CareLink help me if I\'m not sure what I need?',
            answer: 'CareLink can provide recommendations even when you\'re uncertain. Our system is designed to guide you to the right support options.'
        },
        {
            question: 'What if I only feel comfortable chatting online?',
            answer: 'CareLink is built for flexibility, offering online chat options for those who prefer not to talk over the phone or face-to-face.'
        }
    ];


    const toggleFAQ = (index) => {
        setActive(prevActive => ({
            ...prevActive, // Copy the existing state
            [index]: !prevActive[index]  // Toggle the state of the clicked FAQ
        }));
    };

    return (
        <div className="faq-grid">
            {faqs.map((faq, index) => (
                <div
                    className={`faq-item ${active[index] ? 'active' : ''}`}
                    key={index}
                >
                    <div className="faq-question" onClick={() => toggleFAQ(index)}>
                        {faq.question}
                        <span className="faq-toggle">{active[index] ? '-' : '+'}</span>
                    </div>
                    <div className={`faq-answer ${active[index] ? 'show' : ''}`}>
                        {faq.answer}
                    </div>
                </div>
            ))}
        </div>
    );
};
