import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

function App() {
  const API_KEY = "c58da9b33ffffa7c5b0b085774af0935";
  const [location, setLocation] = useState("");
  const [result, setResult] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [localDate, setLocalDate] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
  const hambuger = '/img/hambuger.png';
  const mainImage = '/img/main.png'; // Path to your main.png

  const searchWeather = async (e) => {
    if (e.key === 'Enter') {
      try {
        const { data } = await axios.get(url);
        setResult(data);
        setError(null);
        setWeatherMessage(data);
        setLocalDate(getLocalDate(data.timezone));
      } catch (err) {
        setError("Could not fetch weather data. Please check the city name.");
        setResult({});
      }
    }
  };

  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

  const accuratePer = "Accurate";

  const setWeatherMessage = (data) => {
    const temp = kelvinToCelsius(data.main.temp);
    let img = '';
    let tempMessage = '';

    if (temp >= 28) {
      img = '/img/sticky.png';
      tempMessage = "It's CRAZY";
    } else if (temp >= 21) {
      img = '/img/shortSleeve.png';
      tempMessage = "It's HOT";
    } else if (temp >= 16) {
      img = '/img/warm.png';
      tempMessage = "It's chilly";
    } else if (temp >= 5) {
      img = '/img/cold.png';
      tempMessage = "It's cold";
    } else {
      img = '/img/freezing.png';
      tempMessage = "It's freezing cold";
    }

    setImageSrc(img);
    setMessage(tempMessage);

    const tempMax = kelvinToCelsius(data.main.temp_max);
    const tempMin = kelvinToCelsius(data.main.temp_min);
    if (tempMax - tempMin >= 10) {
      setMessage((prevMessage) => `${prevMessage}. The temperature swings are big.`);
    }
  };

  const getLocalDate = (timezone) => {
    const localTime = new Date(Date.now() + timezone * 1000);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return localTime.toLocaleDateString(undefined, options);
  };

  return (
    <AppWrap>
      <div className='appContentWrap'>
        {/* Always show hamburger and search bar */}
        <SearchContainer>
          <Hambuger src={hambuger} alt="Hamburger Icon" />
          <SearchInput
            placeholder='Enter the City'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type='text'
            onKeyDown={searchWeather}
          />
        </SearchContainer>

        {/* Display main image only if there's no weather result */}
        {!result.main && <MainImage src={mainImage} alt="Main" />}

        {/* Show the weather results if available */}
        {result.main && (
          <>
            <DateDisplay>{localDate}</DateDisplay>

            <WeatherCircleContainer>
              <WeatherCircle>
                <img src={imageSrc} alt="Outfit" />
              </WeatherCircle>
              <AccurateCircle>
                <div className='title'>It's</div>
                <div>{accuratePer}</div>
              </AccurateCircle>
            </WeatherCircleContainer>

            <Message>{message}</Message>

            <OpinionWrap>
              <span>I think</span>
              <select>
                <option>...</option>
                <option>It's thin</option>
                <option>It's accurate</option>
                <option>It's thick</option>
              </select>
            </OpinionWrap>

            {error && <div className='error'>{error}</div>}
            {result.main && (
              <WeatherBoxContainer>
                <WeatherBox>
                  <div className='label'>Feels Like</div>
                  <div className='value'>{kelvinToCelsius(result.main.feels_like)} °C</div>
                </WeatherBox>
                <WeatherBox>
                  <div className='label'>Wind</div>
                  <div className='value'>{result.wind?.speed} m/s</div>
                </WeatherBox>
                <WeatherBox>
                  <div className='label'>Humidity</div>
                  <div className='value'>{result.main.humidity} %</div>
                </WeatherBox>
              </WeatherBoxContainer>
            )}
          </>
        )}
      </div>
    </AppWrap>
  );
}

export default App;

const AppWrap = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 55px;
  background-color: #1E90FF;
  font-family: "Roboto", sans-serif;

  .appContentWrap {
    width: 100%;
    max-width: 360px;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const Hambuger = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 10px;
`;

const SearchInput = styled.input`
  width: 210px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #f9f9f9;
`;

const DateDisplay = styled.div`
  font-size: 1.2em;
  margin-top: 20px;
  color: #f9f9f9;
`;

const WeatherCircleContainer = styled.div`
  position: relative;
  width: 260px;
  height: 260px;
  margin: 10px auto;
`;

const WeatherCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background-color: #cfebf7;

  img {
    width: 75%;
    height: 75%;
    object-fit: cover;
    margin-top: 20px;
    align-items: center;
  }
`;

const AccurateCircle = styled.div`
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background-color: #f9f9f9;
  position: absolute;
  bottom: -8px;
  right: -8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    font-size: 1.1em;
    text-align: center;
  }
`;

const Message = styled.div`
  font-size: 1.4em;
  color: #f9f9f9;
  margin: 10px 0;
`;

const OpinionWrap = styled.div`
  margin: 15px 0;
  border-radius: 5px;
  color: #f9f9f9;
  font-size: 1.3em;
  
  select {
    margin-left: 9px;
    padding: 9px;
    border-radius: 8px;
    width: 150px;
    height: 40px;
  }
`;

const WeatherBoxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 11px;
`;

const WeatherBox = styled.div`
  width: 60px;
  height: 65px;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  background-color: #f3fafd;

  .label {
    font-size: 0.75em;
    font-weight: bold;
  }

  .value {
    font-size: 0.95em;
    margin-top: 15px;
  }
`;
