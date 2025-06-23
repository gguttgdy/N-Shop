package com.ecommerce.config;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ReceiptRepository receiptRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ComplaintRepository complaintRepository;
    
    @Autowired
    private UserDiscountRepository userDiscountRepository;
    
    @Autowired
    private ReturnRepository returnRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Добавляем задержку для стабилизации соединения с MongoDB
            Thread.sleep(5000);
            
            System.out.println("Attempting to connect to MongoDB sklep database...");
            
            // Проверяем подключение к базе данных с таймаутом
            long count = -1;
            int maxRetries = 3;
            for (int i = 0; i < maxRetries; i++) {
                try {
                    count = productRepository.count();
                    System.out.println("Current products count in MongoDB sklep: " + count);
                    break;
                } catch (Exception e) {
                    System.err.println("Attempt " + (i + 1) + " failed to connect to MongoDB: " + e.getMessage());
                    if (i < maxRetries - 1) {
                        Thread.sleep(3000);
                    } else {
                        throw e;
                    }
                }
            }
              // Если подключение успешно, инициализируем данные
            if (count == 0) {
                System.out.println("Initializing products in MongoDB sklep database...");
                initializeAllProducts();
                System.out.println("Successfully initialized products in MongoDB!");
            } else {
                System.out.println("Database already contains " + count + " products. Skipping product initialization.");
            }
            
            // Инициализируем пользователей и данные профиля
            initializeUserProfileData();
            
        } catch (Exception e) {
            System.err.println("Failed to initialize database: " + e.getMessage());
            e.printStackTrace();
            System.err.println("Application will continue without sample data.");
        }
    }

    // Метод инициализации оставляем для возможного использования в будущем
    private void initializeProducts() {
        // ...existing code...
    }

private Product createProduct(String name, String nameRu, String namePl, Double price, String image, 
                             String categoryId, String subcategoryId, String sectionType, 
                             Double rating, Boolean isNew, Integer discount) {
    Product product = new Product(name, nameRu, namePl, price, image, categoryId, subcategoryId);
    product.setSectionType(sectionType);
    product.setRating(rating);
    product.setIsNew(isNew);
    product.setDiscount(discount);
    
    // Извлекаем бренд из названия
    String brand = extractBrandFromName(name);
    if (brand != null) {
        product.setBrand(brand);
    }
    
    if (discount > 0) {
        product.setOldPrice(price);
        product.setPrice(price * (100 - discount) / 100);
    }
    
    return product;
}

// Метод для извлечения бренда из названия продукта
private String extractBrandFromName(String name) {
    String[] knownBrands = {
        "Apple", "Samsung", "Sony", "Google", "Xiaomi", "OnePlus", "Huawei",
        "Nike", "Adidas", "Puma", "Reebok", "New Balance",
        "Canon", "Nikon", "Fujifilm", "GoPro",
        "Dell", "HP", "Lenovo", "ASUS", "Acer", "Microsoft",
        "Bose", "JBL", "Sennheiser", "Beats",
        "iPhone", "Galaxy", "Pixel", "MacBook", "ThinkPad", "Surface"
    };
    
    String lowerName = name.toLowerCase();
    for (String brand : knownBrands) {
        if (lowerName.contains(brand.toLowerCase())) {
            return brand;
        }
    }
    return null;
}

// Full product initialization method
private void initializeAllProducts() {
    List<Product> products = Arrays.asList(
        // ELECTRONICS CATEGORY
        // Smartphones subcategory - убедимся что subcategory = "smartphones"
        createProduct("iPhone 15 Pro", "iPhone 15 Pro", "iPhone 15 Pro", 999.99, "📱", "electronics", "smartphones", "new-arrivals", 4.8, true, 0),
        createProduct("Samsung Galaxy S24", "Samsung Galaxy S24", "Samsung Galaxy S24", 899.99, "📱", "electronics", "smartphones", "hot-deals", 4.7, false, 10),
        createProduct("Google Pixel 8", "Google Pixel 8", "Google Pixel 8", 699.99, "📱", "electronics", "smartphones", "recommended", 4.6, false, 5),
        createProduct("OnePlus 12", "OnePlus 12", "OnePlus 12", 799.99, "📱", "electronics", "smartphones", "discounts", 4.5, false, 15),
        createProduct("Xiaomi Mi 14", "Xiaomi Mi 14", "Xiaomi Mi 14", 599.99, "📱", "electronics", "smartphones", "hot-deals", 4.4, false, 20),
        
        // Добавим еще продукты для подкатегории cameras
        createProduct("Canon EOS R5", "Canon EOS R5", "Canon EOS R5", 2499.99, "📷", "electronics", "cameras", "new-arrivals", 4.8, true, 0),
        createProduct("Sony Alpha A7 IV", "Sony Alpha A7 IV", "Sony Alpha A7 IV", 2199.99, "📷", "electronics", "cameras", "recommended", 4.7, false, 5),
        createProduct("Nikon D850", "Nikon D850", "Nikon D850", 1899.99, "📷", "electronics", "cameras", "hot-deals", 4.6, false, 10),
        
        // Добавим продукты для подкатегории accessories
        createProduct("Phone Case", "Чехол для телефона", "Etui na telefon", 29.99, "📱", "electronics", "accessories", "recommended", 4.2, false, 0),
        createProduct("Wireless Charger", "Беспроводное зарядное устройство", "Ładowarka bezprzewodowa", 49.99, "🔌", "electronics", "accessories", "hot-deals", 4.3, false, 15),
        createProduct("Power Bank", "Портативная батарея", "Power bank", 39.99, "🔋", "electronics", "accessories", "discounts", 4.4, false, 25),
        
        // Laptops subcategory
        createProduct("MacBook Pro M3", "MacBook Pro M3", "MacBook Pro M3", 1999.99, "💻", "electronics", "laptops", "new-arrivals", 4.9, true, 0),
        createProduct("Dell XPS 13", "Dell XPS 13", "Dell XPS 13", 1299.99, "💻", "electronics", "laptops", "recommended", 4.6, false, 8),
        createProduct("HP Spectre x360", "HP Spectre x360", "HP Spectre x360", 1199.99, "💻", "electronics", "laptops", "discounts", 4.5, false, 12),
        createProduct("Lenovo ThinkPad X1", "Lenovo ThinkPad X1", "Lenovo ThinkPad X1", 1599.99, "💻", "electronics", "laptops", "hot-deals", 4.7, false, 7),
        createProduct("ASUS ZenBook", "ASUS ZenBook", "ASUS ZenBook", 899.99, "💻", "electronics", "laptops", "recommended", 4.2, false, 10),
                
                // Tablets subcategory
                createProduct("iPad Pro", "iPad Pro", "iPad Pro", 799.99, "📱", "electronics", "tablets", "new-arrivals", 4.7, true, 0),
                createProduct("Samsung Galaxy Tab S9", "Samsung Galaxy Tab S9", "Samsung Galaxy Tab S9", 649.99, "📱", "electronics", "tablets", "recommended", 4.5, false, 0),
                createProduct("Microsoft Surface Pro", "Microsoft Surface Pro", "Microsoft Surface Pro", 899.99, "📱", "electronics", "tablets", "hot-deals", 4.4, false, 12),
                createProduct("Amazon Fire HD", "Amazon Fire HD", "Amazon Fire HD", 149.99, "📱", "electronics", "tablets", "discounts", 4.1, false, 25),
                
                // Headphones subcategory
                createProduct("AirPods Pro", "AirPods Pro", "AirPods Pro", 249.99, "🎧", "electronics", "headphones", "recommended", 4.6, false, 0),
                createProduct("Sony WH-1000XM5", "Sony WH-1000XM5", "Sony WH-1000XM5", 399.99, "🎧", "electronics", "headphones", "new-arrivals", 4.8, true, 0),
                createProduct("Bose QuietComfort", "Bose QuietComfort", "Bose QuietComfort", 329.99, "🎧", "electronics", "headphones", "discounts", 4.5, false, 15),
                createProduct("JBL Live Pro", "JBL Live Pro", "JBL Live Pro", 199.99, "🎧", "electronics", "headphones", "hot-deals", 4.3, false, 20),
                
                // Cameras subcategory
                createProduct("Canon EOS R5", "Canon EOS R5", "Canon EOS R5", 2499.99, "📷", "electronics", "cameras", "new-arrivals", 4.8, true, 0),
                createProduct("Sony Alpha A7 IV", "Sony Alpha A7 IV", "Sony Alpha A7 IV", 2199.99, "📷", "electronics", "cameras", "recommended", 4.7, false, 5),
                createProduct("Nikon D850", "Nikon D850", "Nikon D850", 1899.99, "📷", "electronics", "cameras", "hot-deals", 4.6, false, 10),
                createProduct("Fujifilm X-T5", "Fujifilm X-T5", "Fujifilm X-T5", 1599.99, "📷", "electronics", "cameras", "discounts", 4.5, false, 15),
                createProduct("GoPro Hero 12", "GoPro Hero 12", "GoPro Hero 12", 399.99, "📹", "electronics", "cameras", "hot-deals", 4.4, false, 20),
                
                // Accessories subcategory
                createProduct("Phone Case", "Чехол для телефона", "Etui na telefon", 29.99, "📱", "electronics", "accessories", "recommended", 4.2, false, 0),
                createProduct("Wireless Charger", "Беспроводное зарядное устройство", "Ładowarka bezprzewodowa", 49.99, "🔌", "electronics", "accessories", "hot-deals", 4.3, false, 15),
                createProduct("Phone Stand", "Подставка для телефона", "Stojak na telefon", 19.99, "📱", "electronics", "accessories", "new-arrivals", 4.1, true, 0),
                createProduct("USB Cable", "USB кабель", "Kabel USB", 14.99, "🔌", "electronics", "accessories", "recommended", 4.0, false, 0),
                createProduct("Power Bank", "Портативная батарея", "Power bank", 39.99, "🔋", "electronics", "accessories", "discounts", 4.4, false, 25),
                createProduct("Bluetooth Speaker", "Bluetooth колонка", "Głośnik Bluetooth", 79.99, "🔊", "electronics", "accessories", "hot-deals", 4.5, false, 20),
        
        // FASHION CATEGORY (Одежда)
        // Men's clothing subcategory (Мужская одежда)
        createProduct("Men's Winter Jacket", "Мужская зимняя куртка", "Kurtka zimowa męska", 159.99, "🧥", "fashion", "men", "hot-deals", 4.3, false, 25),
        createProduct("Men's Jeans", "Мужские джинсы", "Jeansy męskie", 79.99, "👖", "fashion", "men", "recommended", 4.2, false, 15),
        createProduct("Men's T-Shirt", "Мужская футболка", "Koszulka męska", 29.99, "👕", "fashion", "men", "recommended", 4.1, false, 0),
        createProduct("Men's Suit", "Мужской костюм", "Garnitur męski", 499.99, "🤵", "fashion", "men", "new-arrivals", 4.5, true, 0),
        createProduct("Men's Sweater", "Мужской свитер", "Sweter męski", 89.99, "🧶", "fashion", "men", "hot-deals", 4.3, false, 20),
        createProduct("Men's Polo Shirt", "Мужское поло", "Polo męskie", 45.99, "👔", "fashion", "men", "recommended", 4.2, false, 0),
        
        // Women's clothing subcategory (Женская одежда)
        createProduct("Women's Dress", "Женское платье", "Sukienka damska", 89.99, "👗", "fashion", "women", "hot-deals", 4.4, false, 30),
        createProduct("Women's Blouse", "Женская блузка", "Bluzka damska", 59.99, "👚", "fashion", "women", "new-arrivals", 4.2, true, 0),
        createProduct("Women's Coat", "Женское пальто", "Płaszcz damski", 249.99, "🧥", "fashion", "women", "hot-deals", 4.4, false, 18),
        createProduct("Women's Skirt", "Женская юбка", "Spódnica damska", 49.99, "👗", "fashion", "women", "recommended", 4.1, false, 0),
        createProduct("Women's Cardigan", "Женский кардиган", "Kardigan damski", 79.99, "🧥", "fashion", "women", "discounts", 4.3, false, 25),
        createProduct("Women's Jeans", "Женские джинсы", "Jeansy damskie", 69.99, "👖", "fashion", "women", "recommended", 4.2, false, 0),
        
        // Kids clothing subcategory (Детская одежда)
        createProduct("Kids T-Shirt", "Детская футболка", "Koszulka dziecięca", 19.99, "👕", "fashion", "kids", "hot-deals", 4.1, false, 25),
        createProduct("Kids Winter Jacket", "Детская зимняя куртка", "Kurtka zimowa dziecięca", 79.99, "🧥", "fashion", "kids", "discounts", 4.2, false, 20),
        createProduct("Kids Dress", "Детское платье", "Sukienka dziecięca", 34.99, "👗", "fashion", "kids", "new-arrivals", 4.3, true, 0),
        createProduct("Kids Pants", "Детские штаны", "Spodnie dziecięce", 29.99, "👖", "fashion", "kids", "recommended", 4.0, false, 0),
        createProduct("Kids Sweater", "Детский свитер", "Sweter dziecięcy", 39.99, "🧶", "fashion", "kids", "hot-deals", 4.2, false, 15),
        createProduct("Kids School Uniform", "Детская школьная форма", "Mundur szkolny dziecięcy", 59.99, "👔", "fashion", "kids", "new-arrivals", 4.1, true, 0),
        
        // Shoes subcategory (Обувь)
        createProduct("Men's Sneakers", "Мужские кроссовки", "Sneakersy męskie", 149.99, "👟", "fashion", "shoes", "new-arrivals", 4.6, true, 0),
        createProduct("Women's High Heels", "Женские туфли", "Buty na obcasie damskie", 119.99, "👠", "fashion", "shoes", "discounts", 4.3, false, 20),
        createProduct("Kids Sneakers", "Детские кроссовки", "Buty dziecięce", 59.99, "👟", "fashion", "shoes", "new-arrivals", 4.3, true, 0),
        createProduct("Men's Dress Shoes", "Мужские классические туфли", "Buty eleganckie męskie", 189.99, "👞", "fashion", "shoes", "recommended", 4.4, false, 0),
        createProduct("Women's Boots", "Женские сапоги", "Kozaki damskie", 159.99, "👢", "fashion", "shoes", "hot-deals", 4.5, false, 15),
        createProduct("Sports Shoes", "Спортивные кроссовки", "Buty sportowe", 129.99, "👟", "fashion", "shoes", "recommended", 4.4, false, 0),
        
        // Bags subcategory (Сумки)
        createProduct("Women's Handbag", "Женская сумка", "Torebka damska", 199.99, "👜", "fashion", "bags", "recommended", 4.5, false, 0),
        createProduct("Kids Backpack", "Детский рюкзак", "Plecak dziecięcy", 39.99, "🎒", "fashion", "bags", "recommended", 4.4, false, 0),
        createProduct("Men's Briefcase", "Мужской портфель", "Teczka męska", 249.99, "💼", "fashion", "bags", "new-arrivals", 4.3, true, 0),
        createProduct("Travel Backpack", "Туристический рюкзак", "Plecak turystyczny", 89.99, "🎒", "fashion", "bags", "hot-deals", 4.4, false, 20),
        createProduct("Women's Wallet", "Женский кошелек", "Portfel damski", 49.99, "👛", "fashion", "bags", "recommended", 4.2, false, 0),
        createProduct("Laptop Bag", "Сумка для ноутбука", "Torba na laptopa", 69.99, "💻", "fashion", "bags", "discounts", 4.3, false, 15),
        
        // Jewelry subcategory (Украшения)
        createProduct("Women's Jewelry", "Женские украшения", "Biżuteria damska", 149.99, "💎", "fashion", "jewelry", "recommended", 4.6, false, 0),
        createProduct("Men's Watch", "Мужские часы", "Zegarek męski", 299.99, "⌚", "fashion", "jewelry", "discounts", 4.4, false, 20),
        createProduct("Gold Necklace", "Золотое ожерелье", "Złoty naszyjnik", 399.99, "📿", "fashion", "jewelry", "new-arrivals", 4.7, true, 0),
        createProduct("Silver Earrings", "Серебряные серьги", "Srebrne kolczyki", 89.99, "💍", "fashion", "jewelry", "hot-deals", 4.3, false, 25),
        createProduct("Diamond Ring", "Бриллиантовое кольцо", "Pierścionek z diamentem", 1299.99, "💍", "fashion", "jewelry", "new-arrivals", 4.8, true, 0),
        createProduct("Pearl Bracelet", "Жемчужный браслет", "Bransoletka z pereł", 199.99, "📿", "fashion", "jewelry", "recommended", 4.5, false, 0),
        
        // BEAUTY CATEGORY (Красота)
        // Makeup subcategory (Макияж)
        createProduct("Foundation", "Тональный крем", "Podkład", 39.99, "💄", "beauty", "makeup", "recommended", 4.4, false, 0),
        createProduct("Lipstick", "Помада", "Szminka", 24.99, "💋", "beauty", "makeup", "hot-deals", 4.3, false, 20),
        createProduct("Mascara", "Тушь для ресниц", "Tusz do rzęs", 19.99, "👁️", "beauty", "makeup", "new-arrivals", 4.5, true, 0),
        createProduct("Eyeshadow Palette", "Палетка теней", "Paleta cieni", 49.99, "🎨", "beauty", "makeup", "recommended", 4.6, false, 0),
        createProduct("Concealer", "Консилер", "Korektor", 29.99, "✨", "beauty", "makeup", "discounts", 4.2, false, 15),
        createProduct("Blush", "Румяна", "Róż", 22.99, "🌸", "beauty", "makeup", "hot-deals", 4.1, false, 25),
        
        // Skincare subcategory (Уход за кожей)
        createProduct("Face Cleanser", "Очищающее средство", "Żel do mycia twarzy", 34.99, "🧴", "beauty", "skincare", "recommended", 4.5, false, 0),
        createProduct("Moisturizer", "Увлажняющий крем", "Krem nawilżający", 44.99, "🧴", "beauty", "skincare", "new-arrivals", 4.6, true, 0),
        createProduct("Serum", "Сыворотка", "Serum", 59.99, "💧", "beauty", "skincare", "hot-deals", 4.7, false, 10),
        createProduct("Sunscreen", "Солнцезащитный крем", "Krem z filtrem", 29.99, "☀️", "beauty", "skincare", "recommended", 4.3, false, 0),
        createProduct("Eye Cream", "Крем для глаз", "Krem pod oczy", 39.99, "👁️", "beauty", "skincare", "discounts", 4.4, false, 20),
        createProduct("Face Mask", "Маска для лица", "Maska do twarzy", 19.99, "😊", "beauty", "skincare", "hot-deals", 4.2, false, 15),
        
        // Haircare subcategory (Уход за волосами)
        createProduct("Shampoo", "Шампунь", "Szampon", 24.99, "🧴", "beauty", "haircare", "recommended", 4.3, false, 0),
        createProduct("Conditioner", "Кондиционер", "Odżywka", 22.99, "🧴", "beauty", "haircare", "recommended", 4.2, false, 0),
        createProduct("Hair Mask", "Маска для волос", "Maska do włosów", 34.99, "💆", "beauty", "haircare", "new-arrivals", 4.5, true, 0),
        createProduct("Hair Oil", "Масло для волос", "Olejek do włosów", 29.99, "💧", "beauty", "haircare", "hot-deals", 4.4, false, 20),
        createProduct("Hair Spray", "Лак для волос", "Lakier do włosów", 16.99, "💨", "beauty", "haircare", "recommended", 4.1, false, 0),
        createProduct("Dry Shampoo", "Сухой шампунь", "Suchy szampon", 18.99, "🌪️", "beauty", "haircare", "discounts", 4.0, false, 25),
        
        // Perfume subcategory (Парфюмерия)
        createProduct("Women's Perfume", "Женские духи", "Perfumy damskie", 89.99, "🌸", "beauty", "perfume", "new-arrivals", 4.6, true, 0),
        createProduct("Men's Cologne", "Мужской одеколон", "Woda kolońska męska", 79.99, "🏔️", "beauty", "perfume", "recommended", 4.5, false, 0),
        createProduct("Body Spray", "Спрей для тела", "Mgiełka do ciała", 24.99, "💨", "beauty", "perfume", "hot-deals", 4.2, false, 30),
        createProduct("Perfume Set", "Набор духов", "Zestaw perfum", 149.99, "🎁", "beauty", "perfume", "new-arrivals", 4.7, true, 0),
        createProduct("Unisex Fragrance", "Унисекс аромат", "Zapach unisex", 69.99, "🌿", "beauty", "perfume", "recommended", 4.3, false, 0),
        createProduct("Travel Size Perfume", "Дорожные духи", "Perfumy podróżne", 39.99, "✈️", "beauty", "perfume", "discounts", 4.1, false, 20),
        
        // HOME CATEGORY
        // Furniture subcategory
        createProduct("Modern Sofa Set", "Современный диван", "Nowoczesny zestaw mebli", 899.99, "🛋️", "home", "furniture", "recommended", 4.2, false, 10),
        createProduct("Dining Table", "Обеденный стол", "Stół jadalny", 599.99, "🪑", "home", "furniture", "hot-deals", 4.4, false, 15),
        createProduct("Wardrobe", "Шкаф", "Szafa", 499.99, "🗄️", "home", "furniture", "discounts", 4.1, false, 25),
        createProduct("Office Chair", "Офисное кресло", "Krzesło biurowe", 299.99, "🪑", "home", "furniture", "new-arrivals", 4.3, true, 0),
        createProduct("Bookshelf", "Книжная полка", "Regał na książki", 179.99, "📚", "home", "furniture", "recommended", 4.0, false, 0),
        createProduct("TV Stand", "Тумба под ТВ", "Szafka RTV", 159.99, "📺", "home", "furniture", "hot-deals", 4.2, false, 12),
                
                // Kitchen subcategory
                createProduct("Coffee Machine", "Кофемашина", "Ekspres do kawy", 299.99, "☕", "home", "kitchen", "new-arrivals", 4.7, true, 0),
                createProduct("Blender", "Блендер", "Blender", 79.99, "🥤", "home", "kitchen", "hot-deals", 4.3, false, 20),
                createProduct("Microwave", "Микроволновка", "Kuchenka mikrofalowa", 149.99, "📡", "home", "kitchen", "recommended", 4.2, false, 5),
                createProduct("Air Fryer", "Аэрогриль", "Frytkownica beztłuszczowa", 129.99, "🍟", "home", "kitchen", "hot-deals", 4.5, false, 15),
                createProduct("Stand Mixer", "Миксер", "Mikser stojący", 249.99, "🥄", "home", "kitchen", "discounts", 4.4, false, 20),
                createProduct("Dishwasher", "Посудомоечная машина", "Zmywarka", 599.99, "🍽️", "home", "kitchen", "new-arrivals", 4.6, true, 0),
                
                // Bathroom subcategory (Ванная)
                createProduct("Shower Head", "Душевая лейка", "Słuchawka prysznicowa", 89.99, "🚿", "home", "bathroom", "new-arrivals", 4.4, true, 0),
                createProduct("Towel Set", "Набор полотенец", "Zestaw ręczników", 49.99, "🛁", "home", "bathroom", "recommended", 4.3, false, 0),
                createProduct("Bathroom Mirror", "Зеркало для ванной", "Lustro łazienkowe", 129.99, "🪞", "home", "bathroom", "hot-deals", 4.2, false, 15),
                createProduct("Toilet Paper Holder", "Держатель для туалетной бумаги", "Uchwyt na papier toaletowy", 29.99, "🧻", "home", "bathroom", "recommended", 4.1, false, 0),
                createProduct("Bathroom Scale", "Весы для ванной", "Waga łazienkowa", 59.99, "⚖️", "home", "bathroom", "discounts", 4.0, false, 20),
                createProduct("Soap Dispenser", "Дозатор для мыла", "Dozownik mydła", 24.99, "🧴", "home", "bathroom", "hot-deals", 4.2, false, 25),
                createProduct("Bath Mat", "Коврик для ванной", "Mata łazienkowa", 34.99, "🛁", "home", "bathroom", "recommended", 4.1, false, 0),
                createProduct("Shower Curtain", "Шторка для душа", "Zasłona prysznicowa", 39.99, "🚿", "home", "bathroom", "new-arrivals", 4.3, true, 0),
                createProduct("Bathroom Cabinet", "Шкафчик для ванной", "Szafka łazienkowa", 199.99, "🗄️", "home", "bathroom", "recommended", 4.4, false, 0),
                createProduct("Toothbrush Holder", "Держатель для зубных щеток", "Uchwyt na szczoteczki", 19.99, "🦷", "home", "bathroom", "hot-deals", 4.0, false, 30),

                // Garden & Tools subcategory (Сад и Инструменты)
                createProduct("Garden Hose", "Садовый шланг", "Wąż ogrodowy", 79.99, "🚿", "home", "garden", "recommended", 4.3, false, 0),
                createProduct("Lawn Mower", "Газонокосилка", "Kosiarka do trawy", 599.99, "🚜", "home", "garden", "new-arrivals", 4.5, true, 0),
                createProduct("Pruning Shears", "Секатор", "Sekator", 39.99, "✂️", "home", "garden", "hot-deals", 4.2, false, 15),
                createProduct("Watering Can", "Лейка", "Konewka", 24.99, "🚰", "home", "garden", "recommended", 4.1, false, 0),
                createProduct("Garden Gloves", "Садовые перчатки", "Rękawice ogrodowe", 19.99, "🧤", "home", "garden", "hot-deals", 4.0, false, 20),
                createProduct("Flower Pots Set", "Набор цветочных горшков", "Zestaw doniczek", 49.99, "🪴", "home", "garden", "recommended", 4.4, false, 0),
                createProduct("Garden Spade", "Садовая лопата", "Łopata ogrodowa", 34.99, "🔨", "home", "garden", "discounts", 4.2, false, 25),
                createProduct("Hedge Trimmer", "Кусторез", "Nożyce do żywopłotu", 199.99, "🔧", "home", "garden", "new-arrivals", 4.6, true, 0),
                createProduct("Garden Fertilizer", "Садовое удобрение", "Nawóz ogrodowy", 29.99, "🌱", "home", "garden", "recommended", 4.3, false, 0),
                createProduct("Wheelbarrow", "Тачка", "Taczka", 149.99, "🛞", "home", "garden", "hot-deals", 4.4, false, 10),
                createProduct("Garden Rake", "Садовые грабли", "Grabie ogrodowe", 27.99, "🔨", "home", "garden", "recommended", 4.1, false, 0),
                createProduct("Plant Seeds Set", "Набор семян растений", "Zestaw nasion roślin", 14.99, "🌱", "home", "garden", "new-arrivals", 4.2, true, 0),
                createProduct("Garden Hoe", "Садовая мотыга", "Motyka ogrodowa", 32.99, "🔨", "home", "garden", "discounts", 4.0, false, 15),
                createProduct("Sprinkler System", "Система полива", "System nawadniania", 299.99, "💧", "home", "garden", "new-arrivals", 4.7, true, 0),
        
        // Decor subcategory
        createProduct("Wall Art Canvas", "Настенное искусство", "Obraz na płótnie", 89.99, "🖼️", "home", "decor", "new-arrivals", 4.1, true, 0),
        createProduct("Modern Table Lamp", "Настольная лампа", "Nowoczesna lampa stołowa", 69.99, "💡", "home", "decor", "recommended", 4.2, false, 0),
        createProduct("Decorative Vase", "Декоративная ваза", "Wazon dekoracyjny", 39.99, "🏺", "home", "decor", "hot-deals", 4.0, false, 30),
        createProduct("Throw Pillows", "Декоративные подушки", "Poduszki dekoracyjne", 24.99, "🛏️", "home", "decor", "discounts", 4.1, false, 25),
        createProduct("Wall Mirror", "Настенное зеркало", "Lustro ścienne", 129.99, "🪞", "home", "decor", "recommended", 4.3, false, 0),
                
                // SPORTS CATEGORY
                // Equipment subcategory (переименуем в Фитнес)
                createProduct("Yoga Mat", "Коврик для йоги", "Mata do jogi", 29.99, "🧘", "sports", "fitness", "recommended", 4.1, false, 0),
                createProduct("Dumbbells Set", "Набор гантелей", "Zestaw hantli", 199.99, "🏋️", "sports", "fitness", "hot-deals", 4.5, false, 15),
                createProduct("Treadmill", "Беговая дорожка", "Bieżnia", 899.99, "🏃", "sports", "fitness", "new-arrivals", 4.3, true, 0),
                createProduct("Exercise Bike", "Велотренажер", "Rower stacjonarny", 699.99, "🚴", "sports", "fitness", "recommended", 4.4, false, 0),
                createProduct("Resistance Bands", "Резинки для фитнеса", "Taśmy oporowe", 39.99, "💪", "sports", "fitness", "hot-deals", 4.2, false, 20),
                createProduct("Kettlebell", "Гиря", "Kettlebell", 79.99, "🏋️", "sports", "fitness", "discounts", 4.3, false, 15),
                createProduct("Pull-up Bar", "Турник", "Drążek do podciągania", 89.99, "💪", "sports", "fitness", "new-arrivals", 4.1, true, 0),
                createProduct("Protein Shaker", "Шейкер для протеина", "Shaker na białko", 24.99, "🥤", "sports", "fitness", "recommended", 4.0, false, 0),

                // Активный отдых subcategory
                createProduct("Bicycle", "Велосипед", "Rower", 599.99, "🚲", "sports", "outdoor", "discounts", 4.6, false, 25),
                createProduct("Camping Tent", "Палатка", "Namiot kempingowy", 249.99, "⛺", "sports", "outdoor", "new-arrivals", 4.4, true, 0),
                createProduct("Hiking Backpack", "Туристический рюкзак", "Plecak turystyczny", 129.99, "🎒", "sports", "outdoor", "recommended", 4.3, false, 0),
                createProduct("Sleeping Bag", "Спальный мешок", "Śpiwór", 89.99, "🛏️", "sports", "outdoor", "hot-deals", 4.2, false, 20),
                createProduct("Camping Stove", "Походная плита", "Kuchenka turystyczna", 79.99, "🔥", "sports", "outdoor", "recommended", 4.1, false, 0),
                createProduct("Thermos", "Термос", "Termos", 49.99, "🍵", "sports", "outdoor", "discounts", 4.0, false, 15),
                createProduct("Compass", "Компас", "Kompas", 34.99, "🧭", "sports", "outdoor", "new-arrivals", 4.2, true, 0),
                createProduct("Headlamp", "Налобный фонарь", "Latarka czołowa", 59.99, "💡", "sports", "outdoor", "hot-deals", 4.3, false, 25),

                // Командные виды subcategory
                createProduct("Basketball", "Баскетбольный мяч", "Piłka do koszykówki", 49.99, "🏀", "sports", "team", "recommended", 4.2, false, 0),
                createProduct("Soccer Ball", "Футбольный мяч", "Piłka nożna", 39.99, "⚽", "sports", "team", "hot-deals", 4.4, false, 15),
                createProduct("Volleyball", "Волейбольный мяч", "Piłka siatkowa", 34.99, "🏐", "sports", "team", "recommended", 4.1, false, 0),
                createProduct("Tennis Racket", "Теннисная ракетка", "Rakieta tenisowa", 129.99, "🎾", "sports", "team", "new-arrivals", 4.4, true, 0),
                createProduct("Badminton Set", "Набор для бадминтона", "Zestaw do badmintona", 89.99, "🏸", "sports", "team", "discounts", 4.3, false, 20),
                createProduct("Hockey Stick", "Хоккейная клюшка", "Kij hokejowy", 159.99, "🏒", "sports", "team", "new-arrivals", 4.5, true, 0),
                createProduct("Rugby Ball", "Мяч для регби", "Piłka rugby", 44.99, "🏉", "sports", "team", "recommended", 4.2, false, 0),
                createProduct("Table Tennis Paddle", "Ракетка для настольного тенниса", "Rakietka do ping-ponga", 29.99, "🏓", "sports", "team", "hot-deals", 4.0, false, 30),

                // Водные виды subcategory
                createProduct("Swimming Goggles", "Очки для плавания", "Okulary pływackie", 24.99, "🥽", "sports", "water", "recommended", 4.2, false, 0),
                createProduct("Swimming Suit", "Купальник", "Strój kąpielowy", 49.99, "🏊", "sports", "water", "recommended", 4.1, false, 0),
                createProduct("Surfboard", "Доска для серфинга", "Deska surfingowa", 899.99, "🏄", "sports", "water", "new-arrivals", 4.6, true, 0),
                createProduct("Diving Mask", "Маска для дайвинга", "Maska do nurkowania", 89.99, "🤿", "sports", "water", "hot-deals", 4.4, false, 15),
                createProduct("Kayak Paddle", "Весло для каяка", "Wiosło do kajaka", 159.99, "🛶", "sports", "water", "recommended", 4.3, false, 0),
                createProduct("Life Jacket", "Спасательный жилет", "Kamizelka ratunkowa", 79.99, "🦺", "sports", "water", "discounts", 4.1, false, 20),
                createProduct("Snorkel Set", "Набор для снорклинга", "Zestaw do snorkelingu", 69.99, "🤿", "sports", "water", "new-arrivals", 4.2, true, 0),
                createProduct("Waterproof Phone Case", "Водонепроницаемый чехол", "Wodoodporne etui na telefon", 19.99, "📱", "sports", "water", "hot-deals", 4.0, false, 25),

                // Clothing subcategory (спортивная одежда)
                createProduct("Running Shoes", "Беговые кроссовки", "Buty do biegania", 159.99, "👟", "sports", "clothing", "recommended", 4.6, false, 10),
                createProduct("Sports T-shirt", "Спортивная футболка", "Koszulka sportowa", 39.99, "👕", "sports", "clothing", "hot-deals", 4.2, false, 25),
                createProduct("Yoga Pants", "Штаны для йоги", "Spodnie do jogi", 69.99, "🩱", "sports", "clothing", "discounts", 4.3, false, 30),
                createProduct("Sports Jacket", "Спортивная куртка", "Kurtka sportowa", 89.99, "🧥", "sports", "clothing", "new-arrivals", 4.4, true, 0),
                createProduct("Fitness Shorts", "Спортивные шорты", "Spodenki sportowe", 34.99, "🩳", "sports", "clothing", "hot-deals", 4.2, false, 20),
                createProduct("Sports Bra", "Спортивный лифчик", "Biustonosz sportowy", 44.99, "👙", "sports", "clothing", "recommended", 4.1, false, 0),

                // BOOKS CATEGORY
                // Fiction subcategory
                createProduct("Mystery Novel", "Детективный роман", "Powieść kryminalna", 14.99, "📚", "books", "fiction", "new-arrivals", 4.3, true, 0),
                createProduct("Science Fiction", "Научная фантастика", "Fantastyka naukowa", 16.99, "📖", "books", "fiction", "recommended", 4.5, false, 0),
                createProduct("Romance Novel", "Романтический роман", "Romans", 12.99, "💕", "books", "fiction", "hot-deals", 4.2, false, 20),
                createProduct("Thriller", "Триллер", "Thriller", 15.99, "😱", "books", "fiction", "discounts", 4.4, false, 15),
                createProduct("Fantasy Adventure", "Фэнтези приключения", "Przygoda fantasy", 18.99, "🗡️", "books", "fiction", "new-arrivals", 4.6, true, 0),
                
                // Non-fiction subcategory
                createProduct("Self-Help Book", "Книга по саморазвитию", "Książka motywacyjna", 19.99, "📖", "books", "non-fiction", "recommended", 4.4, false, 0),
                createProduct("Cookbook", "Поваренная книга", "Książka kucharska", 24.99, "👨‍🍳", "books", "non-fiction", "hot-deals", 4.2, false, 15),
                createProduct("Biography", "Биография", "Biografia", 21.99, "👤", "books", "non-fiction", "new-arrivals", 4.5, true, 0),

                // Education subcategory (Образование)
                createProduct("Programming Guide", "Руководство по программированию", "Przewodnik programowania", 34.99, "💻", "books", "education", "new-arrivals", 4.7, true, 0),
                createProduct("Mathematics Textbook", "Учебник математики", "Podręcznik matematyki", 29.99, "📊", "books", "education", "recommended", 4.5, false, 0),
                createProduct("English Grammar", "Грамматика английского языка", "Gramatyka angielska", 24.99, "📝", "books", "education", "hot-deals", 4.3, false, 15),
                createProduct("Physics Study Guide", "Справочник по физике", "Podręcznik fizyki", 32.99, "🔬", "books", "education", "recommended", 4.4, false, 0),
                createProduct("History Atlas", "Исторический атлас", "Atlas historyczny", 39.99, "🌍", "books", "education", "discounts", 4.2, false, 20),
                createProduct("Chemistry Handbook", "Справочник по химии", "Podręcznik chemii", 28.99, "⚗️", "books", "education", "new-arrivals", 4.6, true, 0),
                createProduct("Art History", "История искусства", "Historia sztuki", 44.99, "🎨", "books", "education", "recommended", 4.3, false, 0),
                createProduct("Language Learning Set", "Набор для изучения языков", "Zestaw do nauki języków", 49.99, "🗣️", "books", "education", "hot-deals", 4.5, false, 10),

                // Children's Books subcategory (Детские книги)
                createProduct("Fairy Tales Collection", "Сборник сказок", "Zbiór bajek", 19.99, "🧚", "books", "children", "recommended", 4.4, false, 0),
                createProduct("Kids Adventure Book", "Детская приключенческая книга", "Książka przygodowa dla dzieci", 16.99, "🚀", "books", "children", "new-arrivals", 4.3, true, 0),
                createProduct("ABC Learning Book", "Букварь", "Książka do nauki alfabetu", 14.99, "🔤", "books", "children", "hot-deals", 4.2, false, 25),
                createProduct("Picture Book Animals", "Книга с картинками про животных", "Książka obrazkowa o zwierzętach", 18.99, "🐾", "books", "children", "recommended", 4.5, false, 0),
                createProduct("Bedtime Stories", "Сказки на ночь", "Bajki na dobranoc", 22.99, "🌙", "books", "children", "discounts", 4.1, false, 15),
                createProduct("Children's Encyclopedia", "Детская энциклопедия", "Encyklopedia dla dzieci", 34.99, "📚", "books", "children", "new-arrivals", 4.6, true, 0),
                createProduct("Coloring Activity Book", "Раскраска", "Kolorowanka", 12.99, "🖍️", "books", "children", "hot-deals", 4.0, false, 30),
                createProduct("Kids Science Fun", "Занимательная наука для детей", "Zabawna nauka dla dzieci", 26.99, "🔬", "books", "children", "recommended", 4.4, false, 0),

                // Business subcategory (Бизнес)
                createProduct("Business Strategy Guide", "Руководство по бизнес-стратегии", "Przewodnik strategii biznesowej", 39.99, "📈", "books", "business", "new-arrivals", 4.6, true, 0),
                createProduct("Marketing Fundamentals", "Основы маркетинга", "Podstawy marketingu", 34.99, "📊", "books", "business", "recommended", 4.5, false, 0),
                createProduct("Financial Management", "Финансовый менеджмент", "Zarządzanie finansami", 42.99, "💰", "books", "business", "hot-deals", 4.4, false, 12),
                createProduct("Leadership Skills", "Навыки лидерства", "Umiejętności przywódcze", 29.99, "👔", "books", "business", "recommended", 4.3, false, 0),
                createProduct("Startup Handbook", "Справочник стартапера", "Poradnik dla startupów", 36.99, "🚀", "books", "business", "discounts", 4.7, false, 18),
                createProduct("Investment Guide", "Руководство по инвестициям", "Przewodnik inwestycyjny", 44.99, "💹", "books", "business", "new-arrivals", 4.5, true, 0),
                createProduct("Project Management", "Управление проектами", "Zarządzanie projektami", 38.99, "📋", "books", "business", "recommended", 4.4, false, 0),
                createProduct("Digital Transformation", "Цифровая трансформация", "Transformacja cyfrowa", 41.99, "💻", "books", "business", "hot-deals", 4.6, false, 15)

    );

    try {
        productRepository.saveAll(products);
        System.out.println("Successfully initialized " + products.size() + " products in MongoDB sklep database");
    } catch (Exception e) {
        System.err.println("Error saving products to MongoDB sklep database: " + e.getMessage());
        throw e;
    }
}

private void initializeUserProfileData() {
        try {
            System.out.println("Initializing user profile data...");
            
            // Создаем тестового пользователя
            User testUser = createTestUser();
            
            // Инициализируем данные профиля для тестового пользователя
            initializeOrdersForUser(testUser);
            initializeReceiptsForUser(testUser);
            initializeReviewsForUser(testUser);
            initializeComplaintsForUser(testUser);
            initializeDiscountsForUser(testUser);
            initializeReturnsForUser(testUser);
            
            System.out.println("Successfully initialized user profile data!");
            
        } catch (Exception e) {
            System.err.println("Error initializing user profile data: " + e.getMessage());
            e.printStackTrace();
        }
    }
      private User createTestUser() {
        // Проверяем, есть ли уже тестовый пользователь
        Optional<User> existingUser = userRepository.findByEmail("test@example.com");
        if (existingUser.isPresent()) {
            System.out.println("Test user already exists, using existing user");
            return existingUser.get();
        }
        
        User testUser = new User();
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("test@example.com");
        testUser.setPassword("$2a$10$N.zmdrJ.oOJQQFPTx4B1Oe"); // password: "password"
        testUser.setPhoneNumber("+1234567890");
        testUser.setRole(UserRole.CUSTOMER);
        testUser.setIsActive(true);
        testUser.setEmailVerified(true);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setProvider("local");
        
        testUser = userRepository.save(testUser);
        System.out.println("Created test user with ID: " + testUser.getId());
        return testUser;
    }
      private void initializeOrdersForUser(User user) {
        List<Order> existingOrders = orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
        if (existingOrders.isEmpty()) {
            List<Order> orders = Arrays.asList(
                createOrder(user, "ORD-2024-001", OrderStatus.DELIVERED, new BigDecimal("299.99"), LocalDateTime.now().minusDays(15)),
                createOrder(user, "ORD-2024-002", OrderStatus.SHIPPED, new BigDecimal("149.50"), LocalDateTime.now().minusDays(3)),
                createOrder(user, "ORD-2024-003", OrderStatus.PENDING, new BigDecimal("89.99"), LocalDateTime.now().minusHours(6))
            );
            orderRepository.saveAll(orders);
            System.out.println("Initialized " + orders.size() + " orders for user");
        }
    }
      private void initializeReceiptsForUser(User user) {
        List<Order> userOrders = orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
        // Для простоты проверим по количеству - если есть заказы но нет чеков, создадим чеки
        if (!userOrders.isEmpty()) {
            // Попробуем найти чеки - если нет, создадим
            try {
                // Создаем чеки только для первых двух заказов
                List<Receipt> receipts = Arrays.asList(
                    createReceipt(user, userOrders.get(0), "RCP-2024-001", new BigDecimal("299.99"), LocalDateTime.now().minusDays(15)),
                    createReceipt(user, userOrders.size() > 1 ? userOrders.get(1) : userOrders.get(0), "RCP-2024-002", new BigDecimal("149.50"), LocalDateTime.now().minusDays(3))
                );
                receiptRepository.saveAll(receipts);
                System.out.println("Initialized " + receipts.size() + " receipts for user");
            } catch (Exception e) {
                System.out.println("Receipts may already exist or error occurred: " + e.getMessage());
            }
        }
    }
      private void initializeReviewsForUser(User user) {
        try {
            List<Review> reviews = Arrays.asList(
                createReview(user, "1", "Wireless Headphones", 5, "Excellent sound quality!", LocalDateTime.now().minusDays(10)),
                createReview(user, "2", "Bluetooth Speaker", 4, "Good battery life", LocalDateTime.now().minusDays(5))
            );
            reviewRepository.saveAll(reviews);
            System.out.println("Initialized " + reviews.size() + " reviews for user");
        } catch (Exception e) {
            System.out.println("Reviews may already exist or error occurred: " + e.getMessage());
        }
    }
    
    private void initializeComplaintsForUser(User user) {
        try {
            List<Complaint> complaints = Arrays.asList(
                createComplaint(user, "Defective product", "Product arrived damaged", ComplaintStatus.OPEN, LocalDateTime.now().minusDays(2)),
                createComplaint(user, "Late delivery", "Package arrived 3 days late", ComplaintStatus.RESOLVED, LocalDateTime.now().minusDays(7))
            );
            complaintRepository.saveAll(complaints);
            System.out.println("Initialized " + complaints.size() + " complaints for user");
        } catch (Exception e) {
            System.out.println("Complaints may already exist or error occurred: " + e.getMessage());
        }
    }
    
    private void initializeDiscountsForUser(User user) {
        try {
            List<UserDiscount> discounts = Arrays.asList(
                createDiscount(user, "SAVE20", "20% off on electronics", DiscountType.PERCENTAGE, new BigDecimal("20"), LocalDateTime.now().plusDays(30)),
                createDiscount(user, "FREESHIP", "Free shipping", DiscountType.FIXED_AMOUNT, new BigDecimal("0"), LocalDateTime.now().plusDays(15)),
                createDiscount(user, "WELCOME10", "Welcome discount", DiscountType.PERCENTAGE, new BigDecimal("10"), LocalDateTime.now().minusDays(5))
            );
            userDiscountRepository.saveAll(discounts);
            System.out.println("Initialized " + discounts.size() + " discounts for user");
        } catch (Exception e) {
            System.out.println("Discounts may already exist or error occurred: " + e.getMessage());
        }
    }
    
    private void initializeReturnsForUser(User user) {
        List<Order> userOrders = orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
        if (!userOrders.isEmpty()) {
            try {
                List<Return> returns = Arrays.asList(
                    createReturn(user, userOrders.get(0), "DEFECTIVE", ReturnStatus.IN_TRANSIT, new BigDecimal("99.99"), LocalDateTime.now().minusDays(3)),
                    createReturn(user, userOrders.size() > 1 ? userOrders.get(1) : userOrders.get(0), "NOT_AS_DESCRIBED", ReturnStatus.COMPLETED, new BigDecimal("79.99"), LocalDateTime.now().minusDays(10))
                );
                returnRepository.saveAll(returns);
                System.out.println("Initialized " + returns.size() + " returns for user");
            } catch (Exception e) {
                System.out.println("Returns may already exist or error occurred: " + e.getMessage());
            }
        }
    }
    
    // Helper methods for creating profile entities
    private Order createOrder(User user, String orderNumber, OrderStatus status, BigDecimal amount, LocalDateTime orderDate) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(orderNumber);
        order.setStatus(status);
        order.setTotalAmount(amount);
        order.setCurrency("USD");
        order.setOrderDate(orderDate);
        order.setShippingAddress("123 Test Street, Test City, TC 12345");
        order.setBillingAddress("123 Test Street, Test City, TC 12345");
        order.setPaymentMethod("Credit Card");
        order.setPaymentStatus("Paid");
        return order;
    }
    
    private Receipt createReceipt(User user, Order order, String receiptNumber, BigDecimal amount, LocalDateTime issuedAt) {
        Receipt receipt = new Receipt();
        receipt.setUser(user);
        receipt.setOrder(order);
        receipt.setReceiptNumber(receiptNumber);
        receipt.setTotalAmount(amount);
        receipt.setTaxAmount(amount.multiply(new BigDecimal("0.08"))); // 8% tax
        receipt.setDiscountAmount(BigDecimal.ZERO);
        receipt.setShippingAmount(new BigDecimal("9.99"));
        receipt.setCurrency("USD");
        receipt.setPaymentMethod("Credit Card");
        receipt.setPaymentTransactionId("TXN-" + receiptNumber);
        receipt.setIssuedAt(issuedAt);
        receipt.setEmailSent(true);
        receipt.setEmailSentAt(issuedAt.plusMinutes(5));
        return receipt;
    }
      private Review createReview(User user, String productId, String productName, Integer rating, String comment, LocalDateTime createdAt) {
        Review review = new Review();
        review.setUser(user);
        review.setProductId(productId);
        review.setProductName(productName);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(createdAt);
        review.setVerified(true);
        return review;
    }
    
    private Complaint createComplaint(User user, String subject, String description, ComplaintStatus status, LocalDateTime createdAt) {
        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setSubject(subject);
        complaint.setDescription(description);
        complaint.setStatus(status);
        complaint.setCreatedAt(createdAt);
        return complaint;
    }
      private UserDiscount createDiscount(User user, String code, String description, DiscountType type, BigDecimal value, LocalDateTime validUntil) {
        UserDiscount discount = new UserDiscount();
        discount.setUser(user);
        discount.setDiscountCode(code);
        discount.setDiscountName(description);
        discount.setType(type);
        discount.setValue(value);
        discount.setValidFrom(LocalDateTime.now().minusDays(1));
        discount.setValidUntil(validUntil);
        discount.setUsed(code.equals("WELCOME10")); // WELCOME10 is already used
        if (discount.isUsed()) {
            discount.setUsedAt(LocalDateTime.now().minusDays(2));
        }
        return discount;
    }
    
    private Return createReturn(User user, Order order, String reasonString, ReturnStatus status, BigDecimal amount, LocalDateTime createdAt) {
        Return returnItem = new Return();
        returnItem.setUser(user);
        returnItem.setOrder(order);
        returnItem.setReturnNumber("RET-" + System.currentTimeMillis());
        // Convert string to ReturnReason enum
        try {
            ReturnReason reason = ReturnReason.valueOf(reasonString);
            returnItem.setReason(reason);
        } catch (IllegalArgumentException e) {
            returnItem.setReason(ReturnReason.OTHER);
        }
        returnItem.setStatus(status);
        returnItem.setRefundAmount(amount);
        returnItem.setRequestedAt(createdAt);
        returnItem.setDescription("Return request for " + reasonString.toLowerCase().replace("_", " "));
        return returnItem;
    }
}

