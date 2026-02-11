import React from "react";

function Rating({ label, value }) {
  if (value == null) return null;
  return (
    <p>
      <strong>{label}:</strong> {value}/5
    </p>
  );
}

export default function BreedSearchUI({
  query,
  onInputChange,
  filteredBreeds,
  onBreedClick,
  breedInfo,
  fallbackImage,
  loading,
  error,
}) {
  const list = Array.isArray(filteredBreeds) ? filteredBreeds : [];
  const imageToShow = breedInfo?.image_link || fallbackImage;

  return (
    <div className="breed-wrapper">
      <h1 className="title">Dog Breed Finder</h1>

      {/* Search input */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Type breed name (e.g., Alaskan Husky)"
          value={query}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onBreedClick(query);
          }}
          className="search-box"
        />

        <button className="search-btn" onClick={() => onBreedClick(query)}>
          Search
        </button>
      </div>

      {loading && <h3 style={{ marginTop: 12 }}>Loading...</h3>}
      {error && <p style={{ marginTop: 12, color: "crimson" }}>{error}</p>}

      {/* Breed list */}
      <div className="breed-list" style={{ marginTop: 12 }}>
        <h3>Breeds</h3>

        {list.length === 0 ? (
          <p className="breed-item">No breeds found.</p>
        ) : (
          list.map((breed, idx) => (
            <p
              key={breed?.id ?? breed?.name ?? idx}
              className="breed-item"
              style={{ cursor: "pointer" }}
              onClick={() => onBreedClick(breed.name)}
              title="Click for details"
            >
              {breed.name}
            </p>
          ))
        )}
      </div>

      {/* Details card */}
      {breedInfo && (
        <div className="breed-card" style={{ marginTop: 16 }}>
          <h2>{breedInfo.name}</h2>

          {imageToShow ? (
            <img
              src={imageToShow}
              alt={breedInfo.name}
              style={{ maxWidth: "100%", borderRadius: 12, marginTop: 10 }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <p>
              <em>No image available for this breed.</em>
            </p>
          )}

          <p>
            <strong>Life Expectancy:</strong>{" "}
            {breedInfo.min_life_expectancy ?? "?"}–{breedInfo.max_life_expectancy ?? "?"} years
          </p>

          <p>
            <strong>Height (Male):</strong>{" "}
            {breedInfo.min_height_male ?? "?"}–{breedInfo.max_height_male ?? "?"} in
          </p>

          <p>
            <strong>Weight (Male):</strong>{" "}
            {breedInfo.min_weight_male ?? "?"}–{breedInfo.max_weight_male ?? "?"} lb
          </p>

          <Rating label="Energy" value={breedInfo.energy} />
          <Rating label="Trainability" value={breedInfo.trainability} />
          <Rating label="Protectiveness" value={breedInfo.protectiveness} />
          <Rating label="Barking" value={breedInfo.barking} />
          <Rating label="Shedding" value={breedInfo.shedding} />
          <Rating label="Grooming" value={breedInfo.grooming} />
          <Rating label="Drooling" value={breedInfo.drooling} />
          <Rating label="Playfulness" value={breedInfo.playfulness} />
          <Rating label="Good with Children" value={breedInfo.good_with_children} />
          <Rating label="Good with Other Dogs" value={breedInfo.good_with_other_dogs} />
          <Rating label="Good with Strangers" value={breedInfo.good_with_strangers} />
        </div>
      )}
    </div>
  );
}
