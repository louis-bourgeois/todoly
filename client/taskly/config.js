const getApiUrl = () => {
  if (typeof window !== "undefined") {
    // Nous sommes côté client
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3001";
    } else {
      // Si nous sommes sur l'IP locale ou l'IP du VPS
      return `http://89.116.111.43:3001`;
    }
  } else {
    // Nous sommes côté serveur, utilisez l'IP du VPS
    return "http://89.116.111.43:3001";
  }
};

export const config = {
  apiUrl: getApiUrl(),
};
