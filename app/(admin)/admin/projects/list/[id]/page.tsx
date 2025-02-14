import { getProjectById } from "@/lib/actions/project.actions";
import ProjectCard from "@/components/project-card";
import NotFound from "@/app/not-found";

export default async function AdminProjectPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const { project, error } = await getProjectById(id);
  if (error || !project) {
    return NotFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>
      <div className="space-y-4">
        {project.items.map((item) => (
          <ProjectCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}