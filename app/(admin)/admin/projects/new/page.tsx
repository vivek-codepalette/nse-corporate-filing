import { ProjectForm } from "@/components/forms/project-form";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
        <ProjectForm />
      </div>
    </div>
  );
}
