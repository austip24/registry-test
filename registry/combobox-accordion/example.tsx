import { ComboboxAccordion } from "./components/combobox-accordion";

const frameworks = [
  {
    value: "Next.js",
    label: "React",
  },
  {
    value: "Gatsby",
    label: "React",
  },
  {
    value: "Meta",
    label: "React",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export const ExampleComboboxAccordion = () => {
  return <ComboboxAccordion items={frameworks} />;
};
