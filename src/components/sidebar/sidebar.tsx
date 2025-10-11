import { Sidebar } from "@/components/ui/sidebar";

import { FilterHeader } from "@/components/sidebar/header";
import { FilterMenu } from "@/components/sidebar/menu";
import { FilterFooter } from "@/components/sidebar/footer";

export function AppSidebar() {
  return (
    <Sidebar>
      <FilterHeader />
      <FilterMenu />
      <FilterFooter />
    </Sidebar>
  );
}
