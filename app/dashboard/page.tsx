"use client";
import { Card } from "@/components/Card";
import { useEffect, useState, Suspense } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { SubscriptionPlan, useSession } from "@/context/SessionContext";
import { Skeleton } from "boneyard-js/react";

const emptyForm = { name: "", domain: "" };
const ANIM_DURATION = 200;
async function getProjects(controller: AbortController): Promise<Project[]> {
  try {
    const response = await fetchWithAuth("/api/projects", {
      signal: controller.signal,
    });
    if (!response.ok) {
      toast.error("Failed to fetch projects.");
      return [];
    }
    return response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return [];
    toast.error("Failed to fetch projects.");
    return [];
  }
}

function JustSubscribed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refetch } = useSession();

  useEffect(() => {
    if (searchParams.get("justSubscribed") === "true") {
      refetch().then(() => {
        toast.success("You're now on the Pro plan!");
        router.replace("/dashboard");
      });
    }
  }, []);

  return null;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    getProjects(controller).then(projects => {
      setProjects(projects);
      setLoadingProjects(false);
    });
    if (!user) router.replace("/");
    return () => controller.abort();
  }, []);

  function openForm() {
    setShowForm(true);
    requestAnimationFrame(() => setFormVisible(true));
  }

  function closeForm() {
    setFormVisible(false);
    setTimeout(() => setShowForm(false), ANIM_DURATION);
  }

  async function handleDelete(id: string) {
    const projectsBackup = [...projects];
    setProjects(prev => prev.filter(project => project.id !== id));
    const res = await fetchWithAuth(`/api/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      setProjects(projectsBackup);
      toast.error("Failed to delete project.");
      return;
    }
    toast.success("Project deleted successfully.");
  }
  async function handleToggleVisibility(id: string) {
    const res = await fetchWithAuth(`/api/projects/${id}/visibility`, {
      method: "PATCH",
    });
    if (!res.ok) {
      toast.error("Failed to update visibility.");
      return;
    }
    const data: { isPublic: boolean; publicSlug: string | null } =
      await res.json();
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, isPublic: data.isPublic, publicSlug: data.publicSlug }
          : p,
      ),
    );
    if (data.isPublic && data.publicSlug) {
      const url = `${window.location.origin}/public/${data.publicSlug}`;
      navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Project is now public — link copied to clipboard.");
    } else {
      toast.success("Project is now private.");
    }
  }

  async function handleCreate(e: React.SubmitEvent) {
    e.preventDefault();
    const res = await fetchWithAuth("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      toast.error("Failed to create project.");
      return;
    }
    closeForm();
    toast.success("Project created successfully.");
    const controller = new AbortController();
    const data = await getProjects(controller);
    setProjects(data);
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-6 py-10">
      <Suspense>
        <JustSubscribed />
      </Suspense>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {user?.subscriptionPlan === SubscriptionPlan.FREE && (
          <p>{projects.length}/5 projects</p>
        )}
        {user?.subscriptionPlan === SubscriptionPlan.PRO ||
        (user?.subscriptionPlan === SubscriptionPlan.FREE &&
          projects.length < 5) ? (
          <button
            onClick={openForm}
            className="text-sm font-medium bg-accent hover:bg-accent-hover transition-colors duration-200 px-4 py-2 rounded-md cursor-pointer"
          >
            + Create Project
          </button>
        ) : null}
      </div>

      <Skeleton
        loading={loadingProjects}
        name="project-grid"
        animate="shimmer"
        darkColor="#1a1a1a"
        transition
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-white/10 rounded-lg p-4 flex flex-col gap-3"
              >
                <div className="h-4 w-1/2 rounded bg-white/10" />
                <div className="h-3 w-1/3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        }
        fixture={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                id: "1",
                name: "My Site",
                domain: "example.com",
                createdAt: new Date().toISOString(),
                isPublic: false,
                publicSlug: null,
              },
            ].map(project => (
              <a href={`/dashboard/project/${project.id}`} key={project.id}>
                <Card
                  item={project}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                />
              </a>
            ))}
          </div>
        }
      >
        {projects.length === 0 ? (
          <p className="text-text-muted text-sm">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map(project => (
              <a href={`/dashboard/project/${project.id}`} key={project.id}>
                <Card
                  item={project}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                />
              </a>
            ))}
          </div>
        )}
      </Skeleton>

      {showForm && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200 ${formVisible ? "opacity-100" : "opacity-0"}`}
          onClick={closeForm}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleCreate}
            className={`bg-card border border-white/10 rounded-lg p-6 w-full max-w-md flex flex-col gap-5 transition-all duration-200 ${formVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <h2 className="text-lg font-semibold">Create Project</h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                placeholder="My Project"
                value={form.name}
                onChange={e => {
                  setError("");
                  setForm(prev => ({ ...prev, name: e.target.value }));
                }}
                className="w-full border border-white/20 rounded-lg p-2 text-sm bg-background transition-colors duration-200 focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Domain</label>
              <input
                type="text"
                placeholder="example.com"
                value={form.domain}
                onChange={e => {
                  setError("");
                  setForm(prev => ({ ...prev, domain: e.target.value }));
                }}
                className="w-full border border-white/20 rounded-lg p-2 text-sm bg-background transition-colors duration-200 focus:outline-none focus:border-accent"
                required
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-sm font-medium bg-accent hover:bg-accent-hover transition-colors duration-200 px-4 py-2 rounded-md cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
