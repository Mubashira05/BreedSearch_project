import React from "react";

export default function withLoader(Component) {
  return function WithLoaderComponent({ loading, ...props }) {
    if (loading) {
      return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
    }
    return <Component {...props} />;
  };
}
