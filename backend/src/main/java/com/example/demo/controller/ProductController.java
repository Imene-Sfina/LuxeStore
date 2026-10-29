package com.example.demo.controller;
 
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
 
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
 
@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {
 
    private final ProductService service;
 
    public ProductController(ProductService service) {
        this.service = service;
    }
 
    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }
 
    // ADD PRODUCT WITH IMAGE
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product add(
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam String description,
            @RequestParam MultipartFile image,
            HttpServletRequest request          // ← pour construire l'URL dynamiquement
    ) throws IOException {
 
        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
 
        // Garde l'extension originale du fichier
        String originalName = image.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf('.'))
                : ".jpg";
        String fileName = UUID.randomUUID() + ext;
 
        image.transferTo(new File(uploadDir + fileName));
 
        // Construit l'URL dynamiquement (fonctionne en localhost ET en prod)
        String baseUrl = request.getScheme() + "://"
                + request.getServerName() + ":"
                + request.getServerPort();
        String imageUrl = baseUrl + "/uploads/" + fileName;
 
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setDescription(description);
        p.setImage(imageUrl);
 
        return service.add(p);
    }
 
    // UPDATE PRODUCT
    @PutMapping("/{id}")
    public Product update(
            @PathVariable Long id,
            @RequestBody Product p
    ) {
        return service.update(id, p);
    }
 
    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}