import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import './css/StudentProfile.css';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota',
    'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale',
    'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Trincomalee', 'Vavuniya'
  ];

  const [studentData, setStudentData] = useState(null);
  const [parentData, setParentData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate(); 

  const [profileFields, setProfileFields] = useState({
    full_name: '',
    email: '',
    district: '',
    school: '',
    gender: '',
    phone: '',
    profile_pic: null,
    parent_name: '',
    parent_phone: '',
    parent_email: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post(`${config.apiUrl}/student/student-profile`, {}, {
          withCredentials: true,
        });
        const { student, parent } = response.data;

        setStudentData(student);
        setParentData(parent);

        setProfileFields({
          full_name: student.full_name,
          email: student.email,
          district: student.district,
          school: student.school,
          gender: student.gender,
          phone: student.phone,
          profile_pic: student.profile_pic,
          parent_name: parent.parent_name,
          parent_phone: parent.phone,
          parent_email: parent.email,
        });
      } catch (err) {
        console.error('Error fetching profile data', err);
        setError('Failed to load profile data');
      }
    };

    fetchProfileData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFields({ ...profileFields, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfileFields({ ...profileFields, profile_pic: e.target.files[0] });
  };

  const handleSaveChanges = async () => {
    try {
      const profileData = {
        full_name: profileFields.full_name,
        email: profileFields.email,
        district: profileFields.district,
        school: profileFields.school,
        gender: profileFields.gender,
        phone: profileFields.phone,
        profile_pic: profileFields.profile_pic || "Generic Student Pic Location", 
        parentName: profileFields.parent_name,
        phoneParent: profileFields.parent_phone,
        emailParent: profileFields.parent_email,
      };
  
      const response = await axios.patch(`${config.apiUrl}/student/student-profile-update`, profileData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
  
      setStudentData(response.data.student);
      setParentData(response.data.parent);
      setIsEditing(false);
      alert('Profile updated successfully');
      navigate(0);
    } catch (err) {
      console.error('Error updating profile', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Failed to save profile changes');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.patch(`${config.apiUrl}/student/new-password`, { pwd: newPassword }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      alert('Password updated successfully');
      setIsPasswordPopupOpen(false);
    } catch (err) {
      console.error('Error updating password', err.response ? err.response.data : err.message);
      setPasswordError('Failed to update password');
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!studentData || !parentData) {
    return <div className="loading-message">Loading profile...</div>;
  }

  return (
    <div className="student-profile">
      <h2>Student Profile</h2>
      <div className="profile-details">
        <div className="profile-info">
          <p>
            <strong>Profile Picture:</strong><br />
            {studentData.profile_pic && (
              <img
                src={`${config.apiUrl}/uploads/${studentData.profile_pic}`}
                alt="Profile"
                className="profile-pic"
                width="150"
                height="150"
              />
            )}
            {isEditing && <input type="file" name="profile_pic" accept="image/*" onChange={handleFileChange} />}
          </p>
          <p><strong>Full Name:</strong> {isEditing ? <input type="text" name="full_name" value={profileFields.full_name} onChange={handleInputChange} /> : studentData.full_name}</p>
          <p><strong>Email:</strong> {isEditing ? <input type="email" name="email" value={profileFields.email} onChange={handleInputChange} /> : studentData.email}</p>
          <p><strong>District:</strong> {isEditing ? <select name="district" value={profileFields.district} onChange={handleInputChange}>{districts.map(district => <option key={district} value={district}>{district}</option>)}</select> : studentData.district}</p>
          <p><strong>School:</strong> {isEditing ? <input type="text" name="school" value={profileFields.school} onChange={handleInputChange} /> : studentData.school}</p>
          <p><strong>Gender:</strong> {isEditing ? <select name="gender" value={profileFields.gender} onChange={handleInputChange}><option value="Male">Male</option><option value="Female">Female</option></select> : studentData.gender}</p>
          <p><strong>Phone:</strong> {isEditing ? <input type="text" name="phone" value={profileFields.phone} onChange={handleInputChange} /> : studentData.phone}</p>

          <h3>Parent Details</h3>
          <p><strong>Parent Name:</strong> {isEditing ? <input type="text" name="parent_name" value={profileFields.parent_name} onChange={handleInputChange} /> : parentData.parent_name}</p>
          <p><strong>Parent Phone:</strong> {isEditing ? <input type="text" name="parent_phone" value={profileFields.parent_phone} onChange={handleInputChange} /> : parentData.phone}</p>
          <p><strong>Parent Email:</strong> {isEditing ? <input type="email" name="parent_email" value={profileFields.parent_email} onChange={handleInputChange} /> : parentData.email}</p>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit Profile'}</button>
        <button onClick={handleSaveChanges} disabled={!isEditing}>Save Changes</button>
        <button onClick={() => setIsPasswordPopupOpen(true)}>Change Password</button>
      </div>

      {/* Password Change Popup */}
      {isPasswordPopupOpen && (
        <div className="password-popup">
          <div className="popup-content">
            <h3>Change Password</h3>
            {passwordError && <div className="error-message">{passwordError}</div>}
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Save New Password</button>
            <button onClick={() => setIsPasswordPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
