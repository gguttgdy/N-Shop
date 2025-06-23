package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    List<Product> findByIsActiveTrue();
    
    List<Product> findByCategoryIdAndIsActiveTrue(String categoryId);
    
    List<Product> findBySubcategoryIdAndIsActiveTrue(String subcategoryId);
    
    List<Product> findBySectionTypeAndIsActiveTrue(String sectionType);
    
    // Метод для поиска по секции (для совместимости)
    default List<Product> findBySectionType(String sectionType) {
        return findBySectionTypeAndIsActiveTrue(sectionType);
    }
    
    @Query("{ 'categoryId': ?0, 'subcategoryId': ?1, 'isActive': true }")
    List<Product> findByCategoryAndSubcategory(String categoryId, String subcategoryId);
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' }, 'isActive': true }")
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Расширенный поиск по названию на всех языках
    @Query("{ $and: [ " +
           "{ 'isActive': true }, " +
           "{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'nameRu': { $regex: ?0, $options: 'i' } }, " +
           "{ 'namePl': { $regex: ?0, $options: 'i' } }, " +
           "{ 'categoryId': { $regex: ?0, $options: 'i' } }, " +
           "{ 'subcategoryId': { $regex: ?0, $options: 'i' } } " +
           "] } " +
           "] }")
    List<Product> findBySearchTermIgnoreCase(String searchTerm);

    // Расширенный метод фильтрации    // DEPRECATED: Этот метод не учитывает скидки правильно
    // Используется default метод findFilteredProducts с правильной логикой
    /*
    @Query("{ $and: [ " +
           "{ 'isActive': true }, " +
           "{ $or: [ " +
           "{ 'categoryId': { $exists: false } }, " +
           "{ 'categoryId': null }, " +
           "{ 'categoryId': ?0 } " +
           "] }, " +
           "{ $or: [ " +
           "{ 'subcategoryId': { $exists: false } }, " +
           "{ 'subcategoryId': null }, " +
           "{ 'subcategoryId': ?1 } " +
           "] }, " +
           "{ $or: [ " +
           "{ 'sectionType': { $exists: false } }, " +
           "{ 'sectionType': null }, " +
           "{ 'sectionType': ?2 } " +
           "] }, " +
           "{ $or: [ " +
           "{ 'name': { $regex: ?3, $options: 'i' } }, " +
           "{ 'nameRu': { $regex: ?3, $options: 'i' } }, " +
           "{ 'namePl': { $regex: ?3, $options: 'i' } } " +
           "] }, " +
           "{ 'price': { $gte: ?4, $lte: ?5 } }, " +
           "{ $or: [ " +
           "{ 'rating': { $exists: false } }, " +
           "{ 'rating': null }, " +
           "{ 'rating': { $gte: ?6 } } " +
           "] } " +
           "] }")
    List<Product> findFilteredProducts(String category, String subcategory, String section, 
                                     String search, Double minPrice, Double maxPrice, Double minRating);
    */// Упрощенный метод фильтрации без сложных условий
    default List<Product> findFilteredProducts(String category, String subcategory, String section, String search,
                                             Double minPrice, Double maxPrice, List<String> brands, List<String> colors, List<String> sizes,
                                             Boolean inStock, Double minRating, Boolean isNew, Boolean hasDiscount) {
        // Получаем базовый список продуктов
        List<Product> products;
        
        if (search != null && !search.trim().isEmpty()) {
            products = findBySearchTermIgnoreCase(search);
        } else if (category != null && subcategory != null) {
            products = findByCategoryAndSubcategory(category, subcategory);
        } else if (category != null) {
            products = findByCategoryIdAndIsActiveTrue(category);
        } else if (subcategory != null) {
            products = findBySubcategoryIdAndIsActiveTrue(subcategory);
        } else if (section != null) {
            products = findBySectionTypeAndIsActiveTrue(section);
        } else {
            products = findByIsActiveTrue();
        }          // Применяем фильтры (используем актуальную цену для фильтрации)
        return products.stream()
            .filter(product -> minPrice == null || product.getActualPrice() >= minPrice)
            .filter(product -> maxPrice == null || product.getActualPrice() <= maxPrice)
            .filter(product -> brands == null || brands.isEmpty() || 
                    (product.getBrand() != null && brands.stream().anyMatch(brand -> 
                        product.getBrand().toLowerCase().contains(brand.toLowerCase()))))
            .filter(product -> colors == null || colors.isEmpty() || 
                    (product.getColor() != null && colors.stream().anyMatch(color -> 
                        product.getColor().toLowerCase().contains(color.toLowerCase()))))
            .filter(product -> sizes == null || sizes.isEmpty() || 
                    (product.getSize() != null && sizes.stream().anyMatch(size -> 
                        product.getSize().toLowerCase().contains(size.toLowerCase()))))
            .filter(product -> inStock == null || !inStock || 
                    (product.getStock() != null && product.getStock() > 0))
            .filter(product -> minRating == null || 
                    (product.getRating() != null && product.getRating() >= minRating))
            .filter(product -> isNew == null || 
                    (product.getIsNew() != null && product.getIsNew().equals(isNew)))            .filter(product -> hasDiscount == null || !hasDiscount ||
                    product.hasDiscount())
            .collect(Collectors.toList());
    }
}
