import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign } from "lucide-react";
import type { Expense } from "./ExpenseTracker";
import type { Budget } from "./ExpenseTracker";

// Define the props for this component
interface BudgetOverviewProps {
  budgets: Budget | undefined;
  expenses: Expense[];
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  budgets,
  expenses,
}) => {
  // Calculate expenses per category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  if (!budgets) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">
          No budget set. Please complete onboarding.
        </p>
      </div>
    );
  }

  const categoryArray = Object.entries(budgets.categories);

  return (
    <Card className="p-8 bg-gradient-card shadow-elevated border-0 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Budget Overview
        </h2>
        <div className="p-2 bg-primary/10 rounded-full">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="space-y-4">
        {categoryArray.map(([category, budgetAmount]) => {
          const spent = expensesByCategory[category] || 0;
          const percentage = (spent / budgetAmount) * 100;

          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <p className="text-foreground font-medium">{category}</p>
                <p className="text-muted-foreground">
                  ${spent.toFixed(2)} / ${budgetAmount.toFixed(2)}
                </p>
              </div>
              <Progress value={percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                ${(budgetAmount - spent).toFixed(2)} left
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
