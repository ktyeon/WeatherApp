import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

function App() {
  const API_KEY = "c58da9b33ffffa7c5b0b085774af0935";
  const [location, setLocation] = useState("");
  const [result, setResult] = useState({});
  const [error, setError] = useState(null);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;

  const searchWeather = async (e) => {
    if (e.key === 'Enter') {
      try {
        const { data } = await axios.get(url);
        console.log(data);
        setResult(data);
        setError(null);
      } catch (err) {
        setError("Could not fetch weather data. Please check the city name.");
        setResult({});
      }
    }
  };

  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

  return (
    <AppWrap>
      <div className='appContentWrap'>
        <input
          placeholder='Enter the City'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          type='text'
          onKeyDown={searchWeather}
        />

        <ResultWrap>
          {error && <div className='error'>{error}</div>}
          {result.main && (
            <>
              <WeatherBox>
                <div className='label'>Feels Like</div>
                <div className='value'>{kelvinToCelsius(result.main.feels_like)} °C</div>
              </WeatherBox>
              <WeatherBox>
                <div className='label'>Wind Speed</div>
                <div className='value'>{result.wind?.speed} m/s</div>
              </WeatherBox>
              <WeatherBox>
                <div className='label'>Humidity</div>
                <div className='value'>{result.main.humidity} %</div>
              </WeatherBox>
            </>
          )}
        </ResultWrap>
      </div>
    </AppWrap>
  );
}

export default App;

const AppWrap = styled.div`
  width: 100vw;
  height: 100vh;

  .appContentWrap {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    border: 0.5px black solid;
    padding: 20px;
    border-radius: 8px;
  }
`;

const ResultWrap = styled.div`
  margin-top: 60px;
  padding: 10px;
  border-radius: 8px;
  display : flex;
  
`;

const WeatherBox = styled.div`
  margin: 10px 0;
  padding: 15px;
  border: 1px black solid;
  border-radius: 8px;
  background-color: white;
  

  .label {
    font-weight: regular;
    font-size: 0.8em;
  }

  .value {
    font-size: 0.8em;
    color: #333;
  }
`;
