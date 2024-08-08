// next-sitemap.config.js
module.exports = {
  siteUrl: "https://todoly.app", // Changé pour la version sans www
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://todoly.app/server-sitemap.xml"],
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: "/admin/", // Ajouté pour correspondre à l'exclusion
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

  // Transformer pour s'assurer que toutes les URLs utilisent la version sans www
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
