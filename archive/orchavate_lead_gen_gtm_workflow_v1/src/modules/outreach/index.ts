export interface OutreachArtifact {
  companyName: string;
  websiteUrl: string;
  message: string;
}

export const createOutreachArtifact = async (
  companyName: string,
  websiteUrl: string,
): Promise<OutreachArtifact> => ({
  companyName,
  websiteUrl,
  message: `Accessibility assessment requested for ${companyName}`,
});
