export type SkillCategory = string;

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface HeroAction {
  label: string;
  href: string;
  variant?: ButtonVariant;
}

export interface SanityFileAsset {
  _type: "file";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface PersonalInfo {
  _id: string;
  name: string;
  role: string;
  headline: string;
  subheadline?: string;
  email?: string;
  resumeUrl?: string;
  cvFile?: string;
  heroActions?: HeroAction[];
}

export interface Skill {
  _id: string;
  name: string;
  category: SkillCategory;
  iconKey: string;
  order?: number;
}

export interface SanityImageAsset {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface ProjectFeature {
  _key: string;
  category: "store" | "admin";
  title: string;
  items: string[];
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  image?: SanityImageAsset;
  imageUrl?: string;
  screenshotUrl?: string;
  storeUrl?: string;
  adminUrl?: string;
  adminEmail?: string;
  adminPassword?: string;
  techStack: string[];
  features?: ProjectFeature[];
  notes?: string[];
  githubUrl?: string;
  order?: number;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string;
  order?: number;
}

export interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  iconKey: string;
  order?: number;
}

export interface SectionLabels {
  about?: string;
  projects?: string;
  experience?: string;
  contact?: string;
}

export interface ContactSectionContent {
  heading?: string;
  description?: string;
  submitLabel?: string;
  nameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
  successMessage?: string;
  phone?: string;
}

export interface ProjectActionLabels {
  live?: string;
  source?: string;
}

export interface SkillCategoryLabels {
  [key: string]: string | undefined;
}

export interface SiteSettings {
  _id: string;
  siteTitle: string;
  siteDescription: string;
  sectionLabels?: SectionLabels;
  contactSection?: ContactSectionContent;
  projectActionLabels?: ProjectActionLabels;
  skillCategoryLabels?: SkillCategoryLabels;
  experiencePresentLabel?: string;
  footerText?: string;
  projectsHeading?: string;
  projectsDescription?: string;
  experienceHeading?: string;
  experienceDescription?: string;
}

export interface PortfolioData {
  siteSettings: SiteSettings | null;
  personalInfo: PersonalInfo | null;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  socialLinks: SocialLink[];
  categories: Category[];
  about: About | null;
}

export interface Category {
  _id: string;
  name: string;
  order?: number;
}

export interface About {
  _id: string;
  sectionName: string;
  heading: string;
  body: string;
  bio?: string;
  location?: string;
  imageUrl?: string;
  button1Label: string;
  button1Url: string;
  button2Label: string;
  button2Url: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}
