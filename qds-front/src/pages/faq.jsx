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
            question: 'I think I need some exercise in my life, where do I begin?',
            answer: 'Beginning exercise can be as simple as taking a walk around campus or joining a fitness class at the gym. Start with activities you enjoy and gradually increase intensity. Consider seeking advice from the gym staff or joining a sports club to find a routine that suits you.'
        },
        {
            question: 'What types of problems can I seek support for on CareLink?',
            answer: 'CareLink offers support for a wide range of issues, not limited to mental health. Whether academic, personal, or social, you can find assistance.'
        },
        {
            question: 'How do I overcome imposter syndrome? I don\'t feel like I\'m good enough for this program',
            answer: 'Imposter syndrome is common among students, but remember that you were accepted into the program for a reason. Focus on your achievements and strengths, and challenge negative thoughts with positive affirmations. Seeking support from peers, mentors, or counselors can also provide perspective and encouragement.'
        },
        {
            question: ' I don\'t feel comfortable talking to a counsellor yet, but I know I need help',
            answer: 'If you\'re not ready to speak to a counselor yet, try reaching out to a trusted friend, family member, or mentor for support. You can also explore alternative resources such as online forums or self-help books to start addressing your concerns. Remember that seeking help is a brave and positive step towards self-care and well-being.'
        },
        {
            question: 'I\'m straight from high school and I\'m having trouble with making friends',
            answer: 'Making friends in college can take time, but don\'t be discouraged. Get involved in campus clubs, organizations, or events related to your interests to meet like-minded peers. Attend social gatherings, study groups, or orientation events to connect with other students. Be open to new experiences and initiate conversations to build meaningful relationships.'
        },
        {
            question: ' I\'m having trouble with affording food at school due to rent and school fees, not sure what to do ',
            answer: 'If you\'re struggling to afford food due to financial constraints, consider reaching out to your school\'s student services or financial aid office for support. They may offer resources such as food assistance programs, meal vouchers, or emergency grants to help alleviate financial burden. Additionally, explore community food banks or assistance programs in your area for additional support.'
        },
        {
            question: 'I always end up being late for class, but I can never sleep early, any advice?',
            answer: 'To address chronic lateness, try adjusting your nightly routine to prioritize sleep. Establish a consistent bedtime and create a relaxing pre-sleep ritual to signal your body that it\'s time to rest. Set multiple alarms and place them across the room to ensure you wake up on time. Consider seeking advice from a counselor or healthcare professional if you continue to struggle with sleep patterns.'
        },
        {
            question: 'How do I recover from burnout? I feel so done with this term right now ',
            answer: 'To recover from burnout, prioritize self-care by taking breaks, engaging in activities you enjoy, and setting realistic goals. Create boundaries to prevent overcommitment and seek support from friends, family, or a counselor. Remember, it\'s okay to ask for help and take steps towards recovery.'
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
