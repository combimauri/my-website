import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://combimauri.com", // replace this with your deployed domain
  author: "Mauricio Arce",
  desc: "Combimauri's blog",
  title: "Combimauri",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 7,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/combimauri",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/combimauri",
    linkTitle: `${SITE.title} on Facebook`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/combimauri",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/combimauri",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://x.com/combimauri",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:me@combimauri.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
