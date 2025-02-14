'use client'
import type { Project } from "@/types/project";
import Link from "next/link";
import { formatCurrency } from "@/utils/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname } from 'next/navigation'


export default function ProjectTable({ projects }: { projects: Project[] }) {
    const pathname = usePathname();
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link 
                    href={pathname.includes('admin') ? `/admin/projects/list/${project.id}` : `/dashboard/projects/${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>{project.items.length} items</TableCell>
                <TableCell>
                  {formatCurrency(project.items.reduce(
                    (acc, item) => acc + item.estimatedRate * item.quantity, 
                    0
                  ))}
                </TableCell>
                <TableCell>
                  {new Date(project.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    )
}