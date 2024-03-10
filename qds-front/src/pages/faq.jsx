import React, { useState } from 'react';
import '../style/faq.css'; // Make sure the CSS file path is correct

export const FAQ = () => {
    const [active, setActive] = useState({});

    // An array of your questions and answers
    const faqs = [
        {
            question: 'How do I upgrade/downgrade my workspace plan?',
            answer: 'You can upgrade or downgrade your plan via the settings page.'
        },
        {
            question: 'Can I add other information to be added to an invoice?',
            answer: 'Yes, you can customize invoices with additional information in the invoice settings.'
        },
        {
            question: 'What is the response time for support queries?',
            answer: 'Our support team typically responds within 24 hours.'
        },
        {
            question: 'Can I integrate third-party tools with this app?',
            answer: 'Yes, we offer integrations with several popular third-party tools.'
        },
        {
            question: 'Is there a mobile version of the application available?',
            answer: 'Yes, our app is available on both iOS and Android devices.'
        },
        {
            question: 'How do I reset my password?',
            answer: 'You can reset your password by clicking on "Forgot Password?" at the login page.'
        },
        {
            question: 'Can I export my data?',
            answer: 'Yes, you can export your data in various formats from the export section.'
        },
        {
            question: 'Do you offer any discounts for non-profit organizations?',
            answer: 'Yes, we offer special pricing for non-profit organizations. Please contact sales for more information.'
        },
        {
            question: 'How can I cancel my subscription?',
            answer: 'You can cancel your subscription from your account settings page. Please note that cancellations must be made at least 24 hours before the renewal date.'
        },
        {
            question: 'What kind of support do you offer?',
            answer: 'We offer email and chat support for all users. Phone support is available for premium plan subscribers.'
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
