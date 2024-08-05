const getApiUrl = () => {
  if (typeof window !== "undefined") {
    // Nous sommes côté client
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3001";
    } else if (hostname === "192.168.1.100" || hostname === "89.116.111.43") {
      // Si nous sommes sur l'IP locale ou l'IP du VPS
      return `http://${hostname}:3001`;
    } else {
      // Pour tout autre cas, utilisez l'IP du VPS
      return "http://89.116.111.43:3001";
    }
  } else {
    // Nous sommes côté serveur, utilisez l'IP du VPS
    return "http://89.116.111.43:3001";
  }
};

export const config = {
  apiUrl: getApiUrl(),
};
