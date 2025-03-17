import Props from "prop-types";
export default function DatetoDateFilter({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Filter Orders</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
    </div>
  );
}

// props types
DatetoDateFilter.propTypes = {
  startDate: Props.string.isRequired,
  setStartDate: Props.func.isRequired,
  endDate: Props.string.isRequired,
  setEndDate: Props.func.isRequired,
};