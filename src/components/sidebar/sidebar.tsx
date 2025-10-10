import { Bubbles, CircleDotDashed, Diameter, Ellipsis } from "lucide-react";

import { Sidebar } from "@/components/ui/sidebar";

import { FilterHeader } from "@/components/sidebar/header";
import { FilterMenu } from "@/components/sidebar/menu";
import { FilterFooter } from "@/components/sidebar/footer";

const filters = [
  {
    title: "Geometry",
    icon: Diameter,
    items: [
      {
        title: "Diameter",
        query: "#",
      },
      {
        title: "Eccentricity",
        query: "#",
      },
      {
        title: "Ellipticity",
        query: "#",
      },
      {
        title: "Angle (from N)",
        query: "#",
      },
    ],
  },
  {
    title: "Ejecta",
    icon: Bubbles,
    items: [
      {
        title: "Classification",
        query: "#",
      },
      {
        title: "Layers",
        query: "#",
      },
      {
        title: "Texture",
        query: "#",
      },
      {
        title: "Shape",
        query: "#",
      },
    ],
  },
  {
    title: "Interior",
    icon: CircleDotDashed,
    items: [
      {
        title: "Classification",
        query: "#",
      },
      {
        title: "Wall Morphology",
        query: "#",
      },
      {
        title: "Floor Morphology",
        query: "#",
      },
    ],
  },
  {
    title: "Miscellaneous",
    icon: Ellipsis,
    items: [
      {
        title: "Confidence",
        query: "#",
      },
      {
        title: "Notes",
        query: "#",
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <FilterHeader />
      <FilterMenu filters={filters} />
      <FilterFooter />
    </Sidebar>
  );
}
