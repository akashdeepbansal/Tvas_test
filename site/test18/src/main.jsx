const { useEffect, useRef, useState } = React;

const products = [
  { id: 1, name: 'Blur Glow Foundation', brand: 'KAY BEAUTY', price: 799, oldPrice: 999, category: 'Makeup', rating: '4.6', tag: 'BESTSELLER', image: 'https://images.unsplash.com/photo-1631214540553-3040e0cdb9b6?auto=format&fit=crop&w=720&q=85' },
  { id: 2, name: 'Vitamin C Day Serum', brand: 'DOT & KEY', price: 595, oldPrice: 695, category: 'Skincare', rating: '4.5', tag: '20% OFF', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=720&q=85' },
  { id: 3, name: 'Superstay Matte Ink', brand: 'MAYBELLINE NEW YORK', price: 749, oldPrice: 849, category: 'Makeup', rating: '4.7', tag: 'HOT', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=720&q=85' },
  { id: 4, name: 'Rose Water Toner', brand: 'PLUM', price: 325, oldPrice: 399, category: 'Skincare', rating: '4.4', tag: 'FREE GIFT', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=720&q=85' },
  { id: 5, name: 'Moisture Melt Lip Oil', brand: 'LANEIGE', price: 1090, oldPrice: 1290, category: 'Makeup', rating: '4.8', tag: 'NEW', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=720&q=85' },
  { id: 6, name: 'Hair Fall Control Kit', brand: 'BARE ANATOMY', price: 899, oldPrice: 1199, category: 'Hair', rating: '4.3', tag: '25% OFF', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=720&q=85' }
];

const categoryCards = [
  ['Makeup', 'Makeup that makes a statement', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=780&q=85'],
  ['Skincare', 'Care for every kind of skin', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=780&q=85'],
  ['Hair', 'Good hair, good mood', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=780&q=85']
];
const fmt = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const underDevelopment = () => alert('This feature is under development.');

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const modalRef = useRef(null);
  const openerRef = useRef(null);
  const tabs = ['Trending now', 'Under ₹699', 'New at Mira'];

  const visibleProducts = products
    .filter(p => filter === 'All' || p.category === filter)
    .sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0);

  useEffect(() => {
    if (!modalOpen) return;
    const modal = modalRef.current;
    const selectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusables = [...modal.querySelectorAll(selectors)];
    focusables[0]?.focus();
    const onKeydown = e => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const items = [...modal.querySelectorAll(selectors)].filter(el => !el.disabled);
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [modalOpen]);

  const openModal = e => { openerRef.current = e.currentTarget; setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setTimeout(() => openerRef.current?.focus(), 0); };
  const addToCart = p => { setCart([...cart, p]); setCartMessage(`${p.name} added to your bag.`); };
  const toggleWish = id => setWishlist(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  const chooseTab = index => { setActiveTab(index); setFilter(index === 1 ? 'Skincare' : index === 2 ? 'Hair' : 'All'); };
  const tabKeydown = e => {
    const current = Number(e.currentTarget.dataset.index);
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? (current + 1) % tabs.length : e.key === 'ArrowLeft' ? (current + tabs.length - 1) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1;
    chooseTab(next); document.querySelector(`#beauty-tab-${next}`).focus();
  };

  return <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <div className="offer-strip">GET EXTRA 10% OFF ON YOUR FIRST ORDER <button onClick={underDevelopment}>Use code: MIRA10</button></div>
    <header className="site-header">
      <a className="logo" href="#top" aria-label="Mira Beauty home">mira<span>beauty</span></a>
      <nav aria-label="Primary"><ul><li><a href="#shop">Categories</a></li><li><a href="#trending">Brands</a></li><li><a href="#tips">Mira picks</a></li></ul></nav>
      <div className="header-actions"><button onClick={underDevelopment}>Sign in</button><button className="bag" onClick={e => cart.length ? openModal(e) : underDevelopment()} aria-label={`Shopping bag, ${cart.length} items`}>Bag <b>{cart.length}</b></button></div>
    </header>
    <main id="main" tabIndex="-1">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow">THE BEAUTY FESTIVAL</p><h1 id="hero-title">Beauty that<br /><em>feels like you.</em></h1><p>Find your next forever favourite—from fresh-faced essentials to joyfully bold colour.</p><div className="hero-ctas"><a href="#shop" className="button button-dark">Shop the edit</a><button className="button button-light" onClick={underDevelopment}>Take the skin quiz</button></div></div>
        <div className="hero-art"><div className="hero-tag">UP TO<br /><strong>40% OFF</strong><br />ON BEAUTY LOVES</div><img src="https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=90" alt="Model with luminous pink makeup" /></div>
      </section>
      <section className="categories" aria-labelledby="category-title"><div className="section-title"><p className="eyebrow">SHOP YOUR MOOD</p><h2 id="category-title">A little something for every you.</h2></div><div className="category-grid">{categoryCards.map(([name, copy, image]) => <a href="#shop" key={name} onClick={() => setFilter(name)}><img src={image} alt="" loading="lazy" /><span><strong>{name}</strong><small>{copy}</small></span></a>)}</div></section>
      <section className="shop" id="shop" aria-labelledby="shop-title"><div className="shop-heading"><div><p className="eyebrow">OUR MOST-LOVED</p><h2 id="shop-title">Trending for a reason.</h2></div><div className="controls"><label>Sort <select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div></div>
        <div className="filter-row"><span className="filter-label">Filter products:</span>{['All', 'Makeup', 'Skincare', 'Hair'].map(item => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'selected' : ''} aria-pressed={filter === item}>{item}</button>)}</div>
        <p className="result-message" aria-live="polite">Showing {visibleProducts.length} beauty finds{filter !== 'All' ? ` in ${filter}` : ''}.</p>
        <ul className="product-grid">{visibleProducts.map(p => <li key={p.id}><article className="product-card"><div className="product-image"><span>{p.tag}</span><button className="wish" onClick={() => toggleWish(p.id)} aria-label={`Save ${p.name}`} aria-pressed={wishlist.includes(p.id)}>{wishlist.includes(p.id) ? '♥' : '♡'}</button><img src={p.image} alt={`${p.name} by ${p.brand}`} loading="lazy" /></div><div className="product-info"><p>{p.brand}</p><h3>{p.name}</h3><small>★ {p.rating}</small><div><strong>{fmt(p.price)}</strong> <del>{fmt(p.oldPrice)}</del></div><button className="add" onClick={() => addToCart(p)} aria-label={`Add to bag ${p.name}`}>Add to bag</button></div></article></li>)}</ul>
        <p className="sr-status" aria-live="polite">{cartMessage}</p>
      </section>
      <section className="tab-section" id="trending" aria-labelledby="tab-heading"><div><p className="eyebrow">MIRA LOVES</p><h2 id="tab-heading">Beauty, curated for you.</h2></div><div role="tablist" aria-label="Mira beauty edits" className="tabs">{tabs.map((tab, i) => <button key={tab} id={`beauty-tab-${i}`} role="tab" aria-selected={activeTab === i} aria-controls={`beauty-panel-${i}`} tabIndex={activeTab === i ? 0 : -1} data-index={i} onKeyDown={tabKeydown} onClick={() => chooseTab(i)}>{tab}</button>)}</div>{tabs.map((tab, i) => <div key={tab} id={`beauty-panel-${i}`} role="tabpanel" aria-labelledby={`beauty-tab-${i}`} hidden={activeTab !== i} className="tab-panel"><p>{i === 0 ? 'Iconic formulas, endlessly repurchased.' : i === 1 ? 'A seriously good beauty haul without the serious bill.' : 'The brightest arrivals, tested by our beauty desk.'}</p><button onClick={underDevelopment} aria-pressed="false">Explore this edit</button></div>)}</section>
      <section className="tips" id="tips" aria-labelledby="tips-title"><div><p className="eyebrow">BEAUTY DESK</p><h2 id="tips-title">Your questions, answered.</h2></div><div className="accordion"><button aria-expanded={tipsOpen} aria-controls="tips-content" onClick={() => setTipsOpen(!tipsOpen)}>How do I find my foundation shade?<span aria-hidden="true">{tipsOpen ? '−' : '+'}</span></button><div id="tips-content" hidden={!tipsOpen}><p>Start with your undertone, then compare jawline swatches in daylight. Our shade finder can help narrow things down in a few simple questions.</p><button onClick={underDevelopment}>Open shade finder</button></div></div></section>
      <section className="newsletter" aria-labelledby="newsletter-title"><p className="eyebrow">BEAUTY IN YOUR INBOX</p><h2 id="newsletter-title">Your next obsession is waiting.</h2><p>Newness, exclusive offers and our favourite beauty stories—sent with care.</p><form onSubmit={e => { e.preventDefault(); const email = e.currentTarget.email; if (!email.validity.valid) { setEmailMessage('Enter a valid email address to subscribe.'); return; } setEmailMessage(`You’re in! We’ll send beauty news to ${email.value}.`); e.currentTarget.reset(); }} noValidate><label htmlFor="email">Email address</label><div><input id="email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" /><button className="button button-dark" type="submit">Subscribe</button></div></form><p role="status" aria-live="polite">{emailMessage}</p></section>
    </main>
    <footer><a className="logo" href="#top">mira<span>beauty</span></a><div><button onClick={underDevelopment}>Customer care</button><button onClick={underDevelopment}>Delivery & returns</button><button onClick={underDevelopment}>Download app</button></div><p>© 2026 Mira Beauty. Original demo experience.</p></footer>
    {modalOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && closeModal()}><section className="modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={closeModal} aria-label="Close checkout confirmation">×</button><p className="eyebrow">YOUR BAG</p><h2 id="modal-title">Ready to check out?</h2><p>{cart.length} item{cart.length === 1 ? '' : 's'} in your bag. Your total is <strong>{fmt(cart.reduce((sum, p) => sum + p.price, 0))}</strong>.</p><div className="modal-actions"><button className="button button-light" onClick={closeModal}>Keep shopping</button><button className="button button-dark" onClick={() => { closeModal(); underDevelopment(); }}>Continue to checkout</button></div></section></div>}
  </>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
