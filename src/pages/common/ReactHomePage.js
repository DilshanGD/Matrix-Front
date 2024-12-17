// frontend/src/pages/ReactHomePage.js

import React, { useEffect, useState } from 'react';
import HomeNavbar from '../../components/HomeNavbar';
import HomeImages from '../../components/HomeImages';
import StreamCategories from '../../components/StreamCategories';
import StatisticsSection from '../../components/StatisticsSection';
import TeacherProfile from '../../components/TeacherProfile';
import axios from 'axios';
import config from '../../config';

const ReactHomePage = () => {
  const [homeImages, setHomeImages] = useState([]);
  const [streams, setStreams] = useState([]);
  const [staffGroups, setStaffGroups] = useState({});
  const [statistics, setStatistics] = useState({
    totalClasses: 0,
    totalStaff: 0,
    totalStudents: 0,
  });

  // Fetch homepage data from the API
  const fetchHomePageData = async () => {
    try {
    //   const response = await fetch('http://localhost:3005/',{
    //     method:'POST'
    //   }); // Replace with your backend API URL
    //   const data = await response.json();

      const {data} = await axios.get(`${config.apiUrl}`)
      console.log(data)

      // Set state with fetched data
      setHomeImages(data.homeImages || []);
      setStreams(data.streams || []);
      setStaffGroups(data.staffGroups || {});
      setStatistics(data.statistics || {});
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHomePageData();
  }, []);

   // Find the logo image path
   const mainLogo = homeImages.find(item => item.detail_id === 'logo_home')?.file_path;

  return (
    <div className="homepage">
      <HomeNavbar logo={mainLogo} />
      <HomeImages homeImages={homeImages} />
      <StatisticsSection statistics={statistics} />
      <StreamCategories streams={streams} />
      <TeacherProfile staffGroups={staffGroups} streams={streams} />
    </div>
  );
};

export default ReactHomePage;
