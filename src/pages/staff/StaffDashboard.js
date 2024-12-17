import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config'; // Ensure this contains your API base URL
import './css/StaffDashboard.css';


const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StaffDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    // Update the current time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch data from the API
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/staff/timetable`, {
          withCredentials: true,
        });
        
        // Sort the classes by the day order
        const sortedClasses = response.data.sort(
          (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        );
        
        setClasses(sortedClasses); // Update state with sorted API response
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError(err.response?.data?.message || 'Failed to load timetable.');
        setLoading(false); // Set loading to false even in case of error
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Format date and time
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="staff-dashboard">
      {/* <h1 className="dashboard-title">Staff Dashboard</h1> */}
      
      {/* Display current date and time */}
      <div className="current-datetime">
        <p className="date">{formatDate(currentDateTime)}</p>
        <p className="time">{formatTime(currentDateTime)}</p>
      </div>

      <div className="timetable-container">
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Batch ID</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem, index) => (
              <tr key={index}>
                <td>{classItem.title}</td>
                <td>{classItem.type}</td>
                <td>{classItem.day}</td>
                <td>{classItem.startTime}</td>
                <td>{classItem.endTime}</td>
                <td>{classItem.batch_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDashboard;
