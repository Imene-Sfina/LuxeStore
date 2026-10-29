package com.example.demo.service;
 
import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
 
@Service
public class ProductService {
 
    private final ProductRepository repo;
 
    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }
 
    public List<Product> getAll() {
        return repo.findByDeletedFalse();
    }
 
    public Product add(Product p) {
        p.setDeleted(false);
        return repo.save(p);
    }
 
    public Product update(Long id, Product p) {
        Product old = repo.findById(id).orElseThrow();
        old.setName(p.getName());
        old.setPrice(p.getPrice());
        old.setDescription(p.getDescription());
        if (p.getImage() != null) old.setImage(p.getImage());
        return repo.save(old);
    }
 
    // Soft delete — ma yetmesahch mel base, just yetmarkem k "mashouh"
    public void delete(Long id) {
        Product p = repo.findById(id).orElseThrow();
        p.setDeleted(true);
        repo.save(p);
    }
}