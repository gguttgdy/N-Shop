package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private MockDataService mockDataService;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private List<Product> testProducts;

    @BeforeEach
    void setUp() {
        testProduct = new Product("Test Product", "Тестовый продукт", "Test Produkt", 99.99, "🎁", "electronics", "smartphones");
        testProduct.setId("test-product-id");
        testProduct.setIsActive(true);
        testProduct.setStock(10);
        testProduct.setRating(4.5);

        Product product2 = new Product("Test Product 2", "Тестовый продукт 2", "Test Produkt 2", 149.99, "📱", "electronics", "tablets");
        product2.setId("test-product-id-2");
        product2.setIsActive(true);
        product2.setStock(5);
        product2.setRating(4.2);

        testProducts = Arrays.asList(testProduct, product2);
    }

    @Test
    void testGetProducts_AllProducts() {
        // Given
        when(productRepository.findByIsActiveTrue()).thenReturn(testProducts);

        // When
        List<Product> result = productService.getProducts(null, null, null, null);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Product", result.get(0).getName());
        verify(productRepository).findByIsActiveTrue();
    }

    @Test
    void testGetProducts_WithCategoryFilter() {
        // Given
        List<Product> electronicsProducts = Arrays.asList(testProduct);
        when(productRepository.findByCategoryIdAndIsActiveTrue("electronics")).thenReturn(electronicsProducts);

        // When
        List<Product> result = productService.getProducts("electronics", null, null, null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("electronics", result.get(0).getCategoryId());
        verify(productRepository).findByCategoryIdAndIsActiveTrue("electronics");
    }

    @Test
    void testGetProducts_WithSubcategoryFilter() {
        // Given
        List<Product> smartphoneProducts = Arrays.asList(testProduct);
        when(productRepository.findBySubcategoryIdAndIsActiveTrue("smartphones")).thenReturn(smartphoneProducts);

        // When
        List<Product> result = productService.getProducts(null, "smartphones", null, null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("smartphones", result.get(0).getSubcategoryId());
        verify(productRepository).findBySubcategoryIdAndIsActiveTrue("smartphones");
    }

    @Test
    void testGetProducts_WithSectionFilter() {
        // Given
        List<Product> sectionProducts = Arrays.asList(testProduct);
        when(productRepository.findBySectionTypeAndIsActiveTrue("new-arrivals")).thenReturn(sectionProducts);

        // When
        List<Product> result = productService.getProducts(null, null, "new-arrivals", null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findBySectionTypeAndIsActiveTrue("new-arrivals");
    }

    @Test
    void testGetProducts_WithSearchQuery() {
        // Given
        List<Product> searchResults = Arrays.asList(testProduct);
        when(productRepository.findBySearchTermIgnoreCase("Test")).thenReturn(searchResults);

        // When
        List<Product> result = productService.getProducts(null, null, null, "Test");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getName().contains("Test"));
        verify(productRepository).findBySearchTermIgnoreCase("Test");
    }

    @Test
    void testGetProducts_DatabaseException_FallbackToMockData() {
        // Given
        when(productRepository.findByIsActiveTrue()).thenThrow(new RuntimeException("Database connection failed"));
        when(mockDataService.getProducts(null, null, null, null)).thenReturn(testProducts);

        // When
        List<Product> result = productService.getProducts(null, null, null, null);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(productRepository).findByIsActiveTrue();
        verify(mockDataService).getProducts(null, null, null, null);
    }

    @Test
    void testGetProducts_CategoryAndSubcategory() {
        // Given
        List<Product> categoryProducts = Arrays.asList(testProduct);
        when(productRepository.findByCategoryAndSubcategory("electronics", "smartphones")).thenReturn(categoryProducts);

        // When
        List<Product> result = productService.getProducts("electronics", "smartphones", null, null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findByCategoryAndSubcategory("electronics", "smartphones");
    }

    @Test
    void testGetProducts_EmptySearchString() {
        // Given
        when(productRepository.findByIsActiveTrue()).thenReturn(testProducts);

        // When
        List<Product> result = productService.getProducts(null, null, null, "");

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(productRepository).findByIsActiveTrue();
        // Should not call search method for empty string
        verify(productRepository, never()).findBySearchTermIgnoreCase(anyString());
    }

    @Test
    void testGetProducts_NullParameters() {
        // Given
        when(productRepository.findByIsActiveTrue()).thenReturn(testProducts);

        // When
        List<Product> result = productService.getProducts(null, null, null, null);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(productRepository).findByIsActiveTrue();
    }
}
