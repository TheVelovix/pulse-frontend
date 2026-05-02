export default function SearchConsoleList({
  data,
}: {
  data: GoogleSearchConsoleData[];
}) {
  return (
    <div className="bg-card border border-white/10 rounded-lg p-5 overflow-x-auto">
      <h2 className="text-sm font-medium text-text-muted mb-4">
        Search Queries (Google Search Console)
      </h2>
      {data.length === 0 ? (
        <p className="text-text-muted text-xs">No data</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {data.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm gap-4"
            >
              <span className="truncate flex-1">{item.query}</span>
              <div className="flex gap-4 text-text-muted shrink-0 text-xs">
                <span>{item.clicks} clicks</span>
                <span>{item.impressions} impressions</span>
                <span>{item.ctr}% CTR</span>
                <span>#{item.position} pos</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
