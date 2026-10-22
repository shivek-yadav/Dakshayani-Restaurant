import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Leaf, Star, Plus } from 'lucide-react';
import { api, money, photoFallback } from '../api';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
export function useFetch(url, initial = []) {
    const [data, setData] = useState(initial), [loading, setLoading] = useState(true), [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);
    useEffect(() => {
        let live = true;
        setLoading(true);
        api.get(url).then(r => {
            if (live) {
                setData(r.data.data);
                setError('');
            }
        }).catch(e => {
            if (live)
                setError(e.message);
        }).finally(() => {
            if (live)
                setLoading(false);
        });
        return () => { live = false; };
    }, [url, refresh]);
    return { data, loading, error, reload: () => setRefresh(n => n + 1), setData };
}
export function SectionTitle({ eyebrow, title, description, center = false }) { return <div className={`section-heading ${center ? 'center' : ''}`}><div className="eyebrow"><span className="eyebrow-rule"/>{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>; }
export function PageHero({ eyebrow, title, description, image }) { return <section className="page-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(31,12,18,.89),rgba(31,12,18,.57)),url("${image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=85'}")` }}><div className="container"><div className="eyebrow light"><span className="eyebrow-rule"/>{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}<div className="hero-breadcrumb"><Link to="/">Home</Link><span>/</span><span>{title}</span></div></div></section>; }
export function Loading({ label = 'Preparing something lovely...' }) { return <div className="loading-state"><span className="spinner"/>{label}</div>; }
export function ErrorState({ message }) { return <div className="empty-state"><h3>We couldn't load this just yet.</h3><p>{message || 'Please make sure the API and database are running, then refresh.'}</p></div>; }
export function Empty({ title = 'Nothing here yet', text = 'Come back soon for something wonderful.' }) { return <div className="empty-state"><h3>{title}</h3><p>{text}</p></div>; }
export function Status({ value }) { return <span className={`status status-${value}`}>{String(value || 'pending').replaceAll('_', ' ')}</span>; }
export function FoodCard({ item }) { const { addCart } = useApp(); return <article className="food-card"><div className="food-image-wrap"><img loading="lazy" src={item.image || photoFallback} alt={item.name}/><div className="food-tags">{item.vegetarian ? <span className="food-tag veg"><Leaf size={12}/> Veg</span> : <span className="food-tag nonveg">Non-veg</span>}{item.popular && <span className="food-tag best">Bestseller</span>}</div></div><div className="food-body"><div className="food-overline">{item.category?.name || 'House speciality'}</div><h3>{item.name}</h3><p>{item.description}</p><div className="food-bottom"><strong>{money(item.price)}</strong><button className="icon-add" type="button" disabled={!item.available} onClick={() => { addCart(item); toast.success(`${item.name} added to cart`); }} title="Add to cart">{item.available ? <><Plus size={17}/><span>Add</span></> : 'Sold out'}</button></div></div></article>; }
export function GoldButton({ children, to, className = '', ...props }) { return to ? <Link className={`btn btn-gold ${className}`} to={to}>{children}<ArrowUpRight size={17}/></Link> : <button className={`btn btn-gold ${className}`} {...props}>{children}</button>; }
export function OutlineButton({ children, to, className = '', ...props }) { return to ? <Link className={`btn btn-outline ${className}`} to={to}>{children}<ArrowRight size={17}/></Link> : <button className={`btn btn-outline ${className}`} {...props}>{children}</button>; }
export function Stars({ count = 5 }) { return <span className="stars">{Array.from({ length: count }, (_, i) => <Star size={15} fill="currentColor" key={i}/>)}</span>; }
