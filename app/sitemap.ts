import { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pulse.velovix.com",
      lastModified: new Date("2026-04-30"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://pulse.velovix.com/pricing",
      lastModified: new Date("2026-04-30"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://pulse.velovix.com/docs",
      lastModified: new Date("2026-04-30"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://pulse.velovix.com/login",
      lastModified: new Date("2026-04-26"),
      changeFrequency: "never",
      priority: 0.3,
    },
    {
      url: "https://pulse.velovix.com/signup",
      lastModified: new Date("2026-04-26"),
      changeFrequency: "never",
      priority: 0.5,
    },
  ];
}
