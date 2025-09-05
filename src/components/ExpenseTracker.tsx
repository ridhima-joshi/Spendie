import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { AddExpenseModal } from "./AddExpenseModal";
import { ExpenseList } from "./ExpenseList";
import { BudgetOverview } from "./BudgetOverview";
import { CategoryChart } from "./CategoryChart";
import { BudgetVsActualChart } from "./BudgetVsActualChart";
import heroImage from "@/assets/expense-hero.jpg";

// Interfaces to match the data received from the backend
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  date: string;
}

export interface Budget {
  month: string;
  categories: Record<string, number>;
}

// Interface for the props that this component will receive
interface ExpenseTrackerProps {
  expenses: Expense[];
  budgets: Budget | undefined;
  onRefreshData: () => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  budgets,
  onRefreshData,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Corrected totalBudget calculation
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalBudget =
    budgets && budgets.categories
      ? Object.values(budgets.categories).reduce((sum, b) => sum + b, 0)
      : 0;
  const remainingBudget = totalBudget - totalExpenses;

  // Function to handle adding an expense to the backend
  const handleAddExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/data/expenses", expense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // After a successful addition, refresh the data in the parent component
      onRefreshData();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  const deleteExpense = (id: string) => {
    console.log("Deleting expense with id:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroImage}
            alt="Expense tracking illustration"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in">
            Smart Expense Tracking
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            Take control of your finances with intelligent budgeting and expense
            tracking
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-elevated animate-float"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Expense
          </Button>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="max-w-6xl mx-auto px-6 pb-12 -mt-8 relative z-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card shadow-card border-0 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-0 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Budget Remaining
                </p>
                <p className="text-3xl font-bold text-expense-income">
                  ${remainingBudget.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-expense-income/10 rounded-full">
                <DollarSign className="h-6 w-6 text-expense-income" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-0 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Transactions
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {expenses.length}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>
        {/* Budget vs Actual Chart */}
        <div className="mb-8">
          <BudgetVsActualChart expenses={expenses} />
        </div>
        {/* Budget Overview & Category Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BudgetOverview budgets={budgets} expenses={expenses} />{" "}
          {/* This is the corrected line */}
          <CategoryChart expenses={expenses} />
        </div>
        {/* Recent Expenses */}
        <ExpenseList
          expenses={expenses}
          onDeleteExpense={deleteExpense}
          onAddExpense={() => setIsAddModalOpen(true)}
        />
      </main>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
};
