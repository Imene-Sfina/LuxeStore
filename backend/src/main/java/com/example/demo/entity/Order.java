package com.example.demo.entity;
 
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
 
@Entity
@Table(name = "orders")
public class Order {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private double total;
 
    private LocalDateTime orderDate;
 
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
 
    @OneToMany(cascade = CascadeType.ALL)
    private List<CartItem> items;
 
    // Getters / Setters
    public Long getId() { return id; }
 
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
 
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
 
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
 
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
}