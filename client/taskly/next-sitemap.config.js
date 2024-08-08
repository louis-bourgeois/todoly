// next-sitemap.config.js
module.exports = {
  siteUrl: "https://www.todoly.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*"],
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://www.todoly.app/server-sitemap.xml", // optionnel: si vous avez un sitemap serveur supplémentaire
    ],
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  // Fonction pour générer des URLs supplémentaires dynamiquement
  additionalPaths: async (config) => {
    const result = [];
    // Exemple: ajout d'URLs dynamiques
    // result.push({ loc: '/dynamic-page-1', changefreq: 'daily', priority: 0.9 })
    return result;
  },
};
