import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  X,
  ArrowRight,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import axios from "axios";

const SUGGESTED_PAYMENT_METHODS = [
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "card", label: "Credit/Debit Card", icon: CreditCard },
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "netbanking", label: "Net Banking", icon: CreditCard },
  { value: "wallet", label: "Digital Wallet", icon: Smartphone },
];

const SUGGESTED_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Groceries",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Education",
  "Travel",
  "Subscriptions",
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [customPayment, setCustomPayment] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({}); // New state for budgets

  const addPaymentMethod = (method: string) => {
    if (!paymentMethods.includes(method)) {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const removePaymentMethod = (method: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m !== method));
  };

  const addCustomPayment = () => {
    if (
      customPayment.trim() &&
      !paymentMethods.includes(customPayment.trim())
    ) {
      setPaymentMethods([...paymentMethods, customPayment.trim()]);
      setCustomPayment("");
    }
  };

  const addExpenseCategory = (category: string) => {
    if (!expenseCategories.includes(category)) {
      setExpenseCategories([...expenseCategories, category]);
      setBudgets((prevBudgets) => ({ ...prevBudgets, [category]: 0 })); // Initialize budget for new category
    }
  };

  const removeExpenseCategory = (category: string) => {
    setExpenseCategories(expenseCategories.filter((c) => c !== category));
    setBudgets((prevBudgets) => {
      const { [category]: removed, ...rest } = prevBudgets;
      return rest;
    });
  };

  const addCustomCategory = () => {
    if (
      customCategory.trim() &&
      !expenseCategories.includes(customCategory.trim())
    ) {
      setExpenseCategories([...expenseCategories, customCategory.trim()]);
      setBudgets((prevBudgets) => ({
        ...prevBudgets,
        [customCategory.trim()]: 0,
      }));
      setCustomCategory("");
    }
  };

  const handleBudgetChange = (category: string, amount: string) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [category]: parseFloat(amount) || 0,
    }));
  };

  const handleComplete = async () => {
    if (paymentMethods.length === 0 || expenseCategories.length === 0) {
      toast({
        title: "Please complete setup",
        description:
          "Select at least one payment method and one expense category",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/data/preferences",
        { paymentMethods, expenseCategories, budgets }, // <-- Ensure 'budgets' is included here
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Setup complete!",
        description: "Your preferences have been saved successfully",
      });

      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error saving preferences",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Let's personalize your experience
          </h1>
          <p className="text-xl text-white/90 animate-fade-in">
            Tell us about your spending habits to get started
          </p>
        </div>

        <div className="space-y-8">
          {/* Payment Methods Section */}
          <Card className="p-8 bg-gradient-card shadow-elevated border-0 animate-slide-up">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              What payment methods do you use?
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUGGESTED_PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethods.includes(method.value);

                  return (
                    <Button
                      key={method.value}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() =>
                        isSelected
                          ? removePaymentMethod(method.value)
                          : addPaymentMethod(method.value)
                      }
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">
                        {method.label}
                      </span>
                    </Button>
                  );
                })}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom payment method"
                  value={customPayment}
                  onChange={(e) => setCustomPayment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomPayment()}
                  className="flex-1"
                />
                <Button onClick={addCustomPayment} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {paymentMethods.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {paymentMethods.map((method) => (
                    <Badge
                      key={method}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {method}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-auto p-0 hover:bg-transparent"
                        onClick={() => removePaymentMethod(method)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Expense Categories Section */}
          <Card className="p-8 bg-gradient-card shadow-elevated border-0 animate-slide-up">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              What are your most common expense categories?
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SUGGESTED_CATEGORIES.map((category) => {
                  const isSelected = expenseCategories.includes(category);

                  return (
                    <Button
                      key={category}
                      variant={isSelected ? "default" : "outline"}
                      className={`justify-center ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() =>
                        isSelected
                          ? removeExpenseCategory(category)
                          : addExpenseCategory(category)
                      }
                    >
                      {category}
                    </Button>
                  );
                })}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomCategory()}
                  className="flex-1"
                />
                <Button onClick={addCustomCategory} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {expenseCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {expenseCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {category}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-auto p-0 hover:bg-transparent"
                        onClick={() => removeExpenseCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Budget Section */}
          {expenseCategories.length > 0 && (
            <Card className="p-8 bg-gradient-card shadow-elevated border-0 animate-slide-up">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Set your monthly budget
              </h2>
              <div className="space-y-4">
                {expenseCategories.map((category) => (
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
                ))}
              </div>
            </Card>
          )}

          {/* Complete Button */}
          <div className="text-center">
            <Button
              onClick={handleComplete}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-elevated px-8"
            >
              Complete Setup
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
