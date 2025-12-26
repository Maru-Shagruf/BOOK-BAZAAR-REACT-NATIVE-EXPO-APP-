import { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';
import { useAuth } from './useAuth';

export function useListings(initialQuery = '/listings?status=available&sort=newest') {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load(q = initialQuery) {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet(q, user);
      setListings(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, user?.id]);

  return { listings, loading, error, reload: load };
}
