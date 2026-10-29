package com.example.demo.service;
 
import com.example.demo.entity.Order;
import com.example.demo.entity.User;
import com.example.demo.repository.OrderRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
 
import java.time.LocalDateTime;
 
@Service
public class OrderService {
 
    private final OrderRepository repo;
 
    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }
 
    public Order placeOrder(Order o) {
        // Récupère l'utilisateur connecté depuis le token JWT
        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
 
        o.setUser(currentUser);
        o.setOrderDate(LocalDateTime.now());
 
        return repo.save(o);
    }
}