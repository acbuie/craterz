import { Cog } from "lucide-react";

import { SidebarHeader, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export function FilterHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full content-between gap-2">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Cog className="size-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-medium text-md">Configure Filters</span>
              <span className="text-xs">Craterz v0.0.1</span>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
