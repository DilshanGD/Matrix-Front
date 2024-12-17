import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import './css/StaffProfile.css';
import { useNavigate } from 'react-router-dom';

const StaffProfile = () => {
  const [staffData, setStaffData] = useState(null);
  const [phones, setPhones] = useState({ phoneHome: '', phoneMobile: '' });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileFields, setProfileFields] = useState({
    full_name: '',
    email: '',
    gender: '',
    profile_pic: '',
    biography: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/staff/staff-profile`, {
          withCredentials: true,
        });

        const { staff, phones } = response.data;
        setStaffData(staff);

        // Update profile fields
        setProfileFields({
          full_name: staff.full_name,
          email: staff.email,
          gender: staff.gender,
          profile_pic: staff.profile_pic,
          biography: staff.biography,
        });

        // Update phone data
        const phoneData = {
          phoneHome: phones.find((phone) => phone.phoneType === 'H')?.phone || '',
          phoneMobile: phones.find((phone) => phone.phoneType === 'M')?.phone || '',
        };
        setPhones(phoneData);
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

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    setPhones({ ...phones, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfileFields({ ...profileFields, profile_pic: e.target.files[0] });
  };

  const handleSaveChanges = async () => {
    try {
      const profileData = {
        ...profileFields,
        phoneHome: phones.phoneHome,
        phoneMobile: phones.phoneMobile,
      };

      const response = await axios.patch(`${config.apiUrl}/staff/staff-profile-update`, profileData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      setStaffData(response.data);
      setIsEditing(false);
      alert('Profile updated successfully');
      navigate(0);
    } catch (err) {
      console.error('Error updating profile', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data : 'Failed to save profile changes');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      await axios.patch(`${config.apiUrl}/staff/new-password`, { pwd: newPassword }, {
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

  if (!staffData) {
    return <div className="loading-message">Loading profile...</div>;
  }

  return (
    <div className="staff-profile">
      <h2>Staff Profile</h2>
      <div className="profile-details">
        <div className="profile-info">
          <p>
            <strong>Profile Picture:</strong><br />
            {profileFields.profile_pic && (
              <img
                src={profileFields.profile_pic}
                alt="Profile"
                className="profile-pic"
                width="150"
                height="150"
              />
            )}
            {isEditing && <input type="file" name="profile_pic" accept="image/*" onChange={handleFileChange} />}
          </p>
          <p><strong>Full Name:</strong> {isEditing ? <input type="text" name="full_name" value={profileFields.full_name} onChange={handleInputChange} /> : profileFields.full_name}</p>
          <p><strong>Email:</strong> {isEditing ? <input type="email" name="email" value={profileFields.email} onChange={handleInputChange} /> : profileFields.email}</p>
          <p><strong>Gender:</strong> {isEditing ? <select name="gender" value={profileFields.gender} onChange={handleInputChange}><option value="Male">Male</option><option value="Female">Female</option></select> : profileFields.gender}</p>
          <p><strong>Biography:</strong> {isEditing ? <textarea name="biography" value={profileFields.biography} onChange={handleInputChange} /> : profileFields.biography}</p>
          <p><strong>Phone (Home):</strong> {isEditing ? <input type="text" name="phoneHome" value={phones.phoneHome} onChange={handlePhoneChange} /> : phones.phoneHome}</p>
          <p><strong>Phone (Mobile):</strong> {isEditing ? <input type="text" name="phoneMobile" value={phones.phoneMobile} onChange={handlePhoneChange} /> : phones.phoneMobile}</p>
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

export default StaffProfile;
