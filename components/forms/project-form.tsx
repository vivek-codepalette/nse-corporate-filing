'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createProject } from '@/lib/actions/project.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { parseProjectItems } from '@/lib/openai';
import { useToast } from '@/hooks/use-toast';

interface ProjectFormData {
  name: string;
  itemsText: string;
}

export function ProjectForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      itemsText: ''
    }
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true);
      
      // Parse items using GPT-4
      console.log("Items Text: ", data.itemsText);
      const items = await parseProjectItems(data.itemsText);
      console.log("Items: ", items);
      const result = await createProject({
        name: data.name,
        items
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
        return;
      }

      if (result.project) {
        toast({
          title: "Success",
          description: 'Project created successfully',
          variant: "default"
        });
        router.push(`/admin/projects/${result.project.id}`);
      }
    } catch {
      toast({
        title: "Error",
        description: 'Failed to create project. Please check your input format.',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register("name", { required: "Project name is required" })}
          placeholder="Project Name"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Textarea
          {...register("itemsText", { required: "Items are required" })}
          placeholder={`Enter project items description. Example:
Excavation work for foundation, cum, 45.5, 150.75
RCC M20 for foundation, cum, 12.3, 7500.00
Steel reinforcement work, kg, 1250, 85.50`}
          rows={10}
        />
        {errors.itemsText && <p className="text-red-500">{errors.itemsText.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </Button>
    </form>
  );
}