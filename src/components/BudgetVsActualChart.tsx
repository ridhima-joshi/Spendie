import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Expense } from "./ExpenseTracker";

interface BudgetVsActualChartProps {
  expenses: Expense[];
}

const CATEGORY_BUDGETS = {
  food: 500,
  transport: 300,
  shopping: 400,
  entertainment: 200,
  health: 250,
  utilities: 150,
  other: 100
};

const CATEGORY_LABELS = {
  food: "Food & Dining",
  transport: "Transport",
  shopping: "Shopping",
  entertainment: "Entertainment",
  health: "Health",
  utilities: "Utilities",
  other: "Other"
};

export const BudgetVsActualChart = ({ expenses }: BudgetVsActualChartProps) => {
  // Group expenses by category and calculate totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Create chart data
  const chartData = Object.entries(CATEGORY_BUDGETS).map(([category, budget]) => ({
    category: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS],
    budget,
    actual: categoryTotals[category] || 0,
    remaining: Math.max(0, budget - (categoryTotals[category] || 0))
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-card-foreground">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm text-expense-income">
              Budget: ${data.budget.toFixed(2)}
            </p>
            <p className="text-sm text-destructive">
              Spent: ${data.actual.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              Remaining: ${data.remaining.toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-card-foreground">
          Budget vs Actual Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="category" 
                className="text-xs"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="budget" 
                fill="hsl(var(--expense-income))" 
                name="Budget"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="actual" 
                fill="hsl(var(--destructive))" 
                name="Spent"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Category Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {chartData.map((item) => (
            <div key={item.category} className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
              <span className="text-sm font-medium text-foreground">{item.category}</span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  ${item.actual.toFixed(2)} / ${item.budget.toFixed(2)}
                </div>
                <div className={`text-xs ${item.actual > item.budget ? 'text-destructive' : 'text-expense-income'}`}>
                  {item.actual > item.budget ? 'Over budget' : `$${item.remaining.toFixed(2)} left`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};