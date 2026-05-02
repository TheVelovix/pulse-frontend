export default function StatList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="bg-card border border-white/10 rounded-lg p-5 overflow-x-auto">
      <h2 className="text-sm font-medium text-text-muted mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-text-muted text-xs">No data</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <div className="relative flex-1 mr-4">
                <div
                  className="absolute inset-y-0 left-0 bg-accent/10 rounded"
                  style={{ width: `${(item.count / total) * 100}%` }}
                />
                <span className="relative px-2 py-0.5 truncate block">
                  {item.label}
                </span>
              </div>
              <span className="text-text-muted shrink-0">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
