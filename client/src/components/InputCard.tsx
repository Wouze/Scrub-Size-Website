import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gender } from "@/utils/scrubSizeCalculator";
import { User, Ruler, Weight, UserRound, UserCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface InputCardProps {
  gender?: Gender;
  setGender?: (gender: Gender) => void;
  
  // Metric values only
  heightCm: number;
  setHeightCm: (value: number) => void;
  weightKg: number;
  setWeightKg: (value: number) => void;
}

export default function InputCard({
  gender = "male",
  setGender,
  heightCm,
  setHeightCm,
  weightKg,
  setWeightKg
}: InputCardProps) {
  
  const handleHeightCmChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, 120), 220);
    setHeightCm(clampedValue);
  };
  
  const handleWeightKgChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, 30), 200);
    setWeightKg(clampedValue);
  };
  
  return (
    <Card className="shadow-lg border-primary/20 h-full">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center">
            <User className="h-5 w-5 ml-2 text-primary" />
            قياساتك
          </CardTitle>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            النظام المتري
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Gender Selection */}
        {setGender && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ml-2">
                {gender === "male" ? (
                  <UserRound className="h-4 w-4 text-primary" />
                ) : (
                  <UserCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
              <Label className="text-base font-medium">اختر الجنس</Label>
            </div>
            
            <RadioGroup 
              value={gender} 
              onValueChange={(value) => setGender(value as Gender)}
              className="flex gap-4"
            >
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`border-2 rounded-md px-3 py-5 flex flex-col items-center cursor-pointer transition-all ${gender === "male" ? "border-primary bg-primary/5" : "border-muted"}`}
                  onClick={() => setGender("male")}>
                  <UserRound className={`h-8 w-8 mb-2 ${gender === "male" ? "text-primary" : "text-muted-foreground"}`} />
                  <RadioGroupItem value="male" id="male" className="sr-only" />
                  <Label htmlFor="male" className={gender === "male" ? "font-medium text-primary" : ""}>ذكر</Label>
                </div>
              </motion.div>
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`border-2 rounded-md px-3 py-5 flex flex-col items-center cursor-pointer transition-all ${gender === "female" ? "border-primary bg-primary/5" : "border-muted"}`}
                  onClick={() => setGender("female")}>
                  <UserCircle2 className={`h-8 w-8 mb-2 ${gender === "female" ? "text-primary" : "text-muted-foreground"}`} />
                  <RadioGroupItem value="female" id="female" className="sr-only" />
                  <Label htmlFor="female" className={gender === "female" ? "font-medium text-primary" : ""}>أنثى</Label>
                </div>
              </motion.div>
            </RadioGroup>
          </div>
        )}
        
        <div className="space-y-8">
          {/* Height Input - Metric */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ml-2">
                <Ruler className="h-4 w-4 text-primary" />
              </div>
              <div className="flex justify-between w-full items-center">
                <Label className="text-base font-medium">الطول</Label>
                <Badge variant="outline" className="text-xs px-2 py-0 mr-auto">
                  {heightCm} سم
                </Badge>
              </div>
            </div>
            
            <div className="pt-1 px-1">
              <Slider
                min={120}
                max={220}
                step={1}
                value={[heightCm]}
                onValueChange={(values) => handleHeightCmChange(values[0])}
                className="flex-1"
              />
              
              <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                <span>220 سم</span>
                <span>170 سم</span>
                <span>120 سم</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Input
                type="number"
                value={heightCm}
                onChange={(e) => handleHeightCmChange(parseInt(e.target.value) || 0)}
                className="w-20 text-center ml-2"
                min={120}
                max={220}
              />
              <span className="text-muted-foreground">سنتيمتر</span>
            </div>
          </div>
          
          {/* Weight Input - Metric */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ml-2">
                <Weight className="h-4 w-4 text-primary" />
              </div>
              <div className="flex justify-between w-full items-center">
                <Label className="text-base font-medium">الوزن</Label>
                <Badge variant="outline" className="text-xs px-2 py-0 mr-auto">
                  {weightKg} كجم
                </Badge>
              </div>
            </div>
            
            <div className="pt-1 px-1">
              <Slider
                min={30}
                max={200}
                step={1}
                value={[weightKg]}
                onValueChange={(values) => handleWeightKgChange(values[0])}
                className="flex-1"
              />
              
              <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                <span>200 كجم</span>
                <span>115 كجم</span>
                <span>30 كجم</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Input
                type="number"
                value={weightKg}
                onChange={(e) => handleWeightKgChange(parseInt(e.target.value) || 0)}
                className="w-20 text-center ml-2"
                min={30}
                max={200}
              />
              <span className="text-muted-foreground">كيلوجرام</span>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="bg-primary/5 p-4 rounded-lg border border-primary/10 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            من أجل الحصول على أفضل نتيجة، يرجى التأكد من إدخال قياسات دقيقة لطولك ووزنك.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
