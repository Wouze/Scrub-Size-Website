import { useState } from "react";
import InputCard from "./InputCard";
import ScrubSizeCard from "./ScrubSizeCard";
import { calculateScrubSize, Gender } from "@/utils/scrubSizeCalculator";
import { Shirt, RulerIcon, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export type UnitSystem = "metric";
const brandName = "سوار";

export default function ScrubSizeCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  
  // Metric values only
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  
  // Calculate recommended scrub size using metric only
  const scrubSize = calculateScrubSize({
    gender,
    unitSystem: "metric",
    heightCm,
    weightKg,
    heightFeet: 0,  // These values won't be used but are still required by the function
    heightInches: 0,
    weightLbs: 0
  });
  
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with company logo */}
        <div className="flex justify-center items-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            {/* <img src="/images/saddl-logo.png" alt="{brandName}" className="h-14" /> */}
            <img src="https://cdn.salla.sa/DpwDl/okDKFrycOfte1tTXcCOZ40zi8mKet8bl0K5NOLPz.png" alt="{brandName}" className="h-14" />
            <h2 className="text-2xl font-bold text-primary mr-2">{brandName}</h2>
          </motion.div>
        </div>
        
        {/* Main title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shirt className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#A259FF]">
            مساعد مقاسات الزي الطبي
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            اعثر على مقاس الزي الطبي المناسب من {brandName} باستخدام حاسبة المقاسات المتخصصة
          </p>
          
          <div className="flex items-center justify-center mt-8 mb-2 text-sm text-muted-foreground">
            <span>أدخل قياساتك أدناه للحصول على توصية مخصصة</span>
            <RulerIcon className="h-4 w-4 mr-2" />
          </div>
        </div>
        
        {/* Cards with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:order-2">
            <InputCard
              gender={gender}
              setGender={setGender}
              heightCm={heightCm}
              setHeightCm={setHeightCm}
              weightKg={weightKg}
              setWeightKg={setWeightKg}
            />
          </div>
          
          <div className="md:order-1">
            <ScrubSizeCard 
              scrubSize={scrubSize} 
              gender={gender} 
              height={heightCm}
              weight={weightKg}
            />
          </div>
        </div>
        
        {/* Shop Link */}
        <div className="text-center mt-10">
          <motion.a 
            href="https://sddlsa.com/ar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag className="h-5 w-5 ml-2" />
            متابعة التسوق في موقع {brandName}
          </motion.a>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>للإشارة فقط. قد تختلف النتائج حسب العلامة التجارية وتفضيلات النمط.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} {brandName}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
}
