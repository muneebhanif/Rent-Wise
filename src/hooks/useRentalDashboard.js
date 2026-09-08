import { useCallback, useEffect, useRef, useState } from 'react';
import { getMyListings } from '../Api/ListingApi';
import { GetAggreements } from '../Api/Agreement';
import { fetchAllRenterAggreements } from '../Api/renter';

export default function useRentalDashboard(owner = false) {
  const [data, setData] = useState({ listings: [], agreements: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const active = useRef(false);
  const inFlight = useRef(false);
  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRefreshing(true);
    try {
      const [listingResponse, agreementResponse] = await Promise.all([
        owner ? getMyListings() : Promise.resolve(null),
        owner ? GetAggreements() : fetchAllRenterAggreements(),
      ]);
      if (!active.current) return;
      setData({ listings: listingResponse?.data?.listing || [],
        agreements: owner ? agreementResponse.data?.data || [] : agreementResponse.data?.data?.aggreements || [] });
      setError('');
    } catch (err) {
      if (active.current) setError(err.response?.data?.message || 'We could not refresh your rentals. Please try again.');
    } finally {
      inFlight.current = false;
      if (active.current) { setLoading(false); setRefreshing(false); }
    }
  }, [owner]);
  useEffect(() => {
    active.current = true;
    refresh();
    const timer = window.setInterval(() => { if (!document.hidden) refresh(); }, 30000);
    window.addEventListener('focus', refresh);
    return () => { active.current = false; clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [refresh]);
  return { ...data, loading, refreshing, error, refresh };
}
