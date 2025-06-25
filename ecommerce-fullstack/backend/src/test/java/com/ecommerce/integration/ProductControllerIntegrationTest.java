package com.ecommerce.integration;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebMvc
@ActiveProfiles("test")
class ProductControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ProductRepository productRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        productRepository.deleteAll();
    }

    @Test
    void shouldGetAllProducts() throws Exception {
        // Given
        Product product = new Product();
        product.setName("Test Product");
        product.setPrice(99.99);
        product.setDescription("Test Description");
        product.setCategoryId("electronics");
        product.setImage("test-image.jpg");
        product.setStock(10);
        productRepository.save(product);

        // When & Then
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void shouldGetProductById() throws Exception {
        // Given
        Product product = new Product();
        product.setName("Test Product");
        product.setPrice(99.99);
        product.setDescription("Test Description");
        product.setCategoryId("electronics");
        product.setImage("test-image.jpg");
        product.setStock(10);
        Product savedProduct = productRepository.save(product);

        // When & Then
        mockMvc.perform(get("/api/products/" + savedProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void shouldReturnNotFoundForNonExistentProduct() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/products/nonexistent-id"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetProductsWithCurrency() throws Exception {
        // Given
        Product product = new Product();
        product.setName("Test Product");
        product.setPrice(99.99);
        product.setDescription("Test Description");
        product.setCategoryId("electronics");
        product.setImage("test-image.jpg");
        product.setStock(10);
        productRepository.save(product);

        // When & Then
        mockMvc.perform(get("/api/products/with-currency")
                .param("currency", "USD"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
