import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserReviews = ({ language }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = {
    ru: {
      title: 'Мои отзывы',
      noReviews: 'Вы еще не оставляли отзывов',
      product: 'Товар',
      rating: 'Оценка',
      review: 'Отзыв',
      date: 'Дата',
      status: 'Статус',
      edit: 'Редактировать',
      delete: 'Удалить',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки отзывов',
      published: 'Опубликован',
      pending: 'На модерации',
      rejected: 'Отклонен',
      writeReview: 'Написать отзыв'
    },
    en: {
      title: 'My Reviews',
      noReviews: 'You haven\'t written any reviews yet',
      product: 'Product',
      rating: 'Rating',
      review: 'Review',
      date: 'Date',
      status: 'Status',
      edit: 'Edit',
      delete: 'Delete',
      loading: 'Loading...',
      error: 'Error loading reviews',
      published: 'Published',
      pending: 'Pending',
      rejected: 'Rejected',
      writeReview: 'Write Review'
    },
    pl: {
      title: 'Moje opinie',
      noReviews: 'Nie napisałeś jeszcze żadnych opinii',
      product: 'Produkt',
      rating: 'Ocena',
      review: 'Opinia',
      date: 'Data',
      status: 'Status',
      edit: 'Edytuj',
      delete: 'Usuń',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania opinii',
      published: 'Opublikowana',
      pending: 'Oczekuje',
      rejected: 'Odrzucona',
      writeReview: 'Napisz opinię'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchReviews();
  }, [user]);
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.getReviews();
      setReviews(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEditReview = (reviewId) => {
    // Implement edit review logic
    console.log('Editing review:', reviewId);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      // Implement delete review logic
      setReviews(reviews.filter(review => review.id !== reviewId));
      console.log('Deleting review:', reviewId);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="profile-content">
          <h2>{t.title}</h2>
          <div className="loading-message">{t.loading}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-container">
        <div className="profile-content">
          <h2>{t.title}</h2>
          <div className="error-message">{t.error}: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-content">
        <h2>{t.title}</h2>
        
        {reviews.length === 0 ? (
          <div className="no-data-message">
            <p>{t.noReviews}</p>
            <button className="primary-btn">{t.writeReview}</button>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="product-info">
                    <img 
                      src={review.productImage} 
                      alt={review.productName}
                      className="product-thumbnail"
                    />
                    <div className="product-details">
                      <h3 className="product-name">{review.productName}</h3>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="review-meta">
                    <span className="review-date">{review.date}</span>
                    <span className={`status-badge ${review.status}`}>
                      {t[review.status]}
                    </span>
                  </div>
                </div>
                
                <div className="review-content">
                  <p className="review-text">{review.reviewText}</p>
                </div>
                
                <div className="review-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEditReview(review.id)}
                  >
                    {t.edit}
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviews;
