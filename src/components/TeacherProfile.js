// frontend/src/components/TeacherProfile.js

import React from 'react';
import './css/TeacherProfile.css';

const TeacherProfile = ({ staffGroups, streams }) => (
  <section className="teacher-profiles">
    <h2>Our Teachers</h2>
    {streams.map((stream) => (
      <div key={stream.stream_id} className="stream-group">
        <h3>{stream.title}</h3>
        {staffGroups[stream.stream_id]?.length > 0 ? (
          staffGroups[stream.stream_id].map((staff) => (
            <div key={staff.username} className="teacher-item">
              <img
                src={staff.profile_pic || '/path/to/placeholder.jpg'}
                alt={`${staff.full_name}'s profile`}
                className="profile-pic"
              />
              <div className="teacher-info">
                <p><strong>Name:</strong> {staff.full_name}</p>
                <p><strong>Email:</strong> {staff.email}</p>
                <p><strong>Subject:</strong> {staff.subject_title}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No teachers available for this stream.</p>
        )}
      </div>
    ))}
  </section>
);

export default TeacherProfile;
