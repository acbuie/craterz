export function AppDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-12 gap-2 p-2 h-full">
      <div className="md:col-span-4 row-span-6 bg-accent rounded-lg">
        <div className="flex justify-center items-center h-full">Chart</div>
      </div>
      <div className="md:col-span-8 row-span-6 bg-accent rounded-lg">
        <div className="flex justify-center items-center h-full">Map</div>
      </div>
      <div className="md:col-span-12 row-span-6 bg-accent rounded-lg">
        <div className="flex justify-center items-center h-full">Table</div>
      </div>
    </div>
  );
}
