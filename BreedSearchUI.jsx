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
  setQuery,
  handleSearch,
  breedInfo,
  filteredBreeds,
}) {
  const listToRender = Array.isArray(filteredBreeds) ? filteredBreeds : [];

  return (
    <div className="breed-wrapper">
      <h1 className="title">Dog Breed Search</h1>

      <input
        type="text"
        placeholder="Type at least 2 letters (e.g., husky, retriever)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        className="search-box"
      />

      <button onClick={handleSearch} className="search-btn">
        Search
      </button>

      <div className="breed-list">
        <h3>Matches</h3>

        {listToRender.length === 0 ? (
          <p className="breed-item">No results yet. Start typing above.</p>
        ) : (
          listToRender.map((breed, idx) => (
            <p
              key={`${breed?.name ?? "breed"}-${idx}`}
              className="breed-item"
              onClick={() => setQuery(breed?.name ?? "")}
              title="Click to search this breed"
            >
              {breed?.name ?? "Unknown Breed"}
            </p>
          ))
        )}
      </div>

      {breedInfo && (
        <div className="breed-card">
          <h2>{breedInfo.name}</h2>

          {breedInfo.image_link && (
            <img
              src={breedInfo.image_link}
              alt={breedInfo.name}
              style={{ maxWidth: "100%", borderRadius: 12, marginTop: 10 }}
            />
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
