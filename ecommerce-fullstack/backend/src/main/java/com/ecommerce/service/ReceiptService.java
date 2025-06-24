package com.ecommerce.service;

import com.ecommerce.model.Receipt;
import com.ecommerce.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    public List<Receipt> getUserReceipts(String userId) {
        try {
            System.out.println("Fetching receipts for user: " + userId);
            List<Receipt> receipts = receiptRepository.findByUserIdOrderByIssuedAtDesc(userId);
            System.out.println("Found " + receipts.size() + " receipts in database");
            
            // Return real receipts from database
            return receipts;
        } catch (Exception e) {
            System.err.println("Error fetching receipts from database: " + e.getMessage());
            e.printStackTrace();
            // Return empty list on error
            return new ArrayList<>();
        }
    }

    public Page<Receipt> getUserReceiptsPaginated(String userId, Pageable pageable) {
        return receiptRepository.findByUserIdOrderByIssuedAtDesc(userId, pageable);
    }

    public Optional<Receipt> getReceiptById(String receiptId, String userId) {
        return receiptRepository.findByIdAndUserId(receiptId, userId);
    }

    public Optional<Receipt> getReceiptByOrderId(String orderId, String userId) {
        return receiptRepository.findByOrderIdAndUserId(orderId, userId);
    }

    public Receipt createReceipt(Receipt receipt) {
        receipt.setIssuedAt(LocalDateTime.now());
        return receiptRepository.save(receipt);
    }

    public List<Receipt> getReceiptsByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return receiptRepository.findByUserIdAndIssuedAtBetweenOrderByIssuedAtDesc(userId, startDate, endDate);
    }

    public long countUserReceipts(String userId) {
        return receiptRepository.countByUserId(userId);
    }

    public List<Receipt> getAllReceipts() {
        return receiptRepository.findAllByOrderByIssuedAtDesc();
    }

    public Optional<Receipt> getReceiptByNumber(String receiptNumber) {
        return receiptRepository.findByReceiptNumber(receiptNumber);
    }

    public ResponseEntity<Resource> generateReceiptPdf(String receiptId, String userId) {
        try {
            Optional<Receipt> receiptOpt = receiptRepository.findByIdAndUserId(receiptId, userId);
            if (receiptOpt.isEmpty()) {
                throw new RuntimeException("Receipt not found or access denied");
            }
            
            Receipt receipt = receiptOpt.get();
            
            // Generate HTML content instead of PDF
            String htmlContent = generateReceiptHtml(receipt);
            byte[] htmlBytes = htmlContent.getBytes("UTF-8");
            
            ByteArrayResource resource = new ByteArrayResource(htmlBytes);
            
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"receipt-" + receipt.getReceiptNumber() + ".html\"")
                .body(resource);
                
        } catch (Exception e) {
            throw new RuntimeException("Error generating receipt: " + e.getMessage());
        }
    }
    
    public ResponseEntity<Resource> viewReceiptPdf(String receiptId, String userId) {
        try {
            Optional<Receipt> receiptOpt = receiptRepository.findByIdAndUserId(receiptId, userId);
            if (receiptOpt.isEmpty()) {
                throw new RuntimeException("Receipt not found or access denied");
            }
            
            Receipt receipt = receiptOpt.get();
            
            // Generate HTML content for viewing
            String htmlContent = generateReceiptHtml(receipt);
            byte[] htmlBytes = htmlContent.getBytes("UTF-8");
            
            ByteArrayResource resource = new ByteArrayResource(htmlBytes);
            
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(resource);
                
        } catch (Exception e) {
            throw new RuntimeException("Error viewing receipt: " + e.getMessage());
        }
    }
    
    private String generateReceiptHtml(Receipt receipt) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html><head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<title>Receipt - ").append(receipt.getReceiptNumber()).append("</title>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }");
        html.append(".receipt-info { margin-bottom: 20px; }");
        html.append(".receipt-info p { margin: 5px 0; }");
        html.append(".breakdown { border-top: 1px solid #ccc; padding-top: 15px; }");
        html.append(".breakdown-item { display: flex; justify-content: space-between; margin: 5px 0; }");
        html.append(".total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }");
        html.append("</style>");
        html.append("</head><body>");
        
        // Header
        html.append("<div class='header'>");
        html.append("<h1>RECEIPT</h1>");
        html.append("<h2>").append(receipt.getReceiptNumber()).append("</h2>");
        html.append("</div>");
        
        // Receipt info
        html.append("<div class='receipt-info'>");
        html.append("<p><strong>Date:</strong> ").append(receipt.getIssuedAt().format(formatter)).append("</p>");
        html.append("<p><strong>Transaction ID:</strong> ").append(receipt.getPaymentTransactionId()).append("</p>");
        
        if (receipt.getUser() != null) {
            html.append("<p><strong>Customer:</strong> ").append(receipt.getUser().getFirstName())
                .append(" ").append(receipt.getUser().getLastName()).append("</p>");
            html.append("<p><strong>Email:</strong> ").append(receipt.getUser().getEmail()).append("</p>");
        }
        
        html.append("<p><strong>Payment Method:</strong> ").append(receipt.getPaymentMethod()).append("</p>");
        html.append("</div>");
        
        // Amount breakdown
        html.append("<div class='breakdown'>");
        html.append("<h3>Payment Details</h3>");
        
        if (receipt.getShippingAmount() != null && receipt.getShippingAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
            html.append("<div class='breakdown-item'>");
            html.append("<span>Shipping:</span>");
            html.append("<span>").append(receipt.getCurrency()).append(" ").append(receipt.getShippingAmount()).append("</span>");
            html.append("</div>");
        }
        
        if (receipt.getTaxAmount() != null && receipt.getTaxAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
            html.append("<div class='breakdown-item'>");
            html.append("<span>Tax:</span>");
            html.append("<span>").append(receipt.getCurrency()).append(" ").append(receipt.getTaxAmount()).append("</span>");
            html.append("</div>");
        }
        
        if (receipt.getDiscountAmount() != null && receipt.getDiscountAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
            html.append("<div class='breakdown-item'>");
            html.append("<span>Discount:</span>");
            html.append("<span>-").append(receipt.getCurrency()).append(" ").append(receipt.getDiscountAmount()).append("</span>");
            html.append("</div>");
        }
        
        html.append("<div class='breakdown-item total'>");
        html.append("<span>Total:</span>");
        html.append("<span>").append(receipt.getCurrency()).append(" ").append(receipt.getTotalAmount()).append("</span>");
        html.append("</div>");
        
        html.append("</div>");
        
        html.append("<br><br>");
        html.append("<p style='text-align: center; color: #666;'>Thank you for your purchase!</p>");
        
        html.append("</body></html>");
        
        return html.toString();
    }
}
