import React from 'react';
import { useSelector } from 'react-redux';

// Import the different dashboard components
import AdminDashboard from './AdminDashboard'; // Assuming you have a default admin dashboard
import StudentDashboardV1 from './studentDashboard/StudentDashboardV1';
import TeacherDashboard from './teacherDashboard/TeacherDashboard';
import { userDetails } from 'utils/apiService';
// import {-
const Dashboard = () => {
  // Get the user details from the Redux store
  const authData = userDetails.getUser();
console.log('authData', authData);

  // A helper function to render the correct dashboard based on the user's role
  const renderDashboardByRole = () => {
    // Check if the user and user.role exist
    if (! authData.type || ! authData.type) {
      // You can return a loading spinner or a default view here
      return <AdminDashboard />;
    }

    switch ( authData.type) {
      case "STUDENT":
        return <StudentDashboardV1 />;
      case 'Teacher':
        return <TeacherDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      default:
        // Fallback to a default dashboard if the role is not recognized
        return <AdminDashboard />;
    }
  };

  return (
    <div>
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;