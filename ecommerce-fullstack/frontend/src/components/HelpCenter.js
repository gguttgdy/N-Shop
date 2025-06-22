import React, { useState } from 'react';
import './HelpCenter.css';

const HelpCenter = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
    consent: false
  });

  const translations = {
    ru: {
      title: 'Центр помощи',
      subtitle: 'Чем мы можем Вам помочь?',
      faq: 'Часто задаваемые вопросы',
      orders: 'Заказы и доставка',
      products: 'Товары',
      insurance: 'Страхование',
      complaints: 'Жалобы и возвраты',
      contact: 'Контакты и салоны',
      other: 'Другое',
      techSupport: 'Техническая поддержка',
      sendQuery: 'Отправьте нам свой запрос',
      respondQuickly: 'Мы ответим как можно быстрее',
      fullName: 'Имя и фамилия',
      email: 'E-mail',
      phone: 'Телефон (необязательно)',
      messageCategory: 'Категория сообщения',
      consent: 'Я согласен на обработку моих персональных данных',
      sendMessage: 'Отправить сообщение'
    },
    en: {
      title: 'Help Center',
      subtitle: 'How can we help you?',
      faq: 'Frequently Asked Questions',
      orders: 'Orders and delivery',
      products: 'Products',
      insurance: 'Insurance',
      complaints: 'Complaints and returns',
      contact: 'Contact and stores',
      other: 'Other',
      techSupport: 'Technical support',
      sendQuery: 'Send us your query',
      respondQuickly: 'We will respond as quickly as possible',
      fullName: 'Full name',
      email: 'E-mail',
      phone: 'Phone (optional)',
      messageCategory: 'Message category',
      consent: 'I agree to the processing of my personal data',
      sendMessage: 'Send message'
    },
    pl: {
      title: 'Centrum pomocy',
      subtitle: 'W czym możemy Ci pomóc?',
      faq: 'Najczęściej zadawane',
      orders: 'Zamówienia i dostawa',
      products: 'Produkty',
      insurance: 'Ubezpieczenia',
      complaints: 'Reklamacje i zwroty',
      contact: 'Kontakt i salony',
      other: 'Inne',
      techSupport: 'Pomoc techniczna',
      sendQuery: 'Wyślij nam swoje zapytanie',
      respondQuickly: 'Odpowiemy najszybciej jak to możliwe',
      fullName: 'Imię i nazwisko',
      email: 'E-mail',
      phone: 'Telefon (opcjonalnie)',
      messageCategory: 'Kategoria wiadomości',
      consent: 'Zgadzam się na przetwarzanie moich danych osobowych przez x‑kom sp. z o.o., z siedzibą w Częstochowie ul. Bojemskiego 25, w celu odpowiedzi na moją wiadomość, drogą telefoniczną lub poprzez e‑mail.*',
      sendMessage: 'Wyślij wiadomość'
    }
  };

  const t = translations[language];

  const categories = [
    { id: 'faq', icon: '❓', name: t.faq },
    { id: 'orders', icon: '📦', name: t.orders },
    { id: 'products', icon: '🛍️', name: t.products },
    { id: 'insurance', icon: '🛡️', name: t.insurance },
    { id: 'complaints', icon: '↩️', name: t.complaints },
    { id: 'contact', icon: '📞', name: t.contact },
    { id: 'other', icon: '💬', name: t.other },
    { id: 'tech', icon: '🔧', name: t.techSupport }
  ];

  const faqQuestions = {
    pl: [
      'Jak możesz oddać zużyty sprzęt elektryczny i elektroniczny, który był używany w gospodarstwie domowym?',
      'Jak mogę sprawdzić status mojego zamówienia?',
      'Gdzie znajdę fakturę?',
      'Na mojej fakturze jest błąd, jak mogę to poprawić?',
      'Czy wybrany przeze mnie towar jest dostępny?',
      'W jakim zakresie jest możliwa modyfikacja sprzętu przed zakupem?',
      'Jak mogę ubezpieczyć towar?',
      'W jaki sposób mogę zgłosić awarię sprzętu?',
      'W jaki sposób mogę zgłosić chęć zwrotu towaru?',
      'Co jest niezbędne do reklamacji?',
      'Jak mogę sprawdzić status mojego zgłoszenia reklamacyjnego?',
      'Otrzymałem z serwisu dokument stwierdzający nienaprawialność sprzętu (NLA) – co dalej?',
      'Do której czynny jest wybrany salon x-kom?'
    ],
    ru: [
      'Как можно сдать использованную электрическую и электронную технику?',
      'Как я могу проверить статус моего заказа?',
      'Где найти счет-фактуру?',
      'В моем счете ошибка, как исправить?',
      'Доступен ли выбранный товар?',
      'Возможна ли модификация товара перед покупкой?',
      'Как застраховать товар?',
      'Как сообщить о поломке?',
      'Как оформить возврат товара?',
      'Что нужно для рекламации?',
      'Как проверить статус рекламации?',
      'Получил документ о неремонтопригодности – что дальше?',
      'До какого времени работает выбранный салон?'
    ],
    en: [
      'How can you dispose of used electrical and electronic equipment?',
      'How can I check the status of my order?',
      'Where can I find my invoice?',
      'There is an error on my invoice, how can I correct it?',
      'Is my selected product available?',
      'Is it possible to modify equipment before purchase?',
      'How can I insure my product?',
      'How can I report equipment failure?',
      'How can I report a return request?',
      'What is needed for a complaint?',
      'How can I check the status of my complaint?',
      'I received a document stating equipment is unrepairable – what next?',
      'What are the opening hours of the selected store?'
    ]
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Здесь можно добавить логику отправки формы
  };

  return (
    <div className="help-center">
      <div className="help-container">
        <div className="help-header">
          <h1>{t.title}</h1>
          <p className="help-subtitle">{t.subtitle}</p>
        </div>

        <div className="help-categories">
          {categories.map(category => (
            <div
              key={category.id}
              className={`help-category ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>

        {selectedCategory === 'faq' && (
          <div className="faq-section">
            <h2>{t.faq}</h2>
            <div className="faq-questions">
              {faqQuestions[language]?.map((question, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question">{question}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="contact-form-section">
          <h2>{t.sendQuery}</h2>
          <p>{t.respondQuickly}</p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder={t.fullName}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder={t.email}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder={t.phone}
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">{t.messageCategory}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Wiadomość..."
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                required
              ></textarea>
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                />
                <span className="checkbox-text">{t.consent}</span>
              </label>
            </div>
            
            <button type="submit" className="submit-btn">
              {t.sendMessage}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
