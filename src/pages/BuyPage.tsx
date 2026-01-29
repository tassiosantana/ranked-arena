import { useState, useEffect } from "react";
import { BuyMenu } from "@/components/game/BuyMenu";
import { useNavigate } from "react-router-dom";

export default function BuyPage() {
  const navigate = useNavigate();
  const [money, setMoney] = useState(1200);
  const [timeLeft, setTimeLeft] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBuy = (item: { price: number }) => {
    setMoney((prev) => prev - item.price);
  };

  return (
    <BuyMenu
      money={money}
      timeLeft={timeLeft}
      onBuy={handleBuy}
      onClose={() => navigate("/")}
    />
  );
}
