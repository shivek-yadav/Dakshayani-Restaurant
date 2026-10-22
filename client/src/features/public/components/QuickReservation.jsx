import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock3, Users, ArrowUpRight } from 'lucide-react';
/** Collects date and guests; backend confirmation happens on /booking. */
export function QuickReservation() {
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('19:00');
    const [guests, setGuests] = useState('2');
    const minDate = () => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
    function submit(e) { e.preventDefault(); navigate(`/booking?${new URLSearchParams({ date, time, guests })}`); }
    return <form className="quick-reservation" onSubmit={submit} aria-label="Quick reservation request">
  <div className="quick-reservation-heading"><span className="quick-icon"><CalendarDays size={20}/></span><div><small>MAKE A MEMORY</small><strong>Your table awaits.</strong></div></div>
  <label><span><CalendarDays size={15}/> Preferred date</span><input type="date" min={minDate()} required value={date} onChange={e => setDate(e.target.value)}/></label>
  <div className="quick-reservation-row"><label><span><Clock3 size={15}/> Time</span><input aria-label="Preferred time" type="time" required value={time} onChange={e => setTime(e.target.value)}/></label><label><span><Users size={15}/> Guests</span><select value={guests} onChange={e => setGuests(e.target.value)}>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>)}</select></label></div>
  <button className="quick-reservation-submit" type="submit">Request a table <ArrowUpRight size={18}/></button><p>Our team confirms each reservation personally.</p>
 </form>;
}
