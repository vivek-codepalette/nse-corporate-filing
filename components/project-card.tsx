"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Edit, Paperclip, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Item, Bill } from "@/types/project"
import { usePathname } from 'next/navigation'
import { updateItem, deleteItem, addBill, updateBill, deleteBill } from "@/lib/actions/project.actions"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function ProjectCard({ item }: { item: Item }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("admin");
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false)
  const [bills, setBills] = useState<Bill[]>(item.bills || [])
  const [newBill, setNewBill] = useState({ name: "", quantity: 0, amount: 0, file: null } as Bill)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingBill, setEditingBill] = useState<Bill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const billsPerPage = 5
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editedItem, setEditedItem] = useState({
    description: item.description,
    unit: item.unit,
    quantity: Number(item.quantity),
    estimatedRate: Number(item.estimatedRate)
  });
  const [isEditingBill, setIsEditingBill] = useState(true);

  const toggleExpanded = () => setExpanded(!expanded)

  const totalEstimatedAmount = item.quantity * item.estimatedRate
  const totalSpentAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
  const totalSpentQuantity = bills.reduce((sum, bill) => sum + bill.quantity, 0)
  const percentageSpentAmount = (totalSpentAmount / totalEstimatedAmount) * 100
  const percentageSpentQuantity = (totalSpentQuantity / item.quantity) * 100

  const handleAddBill = async () => {
    setIsEditingBill(false);
    if (newBill.name && newBill.quantity > 0 && newBill.amount > 0) {
      try {
        const result = await addBill({
          name: newBill.name,
          itemId: item.id.toString(),
          quantity: newBill.quantity,
          amount: newBill.amount,
          file: newBill.file
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Bill added successfully",
          });
          setBills([...bills, result.bill as Bill]);
          setNewBill({ name: "", quantity: 0, amount: 0 });
          setIsDialogOpen(false);
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive"
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to add bill",
          variant: "destructive"
        });
      } finally {
        setIsEditingBill(true);
      }
    }
  };

  const handleUpdateBill = async () => {
    if (!editingBill) return;
    setIsEditingBill(false);

    try {
      const result = await updateBill({
        id: editingBill.id,
        name: newBill.name,
        quantity: newBill.quantity,
        amount: newBill.amount,
        file: newBill.file || null
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Bill updated successfully",
        });
        setBills(bills.map(b => b.id === editingBill.id ? result.bill as Bill : b));
        setNewBill({ name: "", quantity: 0, amount: 0, file: null });
        setEditingBill(null);
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update bill",
        variant: "destructive"
      });
    } finally {
      setIsEditingBill(true);
    }
  };

  const handleDeleteBill = async (billId: string) => {
    try {
      const result = await deleteBill(billId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Bill deleted successfully",
        });
        setBills(bills.filter(b => b.id !== billId));
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete bill",
        variant: "destructive"
      });
    } finally {
      setIsEditingBill(true);
    }
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill)
    setNewBill({ name: bill.name, quantity: bill.quantity, amount: bill.amount, file: null })
    setIsDialogOpen(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewBill((prev) => ({ ...prev, file: file} as Bill))
    }
  }

  const indexOfLastBill = currentPage * billsPerPage
  const indexOfFirstBill = indexOfLastBill - billsPerPage
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500"
    if (percentage > 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleUpdateItem = async () => {
    const result = await updateItem({
      id: item.id,
      ...editedItem
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setIsEditingItem(false);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async () => {
    const result = await deleteItem(item.id);

    if (result.success) {
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const billDialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editingBill ? "Edit Bill" : "Add New Bill"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Bill Name</Label>
          <Input
            id="name"
            value={newBill.name}
            onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            step="0.01"
            value={newBill.quantity || ""}
            onChange={(e) => setNewBill({ ...newBill, quantity: Number(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={newBill.amount || ""}
            onChange={(e) => setNewBill({ ...newBill, amount: Number(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="file">Upload File</Label>
          <Input 
            id="file" 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
          />
        </div>
        <Button onClick={editingBill ? handleUpdateBill : handleAddBill} disabled={!isEditingBill}>
          {editingBill ? "Update Bill" : "Add Bill"}
        </Button>
      </div>
    </DialogContent>
  );

  const billsTable = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bill Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentBills.map((bill) => (
          <TableRow key={bill.id}>
            <TableCell>{bill.name}</TableCell>
            <TableCell>{bill.quantity}</TableCell>
            <TableCell>{bill.amount.toLocaleString()}</TableCell>
            <TableCell>
                {bill.file && (
                <a 
                  href={`${bill.file}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-blue-500"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  View File
                </a>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditBill(bill)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteBill(bill.id!)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="cursor-pointer hover:bg-gray-50" onClick={toggleExpanded}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Est. Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[100px]">
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditingItem(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            This action cannot be undone. This will permanently delete the item
                            and all associated bills.
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={handleDeleteItem}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.description.slice(0, 100)}...</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{item.quantity}</span>
                    <Progress
                      value={percentageSpentQuantity > 100 ? 100 : percentageSpentQuantity}
                      className={`w-full h-2 ${getProgressColor(percentageSpentQuantity)}`}
                    />
                    <span className="text-xs text-gray-500">
                      {percentageSpentQuantity > 100
                        ? `${percentageSpentQuantity.toFixed(2)}% (Over limit)`
                        : `${percentageSpentQuantity.toFixed(2)}% used`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>₹{item.estimatedRate.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>₹{totalEstimatedAmount.toLocaleString()}</span>
                    <Progress
                      value={percentageSpentAmount > 100 ? 100 : percentageSpentAmount}
                      className={`w-full h-2 ${getProgressColor(percentageSpentAmount)}`}
                    />
                    <span className="text-xs text-gray-500">
                      {percentageSpentAmount > 100
                        ? `${percentageSpentAmount.toFixed(2)}% (Over budget)`
                        : `${percentageSpentAmount.toFixed(2)}% spent`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {expanded && (
          <div className="border-t">
            <div className="p-6">
              <h3 className="font-semibold mb-4">Bills</h3>
              <div className="flex justify-between items-center mb-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add Bill
                    </Button>
                  </DialogTrigger>
                  {billDialogContent}
                </Dialog>
              </div>

              {billsTable}

              {bills.length > billsPerPage && (
                <div className="flex justify-center space-x-2 mt-4">
                  {Array.from({ length: Math.ceil(bills.length / billsPerPage) }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isEditingItem && (
          <Dialog open={isEditingItem} onOpenChange={setIsEditingItem}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={10}
                    value={editedItem.description}
                    onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={editedItem.unit}
                    onChange={(e) => setEditedItem({ ...editedItem, unit: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={editedItem.quantity}
                    onChange={(e) => setEditedItem({ ...editedItem, quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estimatedRate">Estimated Rate</Label>
                  <Input
                    id="estimatedRate"
                    type="number"
                    step="0.01"
                    value={editedItem.estimatedRate}
                    onChange={(e) => setEditedItem({ ...editedItem, estimatedRate: Number(e.target.value) })}
                  />
                </div>
                <Button onClick={handleUpdateItem}>Update Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
