import { ComboboxAccordion } from "./components/combobox-accordion";

const frameworks = [
  {
    value: ["next.js", "react", "typescript"],
    label: "Next.js",
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
