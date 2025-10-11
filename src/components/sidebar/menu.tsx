import {
  Bubbles,
  ChevronRight,
  CircleDotDashed,
  Diameter,
  Ellipsis,
  type LucideIcon,
} from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Slider } from "../ui/slider";

type Props = React.ComponentPropsWithoutRef<typeof Slider>;

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  items: { title: string; component?: React.ElementType; props?: Props }[];
}

interface SidebarItems extends Array<SidebarItem> {}

const filters: SidebarItems = [
  {
    title: "Geometry",
    icon: Diameter,
    items: [
      {
        title: "Diameter",
        component: Slider,
        props: { defaultValue: [10, 80] },
      },
      {
        title: "Eccentricity",
        // component: "#",
      },
      {
        title: "Ellipticity",
        // component: "#",
      },
      {
        title: "Angle (from N)",
        // component: "#",
      },
    ],
  },
  {
    title: "Ejecta",
    icon: Bubbles,
    items: [
      {
        title: "Classification",
        // component: "#",
      },
      {
        title: "Layers",
        // component: "#",
      },
      {
        title: "Rexture",
        // component: "#",
      },
      {
        title: "Shape",
        // component: "#",
      },
    ],
  },
  {
    title: "Interior",
    icon: CircleDotDashed,
    items: [
      {
        title: "Classification",
        // component: "#",
      },
      {
        title: "Wall Morphology",
        // component: "#",
      },
      {
        title: "Floor Morphology",
        // component: "#",
      },
    ],
  },
  {
    title: "Miscellaneous",
    icon: Ellipsis,
    items: [
      {
        title: "Confidence",
        // component: "#",
      },
      {
        title: "Notes",
        // component: "#",
      },
    ],
  },
];

export function FilterMenu() {
  return (
    <SidebarContent className="gap-0">
      <SidebarGroup>
        <SidebarMenu>
          {filters.map((item) => (
            <Collapsible
              key={item.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="font-medium">
                    {<item.icon />}
                    {item.title}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((item) => (
                        <SidebarMenuSubItem
                          key={item.title}
                          className="flex flex-col"
                        >
                          <span className="flex items-center text-sm md:text-md">
                            {item.title}
                            {/* NOTE: Same color and size as SidebarMenuSub border  */}
                            <span className="flex grow bg-sidebar-border h-0.25 ml-2" />
                          </span>
                          <div>
                            {item.component && (
                              <item.component {...item.props} />
                            )}
                          </div>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
