import { getProjects } from "@/lib/actions/project.actions";
import ProjectTable from "@/components/project-table";

export default async function ProjectsPage() {
  const { projects, error } = await getProjects();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!projects) {
    return <div>No projects found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
