import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import StocksTable from '@/components/stocks/stocks-table';

export default async function FavoriteStocksPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Please login to view favorites</div>;
  }

  const stocks = await prisma.companyInfo.findMany({
    where: {
      favorites: {
        some: {
          userId
        }
      }
    },
    include: {
      favorites: {
        where: {
          userId
        }
      }
    }
  });

  const stocksWithFavorites = stocks.map(stock => ({
    ...stock,
    isFavorite: true
  }));

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Favorite Stocks</h1>
      <StocksTable initialStocks={stocksWithFavorites} showFavoritesOnly={true} />
    </div>
  );
} 