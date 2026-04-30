import ProjectAnalytics from "@/components/ProjectAnalytics";
import { notFound } from "next/navigation";

export default async function PublicDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${process.env.BACKEND_URL}/api/public/${slug}`);
  if (res.status == 404) {
    return notFound();
  } else if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  const analytics = await res.json();

  return (
    <div className="mx-auto max-w-7xl w-full px-6 py-10 flex flex-col gap-8">
      <h1 className="text-xl font-bold">
        Analytics for <span className="text-accent">{slug}</span>
      </h1>
      <ProjectAnalytics analytics={analytics} isPro={true} liveVisitors={-1} />
    </div>
  );
}
