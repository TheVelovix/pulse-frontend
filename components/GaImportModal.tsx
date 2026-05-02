"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface GaProperty {
  Id: string;
  DisplayName: string;
}

export default function GaImportModal({ projectId }: { projectId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<GaProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [importing, setImporting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const gaProperties = searchParams.get("ga-properties");
    const gaAccessToken = searchParams.get("ga-access-token");

    if (gaProperties && gaAccessToken) {
      try {
        const parsed = JSON.parse(gaProperties) as GaProperty[];
        setProperties(parsed);
        setAccessToken(gaAccessToken);
        setSelectedPropertyId(parsed[0]?.Id ?? "");
        setOpen(true);
      } catch {
        toast.error("Failed to parse GA properties");
      }
    }
  }, [searchParams]);

  const handleImport = async () => {
    if (!selectedPropertyId || !accessToken) return;
    setImporting(true);
    try {
      const res = await fetch(`/api/ga-import/import/${projectId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, propertyId: selectedPropertyId }),
      });

      if (res.ok) {
        if (res.ok) {
          const text = await res.text();
          if (text === "no-data") {
            toast.success("No data found in the selected property");
          } else {
            const data = JSON.parse(text);
            toast.success(`Successfully imported ${data.imported} page views`);
          }
          setOpen(false);
          // Clear URL params
          router.replace(`/dashboard/project/${projectId}`);
        }
      } else {
        toast.error("Import failed. Please try again.");
      }
    } catch (e) {
      console.error("Import error:", e);
      toast.error("Something went wrong");
    } finally {
      setImporting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-bold">Import from Google Analytics</h2>
          <p className="text-text-muted text-sm mt-1">
            Select a GA4 property to import historical data from. This will
            import up to 2 years of page views.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">GA4 Property</label>
          <select
            className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm"
            value={selectedPropertyId}
            onChange={e => setSelectedPropertyId(e.target.value)}
          >
            {properties.map(p => (
              <option key={p.Id} value={p.Id}>
                {p.DisplayName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
            onClick={() => {
              setOpen(false);
              router.replace(`/dashboard/project/${projectId}`);
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
            onClick={handleImport}
            disabled={importing}
          >
            {importing ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
