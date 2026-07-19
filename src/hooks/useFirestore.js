import { useState, useEffect } from "react";
import { getCollection } from "../lib/firebase";

export function useFirestore(collectionName, fallback = [], orderByField = "createdAt") {
  const [data, setData]       = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCollection(collectionName, orderByField)
      .then(docs => {
        if (cancelled) return;
        setData(docs.length ? docs : fallback);
      })
      .catch(err => {
        if (cancelled) return;
        console.warn(`[Firestore] ${collectionName}:`, err.message);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [collectionName]);

  return { data, loading, error };
}
