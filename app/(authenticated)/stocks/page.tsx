import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import StocksTable from '@/components/stocks/stocks-table';

export default async function StocksPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const stocks = await prisma.companyInfo.findMany({
    include: {
      favorites: {
        where: {
          userId: userId || ''
        }
      }
    }
  });

  const stocksWithFavorites = stocks.map(stock => ({
    ...stock,
    isFavorite: stock.favorites.length > 0
  }));

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">NSE Corporate Filings</h1>
      <StocksTable initialStocks={stocksWithFavorites} />
    </div>
  );
} 