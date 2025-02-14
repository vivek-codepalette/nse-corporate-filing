import { getProjects } from "@/lib/actions/project.actions";
import { ProjectSummary } from "@/components/dashboard/project-summary";

export default async function AdminDashboardPage() {
  const { projects, error } = await getProjects();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!projects) {
    return <div>No projects found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <ProjectSummary projects={projects} />
    </div>
  );
} 