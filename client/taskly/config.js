const getApiUrl = () => {
  if (typeof window !== "undefined") {
    // Nous sommes côté client
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3001";
    } else {
      // Si nous ne sommes pas sur localhost, utilisez l'IP du réseau
      return "http://192.168.1.100:3001";
    }
  } else {
    // Nous sommes côté serveur, utilisez une valeur par défaut ou une variable d'environnement
    return "http://192.168.1.100:3001";
  }
};

export const config = {
  apiUrl: getApiUrl(),
};
