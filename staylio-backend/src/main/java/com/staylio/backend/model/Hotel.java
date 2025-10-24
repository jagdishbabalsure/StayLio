package com.staylio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hotels")
public class Hotel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String image;
    
    @Column(nullable = false)
    private Integer price;
    
    @Column(nullable = false)
    private Double rating;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private Integer reviews;
    
    @Column(name = "hostname")
    private String hostname;
    
    @ManyToOne
    @JoinColumn(name = "host_id")
    private Host host;
    
    // Constructors
    public Hotel() {
    }
    
    public Hotel(String name, String image, Integer price, Double rating, String city, Integer reviews) {
        this.name = name;
        this.image = image;
        this.price = price;
        this.rating = rating;
        this.city = city;
        this.reviews = reviews;
    }
    
    public Hotel(String name, String image, Integer price, Double rating, String city, Integer reviews, String hostname) {
        this.name = name;
        this.image = image;
        this.price = price;
        this.rating = rating;
        this.city = city;
        this.reviews = reviews;
        this.hostname = hostname;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getReviews() {
        return reviews;
    }

    public void setReviews(Integer reviews) {
        this.reviews = reviews;
    }

    public Host getHost() {
        return host;
    }

    public void setHost(Host host) {
        this.host = host;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    @Override
    public String toString() {
        return "Hotel{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", image='" + image + '\'' +
                ", price=" + price +
                ", rating=" + rating +
                ", city='" + city + '\'' +
                ", reviews=" + reviews +
                '}';
    }
}