import React from 'react';
import { Grid } from '@mui/material';
import { getDayMonthFromDate } from '../../../utilities/DatetimeUtils';
import { weatherIcon } from '../../../utilities/IconsUtils';
import ErrorBox from '../../Reusable/ErrorBox';
import CityDateDetail from './CityDateDetail';
import TemperatureWeatherDetail from './TemperatureWeatherDetail';
import WeatherIconDetail from './WeatherIconDetail';
import Layout from '../../Reusable/Layout';

const dayMonth = getDayMonthFromDate();

const Details = ({ data }) => {
  const noDataProvided =
    !data || Object.keys(data).length === 0 || data.cod === '404';

  let content = <ErrorBox flex="1" type="error" />;

  if (!noDataProvided)
    content = (
      <>
        <Grid
          item
          xs={4}
          sx={{
            height: '80px',
            borderRadius: '8px',
            margin: '10px',
            boxShadow:
                  'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.5) 0px 4px 6px -2px',
          }}
        >
          <CityDateDetail city={data.city} date={dayMonth} />
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            margin: '10px',
            height: '80px',
            boxShadow:
                  'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.5) 0px 4px 6px -2px',
          }}
        >
          <TemperatureWeatherDetail
            temperature={data.main.temp}
            description={data.weather[0].description}
          />
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80px',
            margin: '10px',
            borderRadius: '8px',
            boxShadow:
                  'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.5) 0px 4px 6px -2px',
          }}
        >
          <WeatherIconDetail src={weatherIcon(`${data.weather[0].icon}.png`)} />
        </Grid>
      </>
    );

  return <Layout title="CURRENT WEATHER" content={content} />;
};

export default Details;
