package com.zeroxrwx.smarthome.models;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "houses")
public class House {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "id")
    private long id;

    @Column(name = "address_name")
    private String addressName;

    @ManyToOne
    @JoinColumn(name="owner_id", referencedColumnName = "id", nullable=false)
    private User owner;

    @OneToMany(mappedBy = "house")
    private Set<Room> rooms;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getAddressName() {
        return addressName;
    }

    public void setAddressName(String addressName) {
        this.addressName = addressName;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwnerId(User owner) {
        this.owner = owner;
    }
}