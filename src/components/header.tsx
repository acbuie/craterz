import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-10 shrink-0 items-center gap-2 border-b px-2">
      <SidebarTrigger />
      <span className="text-xs md:text-lg font-medium flex grow justify-center">
        Craterz, the Mars Crater Database Search Tool
      </span>
    </header>
  );
}
