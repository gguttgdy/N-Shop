import React from 'react';
import './InfoPage.css';

const InfoPage = ({ language, pageType }) => {
  const translations = {    ru: {
      home: 'Главная',
      contactInfo: 'Контактная информация:',
      deliveryMethods: 'Способы доставки:',
      phone: 'Телефон',
      email: 'Email',
      workingHours: 'Время работы',
      onlineChat: 'Онлайн-чат',
      available247: 'круглосуточно',
      availableOnSite: 'доступен на сайте',
      courierDelivery: 'Курьерская доставка - 1-2 дня',
      russiaPost: 'Почта России - 3-7 дней',
      pickupFree: 'Самовывоз из пунктов выдачи - бесплатно',
      expressDelivery: 'Экспресс-доставка - в день заказа',
      about: {
        title: 'О нас',
        content: 'Мы - ведущий интернет-магазин с широким ассортиментом товаров. Наша миссия - предоставить клиентам лучший сервис и качественные товары по доступным ценам.'
      },
      careers: {
        title: 'Карьера',
        content: 'Присоединяйтесь к нашей команде! Мы предлагаем интересные вакансии и возможности для профессионального роста.'
      },
      news: {
        title: 'Новости',
        content: 'Здесь вы найдете последние новости о наших акциях, новых товарах и событиях компании.'
      },
      investors: {
        title: 'Инвесторам',
        content: 'Информация для инвесторов: финансовые отчеты, презентации и корпоративные новости.'
      },
      support: {
        title: 'Служба поддержки',
        content: 'Наша служба поддержки работает круглосуточно. Свяжитесь с нами по телефону 8-800-123-45-67 или email: support@shop.com'
      },
      shipping: {
        title: 'Доставка',
        content: 'Мы доставляем товары по всей стране. Бесплатная доставка при заказе от 2000 рублей.'
      },
      returns: {
        title: 'Возврат товаров',
        content: 'Вы можете вернуть товар в течение 30 дней с момента покупки. Возврат денег в течение 7 рабочих дней.'
      },
      faq: {
        title: 'Частые вопросы',
        content: 'Ответы на самые популярные вопросы наших покупателей.'
      },
      'size-guide': {
        title: 'Таблица размеров',
        content: 'Подробная таблица размеров для одежды и обуви всех брендов.'
      },
      privacy: {
        title: 'Политика конфиденциальности',
        content: 'Мы уважаем вашу конфиденциальность и защищаем ваши персональные данные согласно законодательству.'
      },
      terms: {
        title: 'Условия использования',
        content: 'Правила и условия использования нашего интернет-магазина.'
      },
      cookies: {
        title: 'Использование файлов cookie',
        content: 'Наш сайт использует файлы cookie для улучшения пользовательского опыта.'
      }
    },    en: {
      home: 'Home',
      contactInfo: 'Contact Information:',
      deliveryMethods: 'Delivery Methods:',
      phone: 'Phone',
      email: 'Email',
      workingHours: 'Working Hours',
      onlineChat: 'Online Chat',
      available247: '24/7',
      availableOnSite: 'available on site',
      courierDelivery: 'Courier delivery - 1-2 days',
      standardPost: 'Standard post - 3-7 days',
      pickupFree: 'Pickup from points - free',
      expressDelivery: 'Express delivery - same day',
      about: {
        title: 'About Us',
        content: 'We are a leading online store with a wide range of products. Our mission is to provide customers with the best service and quality products at affordable prices.'
      },
      careers: {
        title: 'Careers',
        content: 'Join our team! We offer interesting vacancies and opportunities for professional growth.'
      },
      news: {
        title: 'News',
        content: 'Here you will find the latest news about our promotions, new products and company events.'
      },
      investors: {
        title: 'Investors',
        content: 'Information for investors: financial reports, presentations and corporate news.'
      },
      support: {
        title: 'Customer Service',
        content: 'Our support service works 24/7. Contact us at 8-800-123-45-67 or email: support@shop.com'
      },
      shipping: {
        title: 'Shipping',
        content: 'We deliver products throughout the country. Free shipping on orders over $30.'
      },
      returns: {
        title: 'Returns',
        content: 'You can return the product within 30 days of purchase. Money back within 7 business days.'
      },
      faq: {
        title: 'FAQ',
        content: 'Answers to the most popular questions from our customers.'
      },
      'size-guide': {
        title: 'Size Guide',
        content: 'Detailed size chart for clothing and shoes of all brands.'
      },
      privacy: {
        title: 'Privacy Policy',
        content: 'We respect your privacy and protect your personal data in accordance with the law.'
      },
      terms: {
        title: 'Terms of Service',
        content: 'Rules and conditions for using our online store.'
      },
      cookies: {
        title: 'Cookie Policy',
        content: 'Our site uses cookies to improve user experience.'
      }
    },    pl: {
      home: 'Strona główna',
      contactInfo: 'Informacje kontaktowe:',
      deliveryMethods: 'Metody dostawy:',
      phone: 'Telefon',
      email: 'Email',
      workingHours: 'Godziny pracy',
      onlineChat: 'Chat online',
      available247: '24/7',
      availableOnSite: 'dostępny na stronie',
      courierDelivery: 'Dostawa kurierska - 1-2 dni',
      standardPost: 'Poczta standardowa - 3-7 dni',
      pickupFree: 'Odbiór z punktów - bezpłatnie',
      expressDelivery: 'Dostawa ekspresowa - tego samego dnia',
      about: {
        title: 'O nas',
        content: 'Jesteśmy wiodącym sklepem internetowym z szerokim asortymentem produktów. Naszą misją jest zapewnienie klientom najlepszej obsługi i wysokiej jakości produktów w przystępnych cenach.'
      },
      careers: {
        title: 'Kariera',
        content: 'Dołącz do naszego zespołu! Oferujemy ciekawe wakaty i możliwości rozwoju zawodowego.'
      },
      news: {
        title: 'Aktualności',
        content: 'Tutaj znajdziesz najnowsze informacje o naszych promocjach, nowych produktach i wydarzeniach firmowych.'
      },
      investors: {
        title: 'Inwestorzy',
        content: 'Informacje dla inwestorów: raporty finansowe, prezentacje i wiadomości korporacyjne.'
      },
      support: {
        title: 'Obsługa klienta',
        content: 'Nasze wsparcie działa 24/7. Skontaktuj się z nami pod numerem 8-800-123-45-67 lub email: support@shop.com'
      },
      shipping: {
        title: 'Dostawa',
        content: 'Dostarczamy produkty w całym kraju. Darmowa dostawa przy zamówieniach powyżej 120 zł.'
      },
      returns: {
        title: 'Zwroty',
        content: 'Możesz zwrócić produkt w ciągu 30 dni od zakupu. Zwrot pieniędzy w ciągu 7 dni roboczych.'
      },
      faq: {
        title: 'FAQ',
        content: 'Odpowiedzi na najpopularniejsze pytania naszych klientów.'
      },
      'size-guide': {
        title: 'Tabela rozmiarów',
        content: 'Szczegółowa tabela rozmiarów odzieży i obuwia wszystkich marek.'
      },
      privacy: {
        title: 'Polityka prywatności',
        content: 'Szanujemy Twoją prywatność i chronimy Twoje dane osobowe zgodnie z prawem.'
      },
      terms: {
        title: 'Regulamin',
        content: 'Zasady i warunki korzystania z naszego sklepu internetowego.'
      },
      cookies: {
        title: 'Polityka cookies',
        content: 'Nasza strona używa plików cookie w celu poprawy doświadczenia użytkownika.'
      }
    }
  };

  const pageData = translations[language][pageType];

  if (!pageData) {
    return (
      <div className="info-page">
        <div className="info-container">
          <h1>Страница не найдена</h1>
          <p>Запрашиваемая страница не существует.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1>{pageData.title}</h1>
          <div className="breadcrumb">
            <span>{translations[language]?.home || 'Home'}</span>
            <span>/</span>
            <span>{pageData.title}</span>
          </div>
        </div>
        
        <div className="info-content">
          <p>{pageData.content}</p>
            {pageType === 'support' && (
            <div className="contact-info">
              <h3>{translations[language].contactInfo}</h3>
              <ul>
                <li>📞 {translations[language].phone}: 8-800-123-45-67</li>
                <li>📧 {translations[language].email}: support@shop.com</li>
                <li>⏰ {translations[language].workingHours}: {translations[language].available247}</li>
                <li>💬 {translations[language].onlineChat}: {translations[language].availableOnSite}</li>
              </ul>
            </div>
          )}
          
          {pageType === 'shipping' && (
            <div className="shipping-info">
              <h3>{translations[language].deliveryMethods}</h3>
              <ul>
                <li>🚚 {translations[language].courierDelivery}</li>
                <li>📮 {language === 'ru' ? translations[language].russiaPost : translations[language].standardPost}</li>
                <li>🏪 {translations[language].pickupFree}</li>
                <li>⚡ {translations[language].expressDelivery}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
