'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleFavorite } from '@/lib/actions/stocks.actions';

interface CompanyInfo {
  id: string;
  symbol: string;
  companyName: string;
  series: string;
  purpose: string;
  faceValue: number;
  exDate: Date | null;
  recordDate: Date | null;
  bookClosureStart: Date | null;
  bookClosureEnd: Date | null;
  isFavorite: boolean;
}

export default function StocksTable({ 
  initialStocks,
  showFavoritesOnly = false 
}: { 
  initialStocks: CompanyInfo[],
  showFavoritesOnly?: boolean 
}) {
  const [stocks, setStocks] = useState(initialStocks);

  const handleToggleFavorite = async (stockId: string) => {
    const response = await toggleFavorite(stockId);
    if (response.success) {
      setStocks(stocks.map(stock => 
        stock.id === stockId 
          ? { ...stock, isFavorite: !stock.isFavorite }
          : stock
      ));
    }
  };

  const displayedStocks = showFavoritesOnly 
    ? stocks.filter(stock => stock.isFavorite)
    : stocks;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Favorite</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Series</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Face Value</TableHead>
          <TableHead>Ex-Date</TableHead>
          <TableHead>Record Date</TableHead>
          <TableHead>Book Closure Start</TableHead>
          <TableHead>Book Closure End</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedStocks.map((stock) => (
          <TableRow key={stock.id}>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleFavorite(stock.id)}
              >
                {stock.isFavorite ? <Star className="fill-yellow-400" /> : <StarOff />}
              </Button>
            </TableCell>
            <TableCell>{stock.symbol}</TableCell>
            <TableCell>{stock.companyName}</TableCell>
            <TableCell>{stock.series}</TableCell>
            <TableCell>{stock.purpose}</TableCell>
            <TableCell>{stock.faceValue}</TableCell>
            <TableCell>{stock.exDate?.toLocaleDateString()}</TableCell>
            <TableCell>{stock.recordDate?.toLocaleDateString()}</TableCell>
            <TableCell>{stock.bookClosureStart?.toLocaleDateString()}</TableCell>
            <TableCell>{stock.bookClosureEnd?.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 