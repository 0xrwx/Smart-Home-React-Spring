import { useState, useEffect } from 'react'

import { Toggle } from "./components/Toggle";
import './App.css';
import UserForm from "./components/UserForm";

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
    boxShadow: 'inset 0px 0px 30px 10px #DBA632',
    backgroundColor: 'yellow',
    opacity: 0,
    WebkitFilter: 'blur(10px) saturate(2)'
  }

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

const ModalAuthorization = ({isModalAuthorizationOn, setIsModalAuthorizationOn, userId, setUserId, setIsAuthorized}) => {

  const displayStyle = {
    display: 'none'
  }

  isModalAuthorizationOn ? displayStyle.display = 'block' : displayStyle.display = 'none';

  return (
      <div className={'modalAuthorizationContainer'} style={displayStyle}>
        <button className={'closeButton'} onClick={() => setIsModalAuthorizationOn(false)}>x</button>
        <div className={'modalAuthorizationContainerInside'}>
          <h1 className={'formHeader'}>Log In</h1>
          <UserForm setUserId={setUserId} setIsModalAuthorizationOn={setIsModalAuthorizationOn}
                    setIsAuthorized={setIsAuthorized}/>
        </div>
      </div>
  )
}

const LoggingButton = ({onSignOut, onSignIn, isAuthorized}) => {

  let handleFunction = () => {
  };
  let buttonText = "";

  if (isAuthorized) {
    buttonText = "Sign Out";
    handleFunction = onSignOut;
  } else {
    buttonText = "Sign In";
    handleFunction = onSignIn;
  }

  return <button onClick={handleFunction}>{buttonText}</button>
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModalAuthorizationOn, setIsModalAuthorizationOn] = useState(false);

  const [roomsMap, setRoomsMap] = useState(new Map());
  const [userId, setUserId] = useState(0);
  const [houseId, setHouseId] = useState(0);
  const [houses, setHouses] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(1);
  const [selectedRoomInOrder, setSelectedRoomInOrder] = useState(0);

  useEffect(() => {
    if (houseId !== 0) {
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
          })
          .catch((error) => console.log(error));
    }
  }, [houseId])

  useEffect(() => {
    if (userId !== 0) {
      fetch(`http://localhost:8080/api/users/${userId}/houses`)
          .then((response) => response.json())
          .then((data) => {
            setHouses(data);
            setHouseId(data[0].id)
          })
          .catch((error) => console.log(error));
    }
  }, [userId])

  const handleSelectRoom = (e) => {
    const valueInOrder = roomsMap.get(Number(e.target.value));
    const value = e.target.value

    setSelectedRoomId(value)
    setSelectedRoomInOrder(valueInOrder)
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

  const onSignOutHandle = () => {
    setSelectedRoomInOrder(0);
    setSelectedRoomId(1);
    setUserId(0);
    setHouseId(0);
    setHouse([{
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
    ])
    setHouses([])

    setIsAuthorized(false)
  };

  const onSignInHandle = () => setIsModalAuthorizationOn(true);

  return (
      <>
        <div className={'header-container'}>
          <p>{house[0].house.owner.name}</p>
          <LoggingButton
              onSignOut={onSignOutHandle}
              onSignIn={onSignInHandle}
              isAuthorized={isAuthorized}
              setUserId={setUserId}
              setHouseId={setHouses}
              userId={userId}
              houseId={houseId}/>
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
            <select value={house[selectedRoomInOrder].name} onChange={handleSelectRoom} className={'selector'}>
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

        <ModalAuthorization
            isModalAuthorizationOn={isModalAuthorizationOn}
            setUserId={setUserId}
            setIsModalAuthorizationOn={setIsModalAuthorizationOn}
            userId={userId}
            setIsAuthorized={setIsAuthorized}/>
      </>
  )
}

export default App;
