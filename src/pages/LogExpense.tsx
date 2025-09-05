import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, DollarSign } from "lucide-react";
import axios from "axios";

interface UserPreferences {
  paymentMethods: string[];
  expenseCategories: string[];
}

interface ExpenseData {
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
}

export const LogExpense = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [userPaymentMethods, setUserPaymentMethods] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user preferences from the backend
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<UserPreferences>(
          "/api/data/preferences",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserCategories(response.data.expenseCategories);
        setUserPaymentMethods(response.data.paymentMethods);
      } catch (err) {
        console.error("Failed to fetch user preferences:", err);
      }
    };
    fetchPreferences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const expenseData: ExpenseData = {
      amount: numAmount,
      category,
      paymentMethod, // <-- This is the crucial line
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/data/expenses", expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Success",
        description: "Expense logged successfully!",
      });

      // Reset form
      setAmount("");
      setCategory("");
      setPaymentMethod("");

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast({
        title: "Error logging expense",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Log Daily Expense</h1>
            <p className="text-white/80 mt-1">Track your spending for today</p>
          </div>
        </div>

        {/* Expense Form */}
        <Card className="p-8 bg-gradient-card shadow-elevated border-0">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Add New Expense
              </h2>
              <p className="text-muted-foreground">
                Enter your expense details below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Field */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg h-12"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select expense category" />
                </SelectTrigger>
                <SelectContent>
                  {userCategories.length > 0 ? (
                    userCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="other">
                      No categories found - complete onboarding first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-sm font-medium">
                Payment Method <span className="text-destructive">*</span>
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {userPaymentMethods.length > 0 ? (
                    userPaymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="cash">
                      No payment methods found - complete onboarding first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg font-medium"
              size="lg"
            >
              Log Expense
            </Button>
          </form>

          {/* Help Text */}
          {(userCategories.length === 0 || userPaymentMethods.length === 0) && (
            <div className="mt-6 p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                It looks like you haven't completed onboarding yet.
                <Button
                  variant="link"
                  className="p-0 h-auto ml-1"
                  onClick={() => navigate("/onboarding")}
                >
                  Complete onboarding
                </Button>
                to set up your categories and payment methods.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
