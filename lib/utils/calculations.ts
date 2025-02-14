import { Project } from "@/types/project";

export function calculateProjectTotals(projects: Project[]) {
  return projects.reduce((acc, project) => {
    const estimatedTotal = project.items.reduce((sum, item) => 
      sum + (Number(item.quantity) * Number(item.estimatedRate)), 0);

    const actualTotal = project.items.reduce((sum, item) => 
      sum + item.bills.reduce((billSum, bill) => 
        billSum + Number(bill.amount), 0), 0);

    return {
      estimatedTotal: acc.estimatedTotal + estimatedTotal,
      actualTotal: acc.actualTotal + actualTotal
    };
  }, { estimatedTotal: 0, actualTotal: 0 });
}

export function getLast30DaysSpending(projects: Project[]) {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  // Get all bills from all projects
  const allBills = projects.flatMap(project => 
    project.items.flatMap(item => 
      item.bills.map(bill => ({
        ...bill,
        date: new Date(bill.createdAt || new Date()).toISOString().split('T')[0]
      }))
    )
  );

  // Group bills by date
  const spendingByDate = dates.map(date => ({
    date,
    amount: allBills
      .filter(bill => bill.date === date)
      .reduce((sum, bill) => sum + Number(bill.amount), 0)
  }));

  return spendingByDate;
} 