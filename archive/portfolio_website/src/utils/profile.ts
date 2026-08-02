// Fetch GitHub profile picture
export async function getGitHubProfilePicture(username: string): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (response.ok) {
      const data = await response.json();
      return data.avatar_url;
    }
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
  }
  return '';
}

// Fetch LinkedIn profile picture (note: LinkedIn may not allow direct API access)
// This is a fallback that works with public profiles
export function getLinkedInProfileURL(linkedInUsername: string): string {
  return `https://www.linkedin.com/in/${linkedInUsername}`;
}

// Get profile image from multiple sources with fallback
export async function getProfilePicture(
  githubUsername: string,
  linkedInUsername?: string
): Promise<string> {
  // Try GitHub first
  if (githubUsername) {
    const githubPic = await getGitHubProfilePicture(githubUsername);
    if (githubPic) return githubPic;
  }
  
  // Fallback to a default or placeholder
  return 'https://via.placeholder.com/200/6366f1/ffffff?text=Profile';
}

// Generate Gravatar URL
export function getGravatarURL(email: string): string {
  const hash = md5(email.toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
}

// Simple MD5 implementation for email hash
function md5(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
