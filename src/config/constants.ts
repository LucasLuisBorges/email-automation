export type SiteConfig = typeof siteConfig;

export enum Paths {
  HOME = "/",
  EMAIL = "/v1/email",
}

export const PUBLIC_ROUTES = ["/", "/v1/email"];

export const siteConfig = {
  name: "Automação de Email",
  description: "Automação de email.",
  longDescription: "Projeto utilizando ia para automatizar a criação de emails",
  version: "1.0.0",
  authors: [
    {
      name: "Lucas Borges",
      url: "https://www.linkedin.com/in/lucasluisborges/",
      email: "lucasluisborges1205@gmail.com",
      role: "Full Stack Developer",
    },
  ],
  keywords: [
    "Business Intelligence",
    "Data Visualization",
    "Next.js",
    "React",
    "TypeScript",
  ],
  features: [
    "Multi-project management",
    "Hierarchical panel organization",
    "Role-based access control",
    "Customizable themes and layouts",
    "Integrated ticket system",
    "Real-time notifications",
    "Audit logging",
    "Google OAuth integration",
    "Responsive design",
    "Dark/Light mode support",
  ],
  technologies: {
    frontend: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
    ],
    backend: ["Next.js API Routes"],
    deployment: ["Vercel"],
    tools: ["Bun", "Biome"],
  },
  redirectToPlatform: false,
};
