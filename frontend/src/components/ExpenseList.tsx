import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { Expense } from "./ExpenseTracker";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onAddExpense: () => void;
}

const CATEGORY_COLORS = {
  food: "expense-food",
  transport: "expense-transport", 
  entertainment: "expense-entertainment",
  utilities: "expense-utilities",
  shopping: "expense-shopping",
  health: "expense-health",
  other: "expense-other"
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

export const ExpenseList = ({ expenses, onDeleteExpense, onAddExpense }: ExpenseListProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-card border-0 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Recent Transactions</h2>
        <Button onClick={onAddExpense} size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No expenses yet</p>
          <Button onClick={onAddExpense} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Expense
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense, index) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/10 hover:bg-background/70 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className={`w-3 h-3 rounded-full bg-${CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS]}`} 
                />
                <div>
                  <p className="font-medium text-foreground">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[expense.category as keyof typeof CATEGORY_LABELS]} • {expense.date}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-foreground">
                  ${expense.amount.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};