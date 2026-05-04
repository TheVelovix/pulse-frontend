export default function StatTable<
  T extends Record<string, string | number | boolean | null>,
>({
  title,
  items,
  columns,
}: {
  title: string;
  items: T[];
  columns: { key: keyof T; label: string }[];
}) {
  return (
    <div className="bg-card border border-white/10 rounded-lg p-5 overflow-x-auto max-h-125">
      <h2 className="text-sm font-medium text-text-muted mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-text-muted text-xs">No data</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="text-left text-xs text-text-muted font-medium pb-2 pr-4"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                {columns.map(col => (
                  <td key={String(col.key)} className="py-2 pr-4 text-sm">
                    {String(item[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
