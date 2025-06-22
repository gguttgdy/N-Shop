package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

import java.util.List;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String nameRu;
    private String namePl;
    private String description;
    private String descriptionRu;
    private String descriptionPl;
    private Double price;
    private Double oldPrice;
    private Integer discount;
    private String image;
    private String categoryId;
    private String subcategoryId;
    private String sectionType;
    private Double rating;
    private Integer stock;
    private Double originalPrice;
    private Double originalOldPrice;
    private Boolean isNew;
    private Boolean isActive;
    private String brand; // Новое поле для бренда
    private String color; // Новое поле для цвета
    private String size; // Новое поле для размера
    private List<String> tags; // Новое поле для тегов

    // Constructors
    public Product() {}

    public Product(String name, String nameRu, String namePl, Double price, String image, 
                   String categoryId, String subcategoryId) {
        this.name = name;
        this.nameRu = nameRu;
        this.namePl = namePl;
        this.price = price;
        this.image = image;
        this.categoryId = categoryId;
        this.subcategoryId = subcategoryId;
        this.isActive = true;
        this.stock = 100;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameRu() { return nameRu; }
    public void setNameRu(String nameRu) { this.nameRu = nameRu; }

    public String getNamePl() { return namePl; }
    public void setNamePl(String namePl) { this.namePl = namePl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDescriptionRu() { return descriptionRu; }
    public void setDescriptionRu(String descriptionRu) { this.descriptionRu = descriptionRu; }

    public String getDescriptionPl() { return descriptionPl; }
    public void setDescriptionPl(String descriptionPl) { this.descriptionPl = descriptionPl; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOldPrice() { return oldPrice; }
    public void setOldPrice(Double oldPrice) { this.oldPrice = oldPrice; }

    public Integer getDiscount() { return discount; }
    public void setDiscount(Integer discount) { this.discount = discount; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(String subcategoryId) { this.subcategoryId = subcategoryId; }

    public String getSectionType() { return sectionType; }
    public void setSectionType(String sectionType) { this.sectionType = sectionType; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public Double getOriginalOldPrice() { return originalOldPrice; }
    public void setOriginalOldPrice(Double originalOldPrice) { this.originalOldPrice = originalOldPrice; }

    public Boolean getIsNew() { return isNew; }
    public void setIsNew(Boolean isNew) { this.isNew = isNew; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
