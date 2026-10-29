package com.example.demo.repository;
 
import com.example.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Rja3 bass el produits li machi mashouhin
    List<Product> findByDeletedFalse();
}
 