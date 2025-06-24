import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserReviews = ({ language }) => {
  const { user, loading: userLoading } = useAuth();
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
      remove: 'Удалить',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки отзывов',
      published: 'Опубликован',
      pending: 'На модерации',
      rejected: 'Отклонен',
      writeReview: 'Написать отзыв',
      verified: 'Подтвержденная покупка',
      helpful: 'Полезных голосов',
      title_label: 'Заголовок'
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
      remove: 'Delete',
      loading: 'Loading...',
      error: 'Error loading reviews',
      published: 'Published',
      pending: 'Pending',
      rejected: 'Rejected',
      writeReview: 'Write Review',
      verified: 'Verified Purchase',
      helpful: 'Helpful votes',
      title_label: 'Title'
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
      remove: 'Usuń',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania opinii',
      published: 'Opublikowana',
      pending: 'Oczekuje',
      rejected: 'Odrzucona',
      writeReview: 'Napisz opinię',
      verified: 'Zweryfikowany zakup',
      helpful: 'Pomocnych głosów',
      title_label: 'Tytuł'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await authService.getReviews();
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user to load before trying to fetch reviews
    if (!userLoading && user) {
      fetchReviews();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, t.error]);

  const handleEditReview = (reviewId) => {
    // Implement edit review logic - could open modal or navigate to edit page
    console.log('Editing review:', reviewId);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm(
      language === 'ru' ? 'Вы уверены, что хотите удалить этот отзыв?' :
      language === 'en' ? 'Are you sure you want to delete this review?' :
      'Czy na pewno chcesz usunąć tę opinię?'
    )) {
      try {
        // Here would be API call to delete review
        // await authService.deleteReview(reviewId);
        setReviews(reviews.filter(review => review.id !== reviewId));
      } catch (err) {
        console.error('Error deleting review:', err);
      }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading || userLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>{t.title}</h2>
          <div className="loading-message">{t.loading}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>{t.title}</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>{t.title}</h2>
        
        {reviews.length === 0 ? (
          <div className="no-data-message">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <p>{t.noReviews}</p>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
              {language === 'ru' ? 'Отзывы появятся здесь после написания' : 
               language === 'en' ? 'Reviews will appear here after writing them' :
               'Opinie pojawią się tutaj po ich napisaniu'}
            </p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <h3>📝 {review.title || review.productName}</h3>
                  <span className={`status-badge status-${review.status || 'published'}`}>
                    {getStatusIcon(review.status)} {t[review.status || 'published']}
                  </span>
                </div>
                
                <div className="review-details">
                  <div className="review-info">
                    <p><strong>🛍️ {t.product}:</strong> <span>{review.productName}</span></p>
                    <p><strong>⭐ {t.rating}:</strong> 
                      <span className="review-rating">
                        {renderStars(review.rating)} ({review.rating}/5)
                      </span>
                    </p>
                    <p><strong>📅 {t.date}:</strong> <span>{formatDate(review.createdAt)}</span></p>
                    {review.verified && (
                      <p><strong>✅ {t.verified}</strong></p>
                    )}
                    {review.helpfulVotes > 0 && (
                      <p><strong>👍 {t.helpful}:</strong> <span>{review.helpfulVotes}</span></p>
                    )}
                  </div>

                  {review.comment && (
                    <div className="review-content">
                      <h4>💬 {t.review}</h4>
                      <p className="review-text">{review.comment}</p>
                    </div>
                  )}

                  <div className="review-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditReview(review.id)}
                    >
                      ✏️ {t.edit}
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      🗑️ {t.remove}
                    </button>
                  </div>
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
