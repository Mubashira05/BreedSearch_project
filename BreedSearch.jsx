import React, { useEffect, useMemo, useRef, useState } from "react";
import withLoader from "./withLoader";
import BreedSearchUI from "./BreedSearchUI";

const API_URL = "https://api.api-ninjas.com/v1/dogs";

function BreedSearch() {
  const [query, setQuery] = useState("");
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [breedInfo, setBreedInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef(null);

  const apiKey = import.meta.env.VITE_API_NINJAS_KEY;

  const setFilteredBreedsSafe = (value) => {
    if (typeof value === "function") {
      setFilteredBreeds((prev) => {
        const next = value(prev);
        return Array.isArray(next) ? next : [];
      });
      return;
    }
    setFilteredBreeds(Array.isArray(value) ? value : []);
  };

  const fetchBreedsByName = async (name) => {
    if (!apiKey) {
      throw new Error(
        "Missing API key. Add VITE_API_NINJAS_KEY to your .env file and restart Vite."
      );
    }

    // Cancel previous request if any
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const url = `${API_URL}?name=${encodeURIComponent(name)}`;

    const res = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`API request failed (${res.status})`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  };

  // Debounced “search as you type”
  const debounceMs = 350;
  const debouncedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    // API Ninjas requires at least one parameter (like name) for /v1/dogs :contentReference[oaicite:2]{index=2}
    if (debouncedQuery.length < 2) {
      setFilteredBreedsSafe([]);
      setBreedInfo(null);
      return;
    }

    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const list = await fetchBreedsByName(debouncedQuery);
        setFilteredBreedsSafe(list);
        setBreedInfo(list[0] ?? null); // show first match details
      } catch (e) {
        if (e?.name !== "AbortError") {
          console.error(e);
          setFilteredBreedsSafe([]);
          setBreedInfo(null);
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleSearch = async () => {
    const q = query.trim();
    if (q.length < 2) return;

    try {
      setLoading(true);
      const list = await fetchBreedsByName(q);
      setFilteredBreedsSafe(list);

      // Prefer exact name match if present
      const exact = list.find(
        (b) => (b?.name ?? "").toLowerCase() === q.toLowerCase()
      );
      setBreedInfo(exact ?? list[0] ?? null);

      if (!exact && list.length === 0) {
        alert("Breed not found.");
      }
    } catch (e) {
      if (e?.name !== "AbortError") {
        console.error(e);
        alert("Search failed. Check your API key / internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BreedSearchUI
      query={query}
      setQuery={setQuery}
      handleSearch={handleSearch}
      filteredBreeds={filteredBreeds}
      breedInfo={breedInfo}
      loading={loading}
    />
  );
}

export default withLoader(BreedSearch);
