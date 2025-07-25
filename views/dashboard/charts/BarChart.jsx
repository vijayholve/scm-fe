import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| REUSABLE BAR CHART COMPONENT ||============================== //
/**
 * ReusableBarChart
 * 
 * This component renders a bar chart using ApexCharts with MUI theming.
 * 
 * Props:
 * - title: Chart title
 * - subtitle: Chart subtitle
 * - series: Array of series data [{ name: 'Label', data: [values] }]
 * - xAxisCategories: Array of x-axis categories
 * - xAxisTitle: String for x-axis title
 * - yAxisTitle: String for y-axis title
 * - height: Chart height
 * - showCard: If true, wraps chart in MainCard
 * - chartId: Unique chart id
 * - colors: Array of colors for bars
 * - dataLabels: ApexCharts dataLabels config
 * - plotOptions: ApexCharts plotOptions config
 * - ...otherChartOptions: Any other ApexCharts options
 */

const getBarColors = (theme, colorsProp) => {
  if (colorsProp && Array.isArray(colorsProp) && colorsProp.length > 0) {
    return colorsProp;
  }
  // Default color palette from theme
  return [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.info.main
  ];
};

const ReusableBarChart = ({
  title,
  subtitle,
  series = [],
  xAxisCategories = [],
  xAxisTitle = '',
  yAxisTitle = '',
  height = 480,
  showCard = true,
  chartId = 'reusable-bar-chart',
  colors,
  dataLabels = { enabled: false },
  plotOptions = {},
  ...otherChartOptions
}) => {
  const theme = useTheme();

  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  // Default chart configuration
  const defaultChartOptions = {
    chart: {
      id: chartId,
      type: 'bar',
      height: height,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        ...plotOptions.bar
      },
      ...plotOptions
    },
    dataLabels: dataLabels,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: xAxisCategories,
      title: {
        text: xAxisTitle,
        style: {
          color: primary
        }
      },
      labels: {
        style: {
          colors: primary
        }
      }
    },
    yaxis: {
      title: {
        text: yAxisTitle,
        style: {
          color: primary
        }
      },
      labels: {
        style: {
          colors: primary
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        }
      }
    },
    legend: {
      labels: {
        colors: primary
      }
    },
    grid: {
      borderColor: divider
    },  
    colors: getBarColors(theme, colors),
    ...otherChartOptions
  };

  const chartConfig = {
    options: defaultChartOptions,
    series: series
  };

  const ChartContent = () => (
    <Grid container spacing={gridSpacing}>
      {(title || subtitle) && (
        <Grid item xs={12}>
          <Grid container direction="column" spacing={1}>
            {subtitle && (
              <Grid item>
                <Typography variant="subtitle2">{subtitle}</Typography>
              </Grid>
            )}
            {title && (
              <Grid item>
                <Typography variant="h3">{title}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        sx={{
          '& .apexcharts-menu.apexcharts-menu-open': {
            bgcolor: 'background.paper'
          }
        }}
      >
        <Chart {...chartConfig} />
      </Grid>
    </Grid>
  );

  return showCard ? (
    <MainCard>
      <ChartContent />
    </MainCard>
  ) : (
    <ChartContent />
  );
};

ReusableBarChart.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.array.isRequired
    })
  ).isRequired,
  xAxisCategories: PropTypes.array,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  height: PropTypes.number,
  showCard: PropTypes.bool,
  chartId: PropTypes.string,
  colors: PropTypes.array,
  dataLabels: PropTypes.object,
  plotOptions: PropTypes.object
};

export default ReusableBarChart;