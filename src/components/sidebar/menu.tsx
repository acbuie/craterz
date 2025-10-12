import {
  Bubbles,
  ChevronRight,
  CircleDotDashed,
  Diameter,
  Ellipsis,
  Info,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { GeometrySlider, type GeometrySliderProps } from "./filters/slider";

type Props = GeometrySliderProps;
type Component = typeof GeometrySlider;

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  items: {
    title: string;
    help?: string;
    component?: Component;
    props?: Props;
  }[];
}

type SidebarItems = Array<SidebarItem>;

const filters: SidebarItems = [
  {
    title: "Geometry",
    icon: Diameter,
    items: [
      {
        title: "Diameter",
        component: GeometrySlider,
        props: {
          defaultValue: { min: 100, max: 500 },
          min: 1,
          max: 1000,
          step: 1,
        },
      },
      {
        title: "Eccentricity",
        help: "Defined as the square root of 1 minus the ratio of the squares of the major and minor axes.",
        component: GeometrySlider,
        props: {
          defaultValue: { min: 0, max: 1 },
          min: 0,
          max: 1,
          step: 0.01,
        },
      },
      {
        title: "Flattening (Ellipticity)",
        help: "Defined as the ratio of the difference between the major and minor axes and the minor axis.",
        component: GeometrySlider,
        props: {
          defaultValue: { min: 0, max: 1 },
          min: 0,
          max: 10,
          step: 0.1,
        },
      },
      {
        title: "Angle",
        help: "Defined as the angle, in degrees, from North travelling clockwise.",
        component: GeometrySlider,
        props: {
          defaultValue: { min: 0, max: 180 },
          min: 0,
          max: 180,
          step: 0.5,
        },
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
                            {item.help && (
                              <Tooltip delayDuration={750}>
                                <TooltipTrigger asChild>
                                  <Info className="ml-1 size-3.25" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[20rem]">
                                  {item.help}
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {/* NOTE: Same color and size as SidebarMenuSub border  */}
                            <span className="flex grow bg-sidebar-border h-0.25 ml-2" />
                          </span>
                          <div>
                            {/* Ensure both component and props are defined to make typechecker happy */}
                            {item.component && item.props && (
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
