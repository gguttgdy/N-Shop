package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
