import { getProjects } from "@/lib/actions/project.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectTable from "@/components/project-table";

export default async function AdminProjectsPage() {
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
        <Link href="/admin/projects/new">
          <Button>Create New Project</Button>
        </Link>
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
