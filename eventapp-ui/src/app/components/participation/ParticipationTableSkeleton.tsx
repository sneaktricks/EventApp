const ParticipationTableSkeleton = () => {
  const rows = Array.from(Array(10).keys());
  const columns = Array.from(Array(4).keys());

  return (
    <div className="relative overflow-x-auto shadow-md">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 tabular-nums">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Participated At
            </th>
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {rows.map((r) => (
            <tr
              key={r}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              {columns.map((c) => (
                <td key={c} className="px-6 py-4">
                  <div className="w-full h-4 rounded bg-gray-200 dark:bg-gray-700" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipationTableSkeleton;
