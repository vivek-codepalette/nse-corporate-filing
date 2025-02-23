'use server';

import { prisma } from '@/db/prisma';
import { auth } from '@/auth';

export async function toggleFavorite(companyInfoId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const userId = session.user.id;

    // Check if favorite exists
    const existingFavorite = await prisma.userFavorite.findUnique({
      where: {
        userId_companyInfoId: {
          userId,
          companyInfoId
        }
      }
    });

    if (existingFavorite) {
      // Remove favorite
      await prisma.userFavorite.delete({
        where: {
          id: existingFavorite.id
        }
      });
    } else {
      // Add favorite
      await prisma.userFavorite.create({
        data: {
          userId,
          companyInfoId
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Failed to toggle favorite' };
  }
} 