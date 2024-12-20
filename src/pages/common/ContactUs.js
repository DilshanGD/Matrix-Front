//import React, { useState } from 'react';
import './css/ContactUs.css'; // Assuming CSS file is located in css folder
//import emailjs from 'emailjs-com';

const ContactUs = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [success, setSuccess] = useState(null);
//   const [error, setError] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const templateParams = {
//       from_name: name,
//       from_email: email,
//       message: message
//     };

//     emailjs.send('your_service_id', 'your_template_id', templateParams, 'your_user_id')
//       .then((result) => {
//         setSuccess('Your message has been sent successfully!');
//         setName('');
//         setEmail('');
//         setMessage('');
//       }, (error) => {
//         setError('Failed to send message. Please try again.');
//       });
//   };

  return (
    <div className="contact-us-page">
      {/* <div className="contact-form">
        <h1>Contact Us</h1>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            required
          ></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div> */}
      <div className="contact-details">
        <h2>Our Office</h2>
        <p><strong>Address:</strong> Gampaha, Sri Lanka</p>
        <p><strong>Phone:</strong> 0765675430</p>
        <p><strong>Email:</strong> Chathurangamax1235@gmail.com </p>
      </div>
    </div>
  );
};

export default ContactUs;
