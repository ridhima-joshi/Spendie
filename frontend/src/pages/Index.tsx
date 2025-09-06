import { ExpenseTracker } from "@/components/ExpenseTracker";
import { useState, useEffect } from "react";
import axios from "axios";

// This interface must match the one in ExpenseTracker.tsx
interface Expense {
  id: string; // The backend's _id
  amount: number;
  category: string;
  date: string;
  description: string;
  paymentMethod: string; // <-- Add this property
}

interface Budget {
  month: string;
  categories: Record<string, number>;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget>();
  const [loading, setLoading] = useState(true);

  // Define the data-fetching function outside of useEffect
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const expensesResponse = await axios.get<any[]>("/api/data/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const budgetsResponse = await axios.get<Budget>("/api/data/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map the fetched data to match the Expense interface
      const formattedExpenses = expensesResponse.data.map((exp) => ({
        id: exp._id,
        amount: exp.amount,
        category: exp.category,
        date: exp.date,
        description: exp.description || "", // Get description from backend or set as empty string
        paymentMethod: exp.paymentMethod, // <-- Add this line
      }));

      setExpenses(formattedExpenses);
      setBudgets(budgetsResponse.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call the function when the component mounts
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <ExpenseTracker
      expenses={expenses}
      budgets={budgets}
      onRefreshData={fetchData}
    />
  );
};

export default Index;
