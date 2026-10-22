import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChefHat, HeartHandshake, Leaf, Quote, Sparkles } from 'lucide-react';
import { useFetch, SectionTitle, Loading, ErrorState, FoodCard, GoldButton, OutlineButton, Stars } from '../../../components/UI';
import { QuickReservation } from '../components/QuickReservation';
const photography = {
    dining: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85',
    atmosphere: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1300&q=85',
    kitchen: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=85',
    feast: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=85',
    spice: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=85',
};
const values = [
    { Icon: ChefHat, title: 'Slow-crafted recipes', description: 'Time-honoured Indian flavours, made with patience.' },
    { Icon: Leaf, title: 'Thoughtful ingredients', description: 'Freshness and quality in every bite.' },
    { Icon: HeartHandshake, title: 'Heartfelt hospitality', description: 'Make yourself at home, every time.' },
];
function FeatureHighlights() {
    return <div className="new-values-bar"><div className="container new-values-inner">
    {values.map(({ Icon, title, description }) => <div className="new-value" key={title}><span><Icon size={22} strokeWidth={1.6}/></span><div><strong>{title}</strong><small>{description}</small></div></div>)}
  </div></div>;
}
function EditorialCards() {
    const cards = [
        { label: '01 / THE KITCHEN', title: 'Flavours that stay with you', description: 'Discover dishes worth gathering around.', image: photography.feast, to: '/menu', button: 'Explore the menu' },
        { label: '02 / OUR STORY', title: 'Made with heart, served with pride', description: 'A story that begins around the table.', image: photography.kitchen, to: '/about', button: 'Meet Dakshayani' },
    ];
    return <section className="section new-editorial-section"><div className="container">
    <div className="new-editorial-heading"><SectionTitle eyebrow="WELCOME TO DAKSHAYANI" title={<>More than a meal. <em>A feeling.</em></>} description="A little tradition, a generous helping of flavour, and the kind of hospitality that makes every visit feel like coming home."/><div className="editorial-mark">D<span>✦</span></div></div>
    <div className="new-editorial-grid">{cards.map(card => <Link className="new-editorial-card" to={card.to} key={card.label}><img src={card.image} alt={card.title} loading="lazy"/><span className="new-editorial-overlay"/><div className="new-editorial-card-copy"><small>{card.label}</small><h3>{card.title}</h3><p>{card.description}</p><span>{card.button} <ArrowUpRight size={17}/></span></div></Link>)}</div>
  </div></section>;
}
function ExperienceSection({ gallery }) {
    const selected = gallery.slice(0, 3);
    return <section className="section new-experience-section"><div className="container new-experience-grid">
    <div className="new-experience-copy"><div className="eyebrow"><span className="eyebrow-rule"/>AN INVITATION TO SLOW DOWN</div><h2>An evening worth <em>remembering.</em></h2><p>Rich aromas, good conversations, warm lights and a plate full of memories. There is always something special happening around a Dakshayani table.</p><div className="new-experience-signature">Thoughtfully prepared. Beautifully shared.</div><GoldButton to="/gallery">Explore our gallery</GoldButton></div>
    <div className="new-experience-photos"><img className="experience-main" src={selected[0]?.url || photography.atmosphere} alt={selected[0]?.title || 'Restaurant dining room'} loading="lazy"/><img className="experience-offset" src={selected[1]?.url || photography.spice} alt={selected[1]?.title || 'Indian culinary speciality'} loading="lazy"/><div className="experience-stamp"><Sparkles size={23}/><strong>THE ART OF</strong><span>gathering</span></div></div>
  </div></section>;
}
function FaqPreview({ faqs }) {
    return <section className="section new-faq-section"><div className="container new-faq-layout"><div><SectionTitle eyebrow="GOOD TO KNOW" title={<>A little more <em>about us.</em></>} description="Answers to the things our guests ask most often."/><OutlineButton to="/contact">Ask us anything</OutlineButton></div><div className="faq-list">{faqs.slice(0, 5).map((faq, index) => <details key={faq._id || index}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>;
}
export function Home() {
    const { data: menu, loading, error } = useFetch('/menu?featured=true');
    const { data: gallery } = useFetch('/gallery');
    const { data: reviews } = useFetch('/testimonials');
    const { data: faqs } = useFetch('/faqs');
    const { data: content } = useFetch('/pages/home', {});
    return <>
    <section className="new-home-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(23,9,14,.91) 0%,rgba(35,12,22,.77) 50%,rgba(25,9,15,.46) 100%),url('${content.heroImage || photography.dining}')` }}>
      <div className="container new-hero-grid">
        <div className="new-hero-copy">
          <div className="new-hero-kicker"><span className="new-hero-kicker-line"/>THE ART OF INDIAN DINING <span>✦</span> FROM OUR HEART</div>
          <h1>{content.title || 'A little tradition.'}<br /><em>{content.subtitle || 'A lot of love.'}</em></h1>
          <p>{content.description || 'Gather around for soulful Indian flavours, unforgettable evenings and hospitality that feels like home.'}</p>
          <div className="new-hero-actions"><Link className="btn new-btn-gold" to="/menu">Explore our menu <ArrowUpRight size={18}/></Link><Link className="new-hero-secondary" to="/about">Discover our story <ArrowRight size={17}/></Link></div>
          <div className="new-hero-footnote"><span>✳</span> AN EXPERIENCE MADE TO BE SHARED</div>
        </div>
        <QuickReservation />
      </div>
      <div className="new-hero-bottom"><div className="container"><span>GOOD FOOD / GREAT COMPANY / BEAUTIFUL MEMORIES</span><span>SCROLL TO EXPLORE <span>↓</span></span></div></div>
    </section>
    <FeatureHighlights />
    <EditorialCards />
    <section className="section new-menu-section"><div className="container">
      <div className="section-heading-row"><SectionTitle eyebrow="A TASTE OF DAKSHAYANI" title={<>Our most-loved <em>creations.</em></>} description="From the comforting classics to dishes with a little unexpected magic — made for every mood and every table."/><Link to="/menu" className="new-text-link">Discover all dishes <ArrowUpRight size={17}/></Link></div>
      {loading ? <Loading /> : error ? <ErrorState message={error}/> : menu.length ? <div className="food-grid">{menu.slice(0, 4).map(item => <FoodCard key={item._id} item={item}/>)}</div> : <p>Our chef is preparing the menu. Check back soon.</p>}
      <div className="new-menu-footer"><span><span className="new-sparkle">✦</span> Carefully prepared, joyfully shared</span><Link to="/menu">View our entire menu <ArrowRight size={16}/></Link></div>
    </div></section>
    <ExperienceSection gallery={gallery}/>
    <section className="new-quote-section" style={{ backgroundImage: `linear-gradient(90deg,rgba(35,10,19,.94),rgba(35,10,19,.83)),url('${photography.feast}')` }}><div className="container"><Quote size={34}/><p>Good food has a way of turning ordinary moments into cherished memories.</p><span>THE DAKSHAYANI PROMISE</span><GoldButton to="/booking">Let's make a memory</GoldButton></div></section>
    {reviews.length > 0 && <section className="section new-reviews-section"><div className="container"><SectionTitle eyebrow="WORDS FROM OUR GUESTS" title={<>Heartfelt moments, <em>shared.</em></>} center/><div className="review-grid">{reviews.slice(0, 3).map(review => <article className="review-card" key={review._id}><Stars count={review.rating}/><p>“{review.quote}”</p><div className="review-person"><span className="review-avatar">{review.name?.charAt(0)}</span><strong>{review.name}</strong><small>Guest review</small></div></article>)}</div></div></section>}
    {faqs.length > 0 && <FaqPreview faqs={faqs}/>}
    <section className="new-end-cta"><div className="container new-end-cta-content"><div><div className="eyebrow light">A PLACE AT OUR TABLE</div><h2>Every gathering deserves <em>something special.</em></h2><p>Come hungry. Leave with a story worth telling.</p></div><GoldButton to="/booking">Request a reservation</GoldButton></div></section>
  </>;
}
