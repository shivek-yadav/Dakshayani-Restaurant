import { createContext, useContext, useEffect, useState } from 'react';
import { api, initialSettings } from '../api';
const AppContext = createContext(null);
const getStoredCart = () => {
    try {
        return JSON.parse(localStorage.getItem('dakshayani_cart')) || [];
    }
    catch {
        return [];
    }
};
export function AppProvider({ children }) {
    const [user, setUser] = useState(null), [authLoading, setAuthLoading] = useState(true), [settings, setSettings] = useState(initialSettings), [cart, setCart] = useState(getStoredCart);
    useEffect(() => { api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => { }).finally(() => setAuthLoading(false)); api.get('/settings/public').then(r => setSettings(x => ({ ...x, ...r.data.data }))).catch(() => { }); }, []);
    useEffect(() => { localStorage.setItem('dakshayani_cart', JSON.stringify(cart)); }, [cart]);
    const addCart = (item) => {
        if (!item.available)
            return;
        setCart(c => { const old = c.find(x => x.id === item._id); return old ? c.map(x => x.id === item._id ? { ...x, quantity: Math.min(20, x.quantity + 1) } : x) : [...c, { id: item._id, name: item.name, price: item.price, image: item.image, quantity: 1 }]; });
    };
    const changeQty = (id, quantity) => setCart(c => quantity <= 0 ? c.filter(x => x.id !== id) : c.map(x => x.id === id ? { ...x, quantity: Math.min(20, quantity) } : x));
    const clearCart = () => setCart([]);
    const login = async (data, isAdmin = false) => { const result = await api.post(isAdmin ? '/admin/auth/login' : '/auth/login', data); setUser(result.data.user); return result.data.user; };
    const register = async (data) => { const result = await api.post('/auth/register', data); setUser(result.data.user); return result.data.user; };
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        }
        finally {
            setUser(null);
        }
    };
    const cartCount = cart.reduce((a, x) => a + x.quantity, 0), cartTotal = cart.reduce((a, x) => a + x.price * x.quantity, 0);
    return <AppContext.Provider value={{ user, setUser, authLoading, settings, setSettings, cart, addCart, changeQty, clearCart, cartCount, cartTotal, login, register, logout }}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
