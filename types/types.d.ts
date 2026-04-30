interface ApiKey {
  name: string;
  createdAt: string;
}
interface CardItem {
  id: string;
  name: string;
  createdAt: string;
}
interface Project {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  isPublic: boolean;
  publicSlug: string | null;
}
interface UTMStats {
  topSources: { source: string; count: number }[];
  topMediums: { medium: string; count: number }[];
  topCampaigns: { campaign: string; count: number }[];
  topContents: { content: string; count: number }[];
  topTerms: { term: string; count: number }[];
}
interface Analytics {
  totalViews: number;
  viewsPerDay: { date: string; count: number }[];
  topPages: { url: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
  countries: { country: string; count: number }[];
  operatingSystems: { os: string; count: number }[];
  uniqueVisitors: number;
  bounceRate: number;
  entryPages: { url: string; count: number }[];
  timeOnPage: { url: string; avgSeconds: number }[];
  utmStats: UTMStats;
  outboundLinks: { url: string; count: number }[];
  aiTraffic: { referrer: string; count: number }[];
  customEvents: { name: string; count: number; totalRevenue: number | null }[];
}
