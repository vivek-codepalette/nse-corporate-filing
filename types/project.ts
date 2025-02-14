export interface Project {
    id: string;
    name: string;
    items: Item[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Item {
    id: string;
    description: string;
    unit: string;
    quantity: number;
    estimatedRate: number;
    estimatedAmount: number;
    bills: Bill[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Bill {
    id?: string;
    name: string;
    amount: number;
    quantity: number;
    file?: File | null;
    createdAt?: Date;
    updatedAt?: Date;
}