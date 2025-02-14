'use server'

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { put } from '@vercel/blob';
import { revalidatePath } from "next/cache";
import { Project, Bill } from "@/types/project";

export async function getProjects() {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const projects = await prisma.project.findMany({
      include: {
        items: {
          include: {
            bills: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { success: true, projects: JSON.parse(JSON.stringify(projects)) as Project[] };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getProjectById(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            bills: true
          }
        }
      }
    });

    return { success: true, project: JSON.parse(JSON.stringify(project)) as Project };
  } catch {
    return { success: false, error: "Failed to fetch project" };
  }
}

interface CreateProjectInput {
  name: string;
  items: Array<{
    description: string;
    unit: string;
    quantity: number;
    estimatedRate: number;
  }>;
}

export async function createProject(data: CreateProjectInput) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const project = await prisma.project.create({
      data: {
        name: data.name,
        items: {
          create: data.items.map(item => ({
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            estimatedRate: item.estimatedRate,
            estimatedAmount: item.quantity * item.estimatedRate
          }))
        }
      },
      include: {
        items: true
      }
    });

    revalidatePath('/admin/projects');
    revalidatePath('/dashboard/projects');
    
    return { project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { error: "Failed to create project" };
  }
}

export async function addBill(data: Bill & { itemId: string }) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    let fileUrl, fileKey;
    
    if (data.file) {
      const blob = await put(data.file.name, data.file, {
        access: 'public',
      });
      fileUrl = blob.url;
      fileKey = blob.url.split('/').pop() || '';
    }

    const bill = await prisma.bill.create({
      data: {
        name: data.name,
        itemId: data.itemId,
        quantity: data.quantity,
        amount: data.amount,
        fileUrl,
        fileKey
      },
    });

    revalidatePath('/admin/projects/[id]');
    revalidatePath('/dashboard/projects/[id]');
    return { success: true, bill: JSON.parse(JSON.stringify(bill)) as Bill };
  } catch (error) {
    console.error('Error adding bill:', error);
    return { success: false, error: "Failed to add bill" };
  }
}

export async function updateBill(data: Bill) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    let fileUrl, fileKey;
    
    if (data.file) {
      const blob = await put(data.file.name, data.file, {
        access: 'public',
      });
      fileUrl = blob.url;
      fileKey = blob.url.split('/').pop() || '';
    }

    const bill = await prisma.bill.update({
      where: { id: data.id },
      data: {
        name: data.name,
        quantity: data.quantity,
        amount: data.amount,
        ...(fileUrl && { fileUrl, fileKey })
      },
      include: {
        item: true
      }
    });

    revalidatePath('/admin/projects/[id]');
    revalidatePath('/dashboard/projects/[id]');
    return { success: true, bill: JSON.parse(JSON.stringify(bill)) as Bill };
  } catch (error) {
    console.error('Error updating bill:', error);
    return { success: false, error: "Failed to update bill" };
  }
}

export async function deleteBill(billId: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.bill.delete({
      where: { id: billId }
    });

    revalidatePath('/admin/projects/[id]');
    revalidatePath('/dashboard/projects/[id]');
    return { success: true };
  } catch (error) {
    console.error('Error deleting bill:', error);
    return { success: false, error: "Failed to delete bill" };
  }
}

interface UpdateItemInput {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  estimatedRate: number;
}

export async function updateItem(data: UpdateItemInput) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      throw new Error("Unauthorized: Admin access required");
    }

    const item = await prisma.item.update({
      where: { id: data.id },
      data: {
        description: data.description,
        unit: data.unit,
        quantity: data.quantity,
        estimatedRate: data.estimatedRate,
        estimatedAmount: data.quantity * data.estimatedRate
      },
      include: {
        bills: true
      }
    });

    revalidatePath('/admin/projects/[id]');
    revalidatePath('/dashboard/projects/[id]');
    return { success: true, item };
  } catch (error) {
    console.error('Error updating item:', error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteItem(itemId: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      throw new Error("Unauthorized: Admin access required");
    }

    await prisma.item.delete({
      where: { id: itemId }
    });

    revalidatePath('/admin/projects/[id]');
    revalidatePath('/dashboard/projects/[id]');
    return { success: true };
  } catch (error) {
    console.error('Error deleting item:', error);
    return { success: false, error: "Failed to delete item" };
  }
} 