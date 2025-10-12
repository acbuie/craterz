import { AppTable } from "@/components/data-table/data";

export function AppDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2">
      <div className="md:col-span-4 bg-accent rounded-md">
        <div className="flex justify-center aspect-square items-center h-full">
          Chart
        </div>
      </div>
      <div className="md:col-span-8 bg-accent rounded-md">
        <div className="flex justify-center items-center h-full">Map</div>
      </div>
      <div className="md:col-span-12 row-span-6">
        <AppTable />
      </div>
    </div>
  );
}
