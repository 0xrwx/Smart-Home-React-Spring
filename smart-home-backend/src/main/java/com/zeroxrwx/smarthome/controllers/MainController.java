package com.zeroxrwx.smarthome.controllers;

import com.zeroxrwx.smarthome.exceptions.HouseNotFoundException;
import com.zeroxrwx.smarthome.exceptions.RoomNotFoundException;
import com.zeroxrwx.smarthome.exceptions.UserNotFoundException;
import com.zeroxrwx.smarthome.models.House;
import com.zeroxrwx.smarthome.models.User;
import com.zeroxrwx.smarthome.models.Room;
import com.zeroxrwx.smarthome.repositories.HousesRepository;
import com.zeroxrwx.smarthome.repositories.RoomsRepository;
import com.zeroxrwx.smarthome.repositories.UsersRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path="/api")
public class MainController {
    @Autowired
    private UsersRepository userRepository;
    @Autowired
    private HousesRepository housesRepository;
    @Autowired
    private RoomsRepository roomsRepository;

    @CrossOrigin
    @GetMapping(path="/users")
    public @ResponseBody Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @CrossOrigin
    @GetMapping(path="/users/{id}")
    public @ResponseBody User getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @CrossOrigin
    @GetMapping(path="/users/{id}/houses")
    public @ResponseBody Iterable<House> getUserHouses(@PathVariable Long id) {
        Iterable<House> allHouses = housesRepository.findAll();
        List<House> userHouses = new ArrayList<>();

        allHouses.forEach((element) -> {
            if(id == element.getOwner().getId()) {
                userHouses.add(element);
            }
        });

        return userHouses;
    }

    @CrossOrigin
    @GetMapping(path="/houses")
    public @ResponseBody Iterable<House> getAllHouses() {
        return housesRepository.findAll();
    }

    @CrossOrigin
    @GetMapping(path="/houses/{id}")
    public @ResponseBody House getHouse(@PathVariable Long id) {
        return housesRepository.findById(id)
                .orElseThrow(() -> new HouseNotFoundException(id));
    }

    @CrossOrigin
    @GetMapping(path="/houses/{houseId}/rooms")
    public @ResponseBody Iterable<Room> getHouseRooms(@PathVariable Long houseId) {
        Iterable<Room> allRooms = roomsRepository.findAll();
        List<Room> houseRooms = new ArrayList<>();

        allRooms.forEach((element) -> {
            if(houseId == element.getHouse().getId()) {
                houseRooms.add(element);
            }
        });

        return houseRooms;
    }

    @CrossOrigin
    @GetMapping(path="/rooms")
    public @ResponseBody Iterable<Room> getAllRooms() {
        return roomsRepository.findAll();
    }

    @CrossOrigin
    @GetMapping(path="/rooms/{id}")
    public @ResponseBody Room getRoom(@PathVariable Long id) {
        return roomsRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));
    }

    @CrossOrigin
    @PutMapping("/rooms/{id}")
    Room replaceRoom(@RequestBody @NotNull Room newRoom, @PathVariable Long id) {
        return roomsRepository.findById(id).map(room -> {
            if (newRoom.getName() != null) {
                room.setName(newRoom.getName());
            }
            if (newRoom.getBrightness() != null) {
                room.setBrightness(newRoom.getBrightness());
            }
            if (newRoom.getLight() != null) {
                room.setLight(newRoom.getLight());
            }
            if (newRoom.getTemperature() != null) {
                room.setTemperature(newRoom.getTemperature());
            }
            return roomsRepository.save(room);
        }).orElseGet(() -> {
            newRoom.setId(id);
            return roomsRepository.save(newRoom);
        });
    }

    @CrossOrigin
    @PostMapping(path="/rooms")
    public String addNewRoom (@RequestBody @NotNull Room newRoom) {
        Iterable<Room> allRooms = roomsRepository.findAll();

        Room lastRoom = null;
        for (Room room : allRooms) {
            lastRoom = room;
        }
        assert lastRoom != null;
        newRoom.setId(lastRoom.getId() + 1);

        roomsRepository.save(newRoom);
        return "Saved";
    }
}
