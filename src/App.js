import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Link, SvgIcon, Typography } from '@mui/material';
import {Routes, Route, useLocation } from "react-router-dom";
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import HourlyForecast from './components/HourlyForecast/HourlyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { fetchWeatherData, fetchHourlyWeatherData} from './api/OpenWeatherService';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import {
  getHourlyForecastWeather,
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';

function App() {
  const location = useLocation();
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [hourForecast, setHourForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [latitude, longitude] = ["42.361145", "-71.057083"]
  const weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

  useEffect(() => {
    searchChangeHandler()
  },[])

  useEffect(() => {
      let day = location.pathname.split("/")[1]
      let day_no = weekday.findIndex(x => x==day)
      if( day_no > -1)
        extractHourlyData(day, day_no)
  }, [location])

  const extractHourlyData = async (day, day_no) => {
    setIsLoading(true)
    let current_date = new Date();
    const current_day = current_date.getDay()
    current_date.setDate(current_date.getDate() - Math.abs(current_day-day_no))
    let epochTime = new Date(current_date).getTime() / 1000

    try{
      const hourlyWeatherData = await fetchHourlyWeatherData(latitude, longitude, parseInt(epochTime).toString())
      const all_hour_forecasts_list = getHourlyForecastWeather(hourlyWeatherData, ALL_DESCRIPTIONS)
      setHourForecast({
        city: "Boston, US",
        list: all_hour_forecasts_list
      })
    }
    catch(error){
      setError(true);
    }
    setIsLoading(false)
  }
  
  const searchChangeHandler = async (enteredData) => {
    setIsLoading(true);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] = await fetchWeatherData(latitude, longitude);
      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: "Boston, US", ...todayWeatherResponse });

      setWeekForecast({
        city: "Boston, US",
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Routes>
            <Route path="/" element = {<WeeklyForecast data={weekForecast} />} ></Route>
            {weekday.map((day, index) => {
              return (
                <Route path={`/${day}`} element = {<HourlyForecast data={hourForecast} day={day}/>}
                  key={index}
                />
              );
            })}
          </Routes>
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '500px',
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '10px', sm: '12px' },
              color: 'rgba(255, 255, 255, .8)',
              lineHeight: 1,
              fontFamily: 'Poppins',
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: { xs: '95%', sm: '80%', md: '1100px' },
        width: '100%',
        height: '100%',
        margin: '2% auto',
        padding: '1rem 0 3rem',
        marginBottom: '1rem',
        borderRadius: {
          xs: 'none',
          sm: '0 0 1rem 1rem',
        },
        // boxShadow: {
        //   xs: 'none',
        //   sm: 'rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px',
        // },
      }}
    >
      <Grid container >
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              margin: '1rem 30%'
            }}
          >
            <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '20px', sm: '35px' },
              textAlign: 'center',
              color: 'rgba(255, 255, 255, .8)',
              lineHeight: 1,
              borderBottom: 1,
              fontFamily: 'Poppins',
            }}
          >
            The Daily Weather Forecast
          </Typography>
          </Box>
        </Grid>
        {appContent}
      </Grid>
    </Container>
  );
}

export default App;
