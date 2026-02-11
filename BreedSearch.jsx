import React, { useEffect, useRef, useState } from "react";
import BreedSearchUI from "./BreedSearchUI";

const LIST_API = "https://api.thedogapi.com/v1/breeds";
const DETAILS_API = "https://api.api-ninjas.com/v1/dogs";
const DOG_CDN = "https://cdn2.thedogapi.com/images/";

export default function BreedSearch() {
  const [query, setQuery] = useState("");
  const [allBreeds, setAllBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [breedInfo, setBreedInfo] = useState(null);
  const [selectedBreedName, setSelectedBreedName] = useState("");

  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  const dogApiKey = import.meta.env.VITE_DOG_API_KEY;
  const ninjasKey = import.meta.env.VITE_API_NINJAS_KEY;

  const abortRef = useRef(null);

  // Load full breed list (with image fallback info)
  useEffect(() => {
    const loadBreeds = async () => {
      try {
        setError("");
        setLoadingList(true);

        const res = await fetch(LIST_API, {
          headers: { "x-api-key": dogApiKey },
        });

        if (!res.ok) throw new Error(`Breed list failed (${res.status})`);

        const data = await res.json();
        const list = Array.isArray(data)
          ? data
              .map((b) => {
                const imageUrl =
                  b?.image?.url ||
                  (b?.reference_image_id ? `${DOG_CDN}${b.reference_image_id}.jpg` : "");

                return {
                  id: b?.id ?? b?.name,
                  name: b?.name ?? "",
                  imageUrl, // <-- store fallback image
                };
              })
              .filter((b) => b.name)
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];

        setAllBreeds(list);
        setFilteredBreeds(list);
      } catch (e) {
        console.error(e);
        setError("Failed to load breed list. Check TheDogAPI key.");
      } finally {
        setLoadingList(false);
      }
    };

    loadBreeds();
  }, [dogApiKey]);

  // Filter locally (startsWith)
  const handleFilter = (value) => {
    setQuery(value);
    const v = value.toLowerCase();

    const filtered = allBreeds.filter((b) =>
      (b.name ?? "").toLowerCase().startsWith(v)
    );

    setFilteredBreeds(filtered);
    setBreedInfo(null);
    setSelectedBreedName("");
  };

  // Fetch details (API Ninjas)
  const fetchDetails = async (breedName) => {
    try {
      setError("");
      setSelectedBreedName(breedName);
      setLoadingDetails(true);

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(
        `${DETAILS_API}?name=${encodeURIComponent(breedName)}`,
        {
          headers: { "X-Api-Key": ninjasKey },
          signal: controller.signal,
        }
      );

      if (!res.ok) throw new Error(`Details failed (${res.status})`);

      const data = await res.json();
      const info = Array.isArray(data) ? data[0] : null;

      setBreedInfo(info ?? null);

      if (!info) {
        setError(`No details found for "${breedName}" from API Ninjas.`);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load breed details.");
      setBreedInfo(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Find fallback image from TheDogAPI list
  const fallbackImage =
    allBreeds.find(
      (b) => (b.name ?? "").toLowerCase() === selectedBreedName.toLowerCase()
    )?.imageUrl || "";

  return (
    <BreedSearchUI
      query={query}
      onInputChange={handleFilter}
      filteredBreeds={filteredBreeds}
      onBreedClick={fetchDetails}
      breedInfo={breedInfo}
      fallbackImage={fallbackImage}
      loading={loadingList || loadingDetails}
      error={error}
    />
  );
}
