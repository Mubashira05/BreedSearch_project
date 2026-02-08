import React from "react";
import BreedSearch from "./Components/BreedSearch";
import ErrorBoundary from "./ErrorBoundry";

const App = () => {
  return(
    <div>
      <h1 style={{ textAlign: "center", marginTop: 20 }}>Dog Breed Finder</h1>
      <ErrorBoundary >
         <BreedSearch />
      </ErrorBoundary>
    </div>
  );
};

export default App;
