import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Expense } from "./ExpenseTracker";

interface CategoryChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS = {
  food: "#ff6b35",
  transport: "#4285f4",
  entertainment: "#ea4c89",
  utilities: "#f4c842",
  shopping: "#8b5cf6",
  health: "#10b981",
  other: "#6b7280"
};

const CATEGORY_LABELS = {
  food: "Food & Dining",
  transport: "Transportation",
  entertainment: "Entertainment",
  utilities: "Utilities", 
  shopping: "Shopping",
  health: "Healthcare",
  other: "Other"
};

export const CategoryChart = ({ expenses }: CategoryChartProps) => {
  // Group expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format
  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    name: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category,
    value: amount,
    color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "#6b7280"
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border/20 rounded-lg p-3 shadow-card">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-primary font-semibold">${data.value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card border-0 animate-slide-up">
      <h3 className="text-xl font-semibold text-foreground mb-6">Spending by Category</h3>
      
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-muted-foreground text-lg mb-2">No data to display</p>
            <p className="text-sm text-muted-foreground">Add some expenses to see your spending breakdown</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium text-foreground">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};