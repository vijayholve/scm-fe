import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import api from '../../utils/apiService';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { useSelector } from 'react-redux';
import GenderChart from './GenderChat';
import StudentPerClassLineChartCard from './TotalOrderLineChartCard';
import StudentPerClassBarChart from './TotalGrowthBarChart';
import AttendancePerClass from './AttendancePerClass';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const user = useSelector((state) => state.user.user);
  console.log('User:', user);
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    api
      .get('api/dashboard/getCounts/1?type=TEACHER')
      .then((response) => {
        console.log(response?.data?.nameVsValue);
        setDashboardData(response?.data?.nameVsValue);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalIncomeLightCard
              {...{
                isLoading: isLoading,
                 total: Number(dashboardData?.TeacherCount) || 0, // Convert to number
                label: 'Total Teacher',
                icon: <StorefrontTwoToneIcon fontSize="inherit" />,
                redirectURL: '/masters/teachers'
              }}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalIncomeLightCard
              {...{
                isLoading: isLoading,
                total: Number(dashboardData?.TeacherCount) || 0, // Convert to number
                label: 'Total Student',
                icon: <StorefrontTwoToneIcon fontSize="inherit" />,
                redirectURL: '/masters/students'
              }}
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <TotalIncomeLightCard
              {...{
                isLoading: isLoading,
                total: Number(dashboardData?.TeacherCount) || 0, // Convert to number
                label: 'Total Subject',
                icon: <StorefrontTwoToneIcon fontSize="inherit" />,
                redirectURL: '/masters/subjects'
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <StudentPerClassBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <AttendancePerClass isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={6}>
            <GenderChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PopularCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StudentPerClassLineChartCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
