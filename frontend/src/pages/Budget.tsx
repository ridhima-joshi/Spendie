import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UserPreferences {
  paymentMethods: string[];
  expenseCategories: string[];
}

export const Budget = () => {
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<UserPreferences>(
          "/api/data/preferences",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserCategories(response.data.expenseCategories);
      } catch (err) {
        console.error("Failed to fetch user categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleBudgetChange = (category: string, amount: string) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [category]: parseFloat(amount) || 0,
    }));
  };

  const handleSaveBudgets = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
      await axios.post(
        "/api/data/budgets",
        { month: currentMonth, categories: budgets },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Success!",
        description: "Budgets saved successfully.",
      });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error saving budgets",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Set Your Monthly Budget
        </h1>
        <Card className="p-8 bg-gradient-card shadow-elevated border-0">
          <div className="space-y-6">
            {userCategories.length > 0 ? (
              userCategories.map((category) => (
                <div key={category} className="flex items-center space-x-4">
                  <Label
                    htmlFor={category}
                    className="flex-1 text-lg font-medium"
                  >
                    {category}
                  </Label>
                  <Input
                    id={category}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={budgets[category] || ""}
                    onChange={(e) =>
                      handleBudgetChange(category, e.target.value)
                    }
                    className="w-32"
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No categories found. Please complete onboarding first.
              </p>
            )}
            <Button
              onClick={handleSaveBudgets}
              className="w-full text-lg font-medium"
              size="lg"
            >
              Save Budgets
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
