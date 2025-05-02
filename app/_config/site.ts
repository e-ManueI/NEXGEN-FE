export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "NexGen AI",
  shortName: "NexGen",
  description:
    "Advanced material analysis and reporting powered by cutting-edge AI technology",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  links: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com",
  },
  communication: {
    address: "",
    supportEmail: "info@nexgen.ai",
    phone: "",
    website: "www.nexgen.ai",
  },
};
