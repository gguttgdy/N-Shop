import React from 'react';
import './Footer.css';

const Footer = ({ language, onNavigate }) => {
  const translations = {
    ru: {
      company: 'О компании',
      aboutUs: 'О нас',
      careers: 'Карьера',
      news: 'Новости',
      investors: 'Инвесторам',
      help: 'Помощь',
      customerService: 'Служба поддержки',
      shipping: 'Доставка',
      returns: 'Возврат товаров',
      faq: 'Частые вопросы',
      sizeGuide: 'Таблица размеров',
      categories: 'Категории',
      electronics: 'Электроника',
      clothing: 'Одежда',
      home: 'Дом и сад',
      sports: 'Спорт',
      books: 'Книги',
      beauty: 'Красота',
      connect: 'Связаться с нами',
      newsletter: 'Подпишитесь на новости',
      emailPlaceholder: 'Введите ваш email',
      subscribe: 'Подписаться',
      social: 'Мы в соцсетях',
      rights: 'Все права защищены',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      cookies: 'Использование файлов cookie'
    },
    en: {
      company: 'Company',
      aboutUs: 'About Us',
      careers: 'Careers',
      news: 'News',
      investors: 'Investors',
      help: 'Help',
      customerService: 'Customer Service',
      shipping: 'Shipping',
      returns: 'Returns',
      faq: 'FAQ',
      sizeGuide: 'Size Guide',
      categories: 'Categories',
      electronics: 'Electronics',
      clothing: 'Clothing',
      home: 'Home & Garden',
      sports: 'Sports',
      books: 'Books',
      beauty: 'Beauty',
      connect: 'Connect With Us',
      newsletter: 'Subscribe to Newsletter',
      emailPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
      social: 'Follow Us',
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy'
    },
    pl: {
      company: 'Firma',
      aboutUs: 'O nas',
      careers: 'Kariera',
      news: 'Aktualności',
      investors: 'Inwestorzy',
      help: 'Pomoc',
      customerService: 'Obsługa klienta',
      shipping: 'Dostawa',
      returns: 'Zwroty',
      faq: 'FAQ',
      sizeGuide: 'Tabela rozmiarów',
      categories: 'Kategorie',
      electronics: 'Elektronika',
      clothing: 'Odzież',
      home: 'Dom i ogród',
      sports: 'Sport',
      books: 'Książki',
      beauty: 'Uroda',
      connect: 'Skontaktuj się z nami',
      newsletter: 'Zapisz się do newslettera',
      emailPlaceholder: 'Wpisz swój email',
      subscribe: 'Zapisz się',
      social: 'Śledź nas',
      rights: 'Wszelkie prawa zastrzeżone',
      privacy: 'Polityka prywatności',
      terms: 'Regulamin',
      cookies: 'Polityka cookies'
    }
  };

  const t = translations[language];
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (type, value) => {
    onNavigate(type, value);
  };

  const handleExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3>{t.company}</h3>
            <ul>
              <li><a href="#" onClick={() => handleLinkClick('page', 'about')}>{t.aboutUs}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('page', 'careers')}>{t.careers}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('page', 'news')}>{t.news}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('page', 'investors')}>{t.investors}</a></li>
            </ul>
          </div>

          {/* Help */}
          <div className="footer-section">
            <h3>{t.help}</h3>
            <ul>
              <li><a href="#" onClick={() => handleLinkClick('page', 'support')}>{t.customerService}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('page', 'shipping')}>{t.shipping}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('page', 'returns')}>{t.returns}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('page', 'faq')}>{t.faq}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('page', 'size-guide')}>{t.sizeGuide}</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h3>{t.categories}</h3>
            <ul>
              <li><a href="#" onClick={() => handleLinkClick('category', 'electronics')}>{t.electronics}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('category', 'clothing')}>{t.clothing}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('category', 'home')}>{t.home}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('category', 'sports')}>{t.sports}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('category', 'books')}>{t.books}</a></li>
              <li><a href="#" onClick={() => handleLinkClick('category', 'beauty')}>{t.beauty}</a></li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="footer-section">
            <h3>{t.connect}</h3>
            <div className="newsletter">
              <p>{t.newsletter}</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  {t.subscribe}
                </button>
              </form>
            </div>
            
            <div className="social-links">
              <p>{t.social}</p>
              <div className="social-icons">
                <a 
                  href="#" 
                  onClick={() => handleExternalLink('https://facebook.com')} 
                  className="social-icon facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  onClick={() => handleExternalLink('https://twitter.com')} 
                  className="social-icon twitter"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  onClick={() => handleExternalLink('https://instagram.com')} 
                  className="social-icon instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  onClick={() => handleExternalLink('https://youtube.com')} 
                  className="social-icon youtube"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  onClick={() => handleExternalLink('https://telegram.org')} 
                  className="social-icon telegram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} ShopLogo. {t.rights}</p>
            </div>
            <div className="footer-links">
              <a href="#" onClick={() => handleLinkClick('page', 'privacy')}>{t.privacy}</a>
              <a href="#" onClick={() => handleLinkClick('page', 'terms')}>{t.terms}</a>
              <a href="#" onClick={() => handleLinkClick('page', 'cookies')}>{t.cookies}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
