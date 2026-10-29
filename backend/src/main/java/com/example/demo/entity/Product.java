package com.example.demo.entity;
 
import jakarta.persistence.*;
 
@Entity
public class Product {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private String name;
    private double price;
    private String image;
 
    @Column(length = 2000)
    private String description;
 
    // Soft delete — true = mashouh (ma yethaharsh lel client)
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private boolean deleted = false;
 
    public Product() {}
 
    public Long getId() { return id; }
 
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
 
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
 
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
 
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
 
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}