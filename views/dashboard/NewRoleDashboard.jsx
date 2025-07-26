import React from 'react';
import { Grid } from '@mui/material';
import ReusableBarChart from 'ui-component/charts/ReusableBarChart';
import ReusableLineChart from 'ui-component/charts/LineChart';
import ReusableDonutChart from 'ui-component/charts/DonutChart';
import { gridSpacing } from 'store/constant';

const NewRoleDashboard = () => {
  // --- Fake Data for Bar Chart ---
  const barChartSeries = [
    {
      name: 'Enrollments',
      data: [35, 125, 35, 35, 35, 80, 35, 20, 125, 35]
    }
  ];
  const barChartCategories = [
    'Class A', 'Class B', 'Class C', 'Class D', 'Class E', 'Class F', 'Class G', 'Class H', 'Class I', 'Class J'
  ];

  // --- Fake Data for Line Chart ---
  const lineChartSeries = [
    {
      name: 'Monthly Logins',
      data: [120, 150, 110, 130, 90, 140, 160, 180, 170, 190, 210, 200]
    },
    {
        name: 'Sign-ups',
        data: [30, 40, 25, 50, 49, 60, 70, 91, 125, 100, 110, 130]
    }
  ];
  const lineChartCategories = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // --- Fake Data for Donut Chart ---
  const donutChartSeries = [44, 55, 13, 43];
  const donutChartLabels = ['Active', 'Inactive', 'Pending', 'Suspended'];

  return (
    <Grid container spacing={gridSpacing}>
      {/* Bar Chart */}
      <Grid item xs={12} md={8}>
        <ReusableBarChart
          title="Student Enrollments per Class"
          series={barChartSeries}
          xAxisCategories={barChartCategories}
          xAxisTitle="Classes"
          yAxisTitle="Number of Students"
        />
      </Grid>

      {/* Donut Chart */}
      <Grid item xs={12} md={4}>
        <ReusableDonutChart
          title="Account Status"
          series={donutChartSeries}
          labels={donutChartLabels}
        />
      </Grid>

      {/* Line Chart */}
      <Grid item xs={12}>
        <ReusableLineChart
          title="User Activity Over Time"
          series={lineChartSeries}
          xAxisCategories={lineChartCategories}
          xAxisTitle="Month"
          yAxisTitle="Count"
        />
      </Grid>
    </Grid>
  );
};

export default NewRoleDashboard;