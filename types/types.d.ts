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
}
interface Analytics {
  totalViews: number;
  viewsPerDay: { date: string; count: number }[];
  topPages: { url: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
  countries: { country: string; count: number }[];
}
