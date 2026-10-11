import type { PortfolioData } from "@/types/cms";
import { getSanityClient } from "./client";
import { isSanityConfigured } from "./env";

export const portfolioQuery = `
{
  "siteSettings": *[_type == "siteSettings"][0]{
    _id,
    siteTitle,
    siteDescription,
    sectionLabels,
    contactSection,
    projectActionLabels,
    skillCategoryLabels,
    experiencePresentLabel,
    footerText,
    projectsHeading,
    projectsDescription,
    experienceHeading,
    experienceDescription
  },
  "personalInfo": *[_type == "personalInfo"][0]{
    _id,
    name,
    role,
    headline,
    subheadline,
    email,
    resumeUrl,
    heroActions,
    cvFile
  },
  "skills": *[_type == "skill"] | order(order asc, name asc){
    _id,
    name,
    category,
    iconKey,
    order
  },
  "projects": *[_type == "project"] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    image,
    imageUrl,
    screenshotUrl,
    techStack,
    "storeUrl": storeUrl,
    adminUrl,
    githubUrl,
    order
  },
  "experience": *[_type == "experience"] | order(order asc, startDate desc){
    _id,
    company,
    role,
    startDate,
    endDate,
    isCurrent,
    description,
    order
  },
  "socialLinks": *[_type == "socialLink"] | order(order asc, platform asc){
    _id,
    platform,
    url,
    iconKey,
    order
  },
  "categories": *[_type == "category"] | order(order asc){
    _id,
    name,
    order
  },
  "about": *[_type == "about"][0]{
    _id,
    sectionName,
    heading,
    body,
    bio,
    location,
    imageUrl,
    button1Label,
    button1Url,
    button2Label,
    button2Url
  }
}
`;

export async function getPortfolioData(): Promise<PortfolioData | null> {
  if (!isSanityConfigured()) {
    return null;
  }

  const client = getSanityClient();
  if (!client) {
    return null;
  }

  return client.fetch<PortfolioData>(portfolioQuery);
}
