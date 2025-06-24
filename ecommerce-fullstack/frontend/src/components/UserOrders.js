import React, { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import './UserProfile.css';

const UserOrders = ({ language, user, loading: userLoading, currency, formatPrice, convertAndFormatPrice }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const translations = {
    ru: {
      title: 'Мои заказы',
      noOrders: 'У вас пока нет заказов',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки заказов',
      orderId: 'Заказ №',
      date: 'Дата',
      status: 'Статус',
      total: 'Сумма',
      items: 'Товары',
      itemsCount: 'товар(ов)',
      deliveryAddress: 'Адрес доставки',
      statusPending: 'В обработке',
      statusProcessing: 'Обрабатывается',
      statusShipped: 'Отправлен',
      statusDelivered: 'Доставлен',
      statusCancelled: 'Отменен'
    },
    en: {
      title: 'My Orders',
      noOrders: 'You have no orders yet',
      loading: 'Loading...',
      error: 'Error loading orders',
      orderId: 'Order #',
      date: 'Date',
      status: 'Status',
      total: 'Total',
      items: 'Items',
      itemsCount: 'item(s)',
      deliveryAddress: 'Delivery Address',
      statusPending: 'Pending',
      statusProcessing: 'Processing',
      statusShipped: 'Shipped',
      statusDelivered: 'Delivered',
      statusCancelled: 'Cancelled'
    },
    pl: {
      title: 'Moje zamówienia',
      noOrders: 'Nie masz jeszcze żadnych zamówień',
      loading: 'Ładowanie...',
      error: 'Błąd ładowania zamówień',
      orderId: 'Zamówienie #',
      date: 'Data',
      status: 'Status',      total: 'Suma',
      items: 'Produkty',
      itemsCount: 'produkt(ów)',
      deliveryAddress: 'Adres dostawy',
      statusPending: 'Oczekuje',
      statusProcessing: 'Przetwarzane',
      statusShipped: 'Wysłane',
      statusDelivered: 'Dostarczone',
      statusCancelled: 'Anulowane'
    }
  };

  const t = translations[language];

  // Function to get translated status
  const getStatusText = (status) => {
    const statusLower = (status || 'PENDING').toLowerCase();
    switch (statusLower) {
      case 'pending': return t.statusPending;
      case 'processing': return t.statusProcessing;
      case 'shipped': return t.statusShipped;
      case 'delivered': return t.statusDelivered;
      case 'cancelled': return t.statusCancelled;
      default: return t.statusPending;
    }
  };
  // Function to get status icon
  const getStatusIcon = (status) => {
    const statusLower = (status || 'PENDING').toLowerCase();
    switch (statusLower) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };
  // Function to get product icon based on name
  const getProductIcon = (productName) => {
    if (!productName) return '📦';
    
    const name = productName.toLowerCase();
    
    // Electronics & Devices
    if (name.includes('laptop') || name.includes('computer') || name.includes('pc')) return '💻';
    if (name.includes('phone') || name.includes('smartphone') || name.includes('mobile') || name.includes('iphone') || name.includes('android')) return '📱';
    if (name.includes('tablet') || name.includes('ipad')) return '📱';
    if (name.includes('watch') || name.includes('smartwatch') || name.includes('apple watch')) return '⌚';
    if (name.includes('headphone') || name.includes('earphone') || name.includes('airpods') || name.includes('earbuds')) return '🎧';
    if (name.includes('camera') || name.includes('photo')) return '📷';
    if (name.includes('speaker') || name.includes('audio')) return '🔊';
    if (name.includes('keyboard') || name.includes('mouse') || name.includes('mousepad')) return '⌨️';
    if (name.includes('tv') || name.includes('television') || name.includes('monitor') || name.includes('screen')) return '📺';
    if (name.includes('console') || name.includes('playstation') || name.includes('xbox') || name.includes('nintendo')) return '🎮';
    if (name.includes('charger') || name.includes('cable') || name.includes('adapter')) return '🔌';
    
    // Clothing & Fashion
    if (name.includes('shirt') || name.includes('t-shirt') || name.includes('tshirt') || name.includes('blouse')) return '👕';
    if (name.includes('dress') || name.includes('gown')) return '👗';
    if (name.includes('pants') || name.includes('jeans') || name.includes('trousers') || name.includes('shorts')) return '👖';
    if (name.includes('shoe') || name.includes('sneaker') || name.includes('boot') || name.includes('sandal') || name.includes('heel')) return '👟';
    if (name.includes('hat') || name.includes('cap') || name.includes('beanie')) return '🎩';
    if (name.includes('jacket') || name.includes('coat') || name.includes('hoodie') || name.includes('sweater')) return '🧥';
    if (name.includes('bag') || name.includes('purse') || name.includes('backpack') || name.includes('wallet')) return '👜';
    if (name.includes('sock') || name.includes('stocking')) return '🧦';
    if (name.includes('glove') || name.includes('mitten')) return '🧤';
    if (name.includes('scarf') || name.includes('tie')) return '🧣';
    
    // Jewelry & Accessories
    if (name.includes('ring') || name.includes('necklace') || name.includes('bracelet') || name.includes('jewelry')) return '💍';
    if (name.includes('sunglasses') || name.includes('glasses') || name.includes('eyewear')) return '🕶️';
    
    // Books & Media
    if (name.includes('book') || name.includes('novel') || name.includes('magazine') || name.includes('comic')) return '📚';
    if (name.includes('game') || name.includes('gaming') || name.includes('videogame')) return '🎮';
    if (name.includes('movie') || name.includes('dvd') || name.includes('blu-ray') || name.includes('film')) return '🎬';
    if (name.includes('music') || name.includes('cd') || name.includes('vinyl') || name.includes('album')) return '🎵';
    
    // Home & Garden
    if (name.includes('lamp') || name.includes('light') || name.includes('bulb')) return '💡';
    if (name.includes('chair') || name.includes('seat') || name.includes('sofa') || name.includes('couch')) return '🪑';
    if (name.includes('table') || name.includes('desk')) return '🪑';
    if (name.includes('plant') || name.includes('flower') || name.includes('seed') || name.includes('garden')) return '🌱';
    if (name.includes('kitchen') || name.includes('cooking') || name.includes('pan') || name.includes('pot')) return '🍳';
    if (name.includes('bed') || name.includes('pillow') || name.includes('mattress') || name.includes('blanket')) return '🛏️';
    if (name.includes('mirror') || name.includes('frame')) return '🪞';
    if (name.includes('candle') || name.includes('incense')) return '🕯️';
    if (name.includes('clock') || name.includes('timer')) return '🕐';
    
    // Kitchen & Dining
    if (name.includes('cup') || name.includes('mug') || name.includes('glass')) return '☕';
    if (name.includes('plate') || name.includes('bowl') || name.includes('dish')) return '🍽️';
    if (name.includes('knife') || name.includes('fork') || name.includes('spoon') || name.includes('cutlery')) return '🍴';
    if (name.includes('bottle') || name.includes('jar')) return '🍼';
    
    // Sports & Fitness
    if (name.includes('sport') || name.includes('fitness') || name.includes('gym') || name.includes('exercise')) return '⚽';
    if (name.includes('bike') || name.includes('bicycle') || name.includes('cycling')) return '🚴';
    if (name.includes('ball') || name.includes('football') || name.includes('basketball') || name.includes('tennis')) return '⚽';
    if (name.includes('yoga') || name.includes('mat')) return '🧘';
    if (name.includes('weight') || name.includes('dumbbell') || name.includes('barbell')) return '🏋️';
    if (name.includes('swim') || name.includes('pool') || name.includes('water')) return '🏊';
    
    // Beauty & Health
    if (name.includes('perfume') || name.includes('fragrance') || name.includes('cologne')) return '🌸';
    if (name.includes('makeup') || name.includes('cosmetic') || name.includes('lipstick') || name.includes('foundation')) return '💄';
    if (name.includes('cream') || name.includes('lotion') || name.includes('moisturizer') || name.includes('serum')) return '🧴';
    if (name.includes('shampoo') || name.includes('conditioner') || name.includes('soap')) return '🧴';
    if (name.includes('toothbrush') || name.includes('dental') || name.includes('toothpaste')) return '🪥';
    if (name.includes('medicine') || name.includes('vitamin') || name.includes('supplement') || name.includes('pill')) return '💊';
    
    // Food & Beverages
    if (name.includes('coffee') || name.includes('espresso') || name.includes('latte')) return '☕';
    if (name.includes('tea') || name.includes('green tea') || name.includes('herbal')) return '🍵';
    if (name.includes('chocolate') || name.includes('candy') || name.includes('sweet') || name.includes('dessert')) return '🍫';
    if (name.includes('wine') || name.includes('beer') || name.includes('alcohol') || name.includes('champagne')) return '🍷';
    if (name.includes('water') || name.includes('juice') || name.includes('soda') || name.includes('drink')) return '🥤';
    if (name.includes('fruit') || name.includes('apple') || name.includes('banana') || name.includes('orange')) return '🍎';
    if (name.includes('bread') || name.includes('sandwich') || name.includes('bakery')) return '🍞';
    if (name.includes('pizza') || name.includes('pasta') || name.includes('italian')) return '🍕';
    if (name.includes('rice') || name.includes('noodle') || name.includes('asian')) return '🍜';
    
    // Toys & Kids
    if (name.includes('toy') || name.includes('doll') || name.includes('kids') || name.includes('child')) return '🧸';
    if (name.includes('baby') || name.includes('infant') || name.includes('newborn')) return '👶';
    if (name.includes('puzzle') || name.includes('lego') || name.includes('block')) return '🧩';
    if (name.includes('car toy') || name.includes('truck toy') || name.includes('vehicle toy')) return '🚗';
    
    // Automotive
    if (name.includes('car') || name.includes('auto') || name.includes('vehicle')) return '🚗';
    if (name.includes('tire') || name.includes('wheel')) return '🛞';
    if (name.includes('oil') || name.includes('fuel') || name.includes('gas')) return '⛽';
    
    // Office & Stationery
    if (name.includes('pen') || name.includes('pencil') || name.includes('marker')) return '✏️';
    if (name.includes('paper') || name.includes('notebook') || name.includes('journal')) return '📝';
    if (name.includes('calculator') || name.includes('calc')) return '🧮';
    if (name.includes('folder') || name.includes('file') || name.includes('document')) return '📁';
    
    // Tools & Hardware
    if (name.includes('hammer') || name.includes('tool') || name.includes('wrench')) return '🔨';
    if (name.includes('screw') || name.includes('nail') || name.includes('bolt')) return '🔩';
    if (name.includes('battery') || name.includes('power')) return '🔋';
    
    // Travel & Outdoors
    if (name.includes('luggage') || name.includes('suitcase') || name.includes('travel')) return '🧳';
    if (name.includes('tent') || name.includes('camping') || name.includes('outdoor')) return '⛺';
    if (name.includes('umbrella') || name.includes('rain')) return '☂️';
    
    // Art & Craft
    if (name.includes('paint') || name.includes('brush') || name.includes('art')) return '🎨';
    if (name.includes('craft') || name.includes('diy') || name.includes('handmade')) return '🧵';
    
    // Musical Instruments
    if (name.includes('guitar') || name.includes('music instrument')) return '🎸';
    if (name.includes('piano') || name.includes('keyboard instrument')) return '🎹';
    
    // Default fallback based on common patterns
    if (name.includes('digital') || name.includes('electronic') || name.includes('tech')) return '📱';
    if (name.includes('luxury') || name.includes('premium') || name.includes('gold')) return '💎';
    if (name.includes('organic') || name.includes('natural') || name.includes('eco')) return '🌿';
    if (name.includes('vintage') || name.includes('retro') || name.includes('classic')) return '🕰️';
    
    // Default
    return '📦';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders for user:', user);
        setLoading(true);
        const ordersData = await authService.getOrders();
        console.log('Orders received:', ordersData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        console.error('Error details:', err.response?.data);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user to load before trying to fetch orders
    if (!userLoading && user) {
      fetchOrders();
    } else if (!userLoading && !user) {
      console.log('No user found after loading, skipping orders fetch');
      setLoading(false);
    }
  }, [user, userLoading, t.error]);
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
        
        {orders.length === 0 ? (
          <div className="no-data-message">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <p>{t.noOrders}</p>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
              {language === 'ru' ? 'Заказы появятся здесь после оформления покупок' : 
               language === 'en' ? 'Orders will appear here after making purchases' :
               'Zamówienia pojawią się tutaj po dokonaniu zakupów'}
            </p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>📦 {t.orderId}: {order.orderNumber}</h3>
                  <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                    {getStatusIcon(order.status)} {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="order-info">
                    <p><strong>📅 {t.date}:</strong> <span>{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</span></p>
                    <p><strong>💰 {t.total}:</strong> <span>{convertAndFormatPrice ? convertAndFormatPrice(order.totalAmount) : `${order.currency || '$'}${order.totalAmount}`}</span></p>
                    <p><strong>📋 {t.items}:</strong> <span>{order.items?.length || 0} {t.itemsCount}</span></p>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <h4>🛍️ {t.items} ({order.items.length})</h4>
                      <div className="items-grid">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">                            <div className="item-image">
                              <div className="item-placeholder">{getProductIcon(item.productName)}</div>
                            </div>
                            <div className="item-details">
                              <span className="item-name">{item.productName}</span>
                              <div className="item-meta">
                                <span className="item-quantity">×{item.quantity}</span>
                                <span className="item-price">{convertAndFormatPrice ? convertAndFormatPrice(item.price) : `${order.currency || '$'}${item.price}`}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.shippingAddress && (
                    <div className="order-shipping">
                      <p><strong>🚚 {t.deliveryAddress}:</strong> <span>{order.shippingAddress}</span></p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
