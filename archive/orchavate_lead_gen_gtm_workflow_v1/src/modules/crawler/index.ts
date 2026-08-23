export interface DiscoveredPage {
  label: string;
  url: string;
}

export const discoverPages = async (websiteUrl: string): Promise<DiscoveredPage[]> => [
  { label: 'homepage', url: websiteUrl },
];
