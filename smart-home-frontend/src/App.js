import { useState, useEffect } from 'react'

import { Toggle } from "./components/Toggle";
import './App.css';

const Room = ({ name, temperature, brightness, light }) => {
  const lamp = {
    content: "",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '60%',
    borderRadius: '50%',
    // boxShadow: "0px 0px 30px 10px #DBA632",
    boxShadow: 'inset 0px 0px 30px 10px #DBA632',
    backgroundColor: 'yellow',
    opacity: 0,
    WebkitFilter: 'blur(10px) saturate(2)'
  }
  //console.log(light)
  //console.log(brightness)

  if (light) {
    lamp.opacity = brightness
  }
  else {
    lamp.opacity = 0
  }
  
  return (
    <div>
      <div className='room' >
        <div style={lamp} />
        <div className='room-name'>
          {name}
        </div>
        <div className='room-temperature'>
          {temperature}° C
        </div>
      </div>
    </div>
  )
}

const House = ({ data }) => {
  return (
    <div className='house'>
      {data.map(room => {
        return <Room
            key={room.id} name={room.name}
            temperature={room.temperature}
            brightness={room.brightness}
            light={room.light}
            className={"room"}
        />
      }
    )}
    </div>
  )
}

const LoggingButton = ({ onClick, isAuthorized }) => {
  if (isAuthorized === true) {
    return (
        <button onClick={onClick}>
          Sight Out
        </button>
    )
  }
  else {
    return (
        <button onClick={onClick}>
          Sight In
        </button>
    )
  }
}

const App = () => {
  const [house, setHouse] = useState([{
    "id": 1,
    "name": "",
    "brightness": 0,
    "light": false,
    "temperature": 0,
    house: {
      id: 1,
      addressName: "",
      owner: {
        id: 1,
        name: "",
        password: ""
      }
    }
  }
  ]);

  const [rangeValue, setRangeValue] = useState(0);
  const [lightIsOn, setLightIsOn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const [roomsMap, setRoomsMap] = useState(new Map());
  const [userId, setUserId] = useState(3);
  const [houseId, setHouseId] = useState(1);
  const [houses, setHouses] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(1);
  const [selectedRoomInOrder, setSelectRoomInOrder] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/api/houses/${houseId}/rooms`)
        .then((response) => response.json())
        .then((data) => {
          setHouse(data);

          const map = new Map();
          for (const dataKey in data) {
            map.set(data[dataKey].id, Number(dataKey))
          }
          setRoomsMap(map)
          setSelectedRoomId(data[0].id);

          setLightIsOn(data[selectedRoomInOrder]["light"]);
          setRangeValue(data[selectedRoomInOrder]["brightness"]);
          // setTemperature(data.rooms[selectValue]["temperature"]);
        })
        .catch((error) => console.log(error));
  }, [houseId])

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${userId}/houses`)
        .then((response) => response.json())
        .then((data) => {
          setHouses(data);
          setHouseId(data[0].id)
        })
        .catch((error) => console.log(error));
  }, [])

  const handleSelectRoom = (e) => {
    const valueInOrder = roomsMap.get(Number(e.target.value));
    const value = e.target.value

    setSelectedRoomId(value)
    setSelectRoomInOrder(valueInOrder)
    setRangeValue(house[valueInOrder].brightness)
    setLightIsOn(house[valueInOrder].light)
  };

  const handleSelectHouse = (e) => setHouseId(e.target.value);

  const handleRange = (e) => {
    const rangeValue = e.target.value;

    fetch(`http://localhost:8080/api/rooms/${selectedRoomId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brightness: rangeValue }),
    })
        .then((response) => response.json())
        .then((data) => {

        // update
        const updated = house;
        updated[selectedRoomInOrder] = data
        setHouse(updated)
      })
      .catch((error) => console.log(error));

    const updated = house;

    updated[selectedRoomInOrder]['brightness'] = rangeValue
    setHouse(updated)
    setRangeValue(rangeValue);
  };

  const handleOnChange = () => {
    const toggleValue = !lightIsOn;

    fetch(`http://localhost:8080/api/rooms/${selectedRoomId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        light: toggleValue
      }),
    })
        .then((response) => response.json())
        .then((data) => {

        // update
        const updated = house;
        updated[selectedRoomInOrder] = data
        setHouse(updated)
      })
      .catch((error) => console.log(error));

    const updated = house;

    updated[selectedRoomInOrder]['light'] = toggleValue
    setHouse(updated)
    setLightIsOn(toggleValue);
  };

  const logInHandleClick = () => {
    setIsAuthorized(!isAuthorized)
  };

  return (
      <>
        <div className={'header-container'}>
          <p>{house[0].house.owner.name}</p>
          <LoggingButton onClick={logInHandleClick} isAuthorized={isAuthorized} />
        </div>

        <div className='main-container'>
          <div className='left-container'>
            <div className={'house-header'}>
              <p>{house[0].house.addressName}</p>
            </div>
            <House data={house}/>
          </div>
          <div className='right-container'>
            <h1 className='selected-value'>{house[selectedRoomInOrder].name}</h1>
            <select value={selectedRoomInOrder.name} onChange={handleSelectRoom} className={'selector'}>
              {house.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                  )
              )
              }
            </select>

            <select value={house[0].house.id} onChange={handleSelectHouse} className={'selector'}>
              {houses.map(house => (
                      <option key={house.id} value={house.id}>
                        {house.addressName}
                      </option>
                  )
              )}
            </select>
            <h2>
              {selectedRoomInOrder + 1}
            </h2>
            <Toggle
                label="light OFF/ON"
                toggled={lightIsOn}
                onClick={handleOnChange}
            />
            <input className="input-range" type="range" min={0} max={1} step={0.01} value={rangeValue}
                   onChange={handleRange}></input>
            <p>{rangeValue}</p>
            <p className="temperature">
              Temperature: {house[selectedRoomInOrder].temperature}
            </p>
          </div>
        </div>
      </>
  )
}

export default App;
