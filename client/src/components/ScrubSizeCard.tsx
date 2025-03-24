import { Card } from "@/components/ui/card";
import { ScrubSize, getScrubSizeDescription, getScrubSizeChartText } from "@/utils/scrubSizeCalculator";
import { Badge } from "@/components/ui/badge";
import { ScanSearch, Info, Check, ArrowRight } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface ScrubSizeCardProps {
  scrubSize: ScrubSize;
  gender?: "male" | "female";
  height?: number;
  weight?: number;
}

export default function ScrubSizeCard({ scrubSize, gender = "male", height, weight }: ScrubSizeCardProps) {
  const sizeDescription = getScrubSizeDescription(scrubSize);
  const sizeChartText = getScrubSizeChartText();
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Show feedback buttons after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedbackButtons(true);
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []);
  
  // Function to submit feedback
  const submitFeedback = async (feedbackValue: 'good' | 'bad') => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const parsedHeight = Number(height);
      const parsedWeight = Number(weight);
      console.log('height:', height, 'weight:', weight, typeof height, typeof weight);

    if (!parsedHeight || !parsedWeight) {
      throw new Error('Height and weight must be provided');
        }

      // Get IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();

      // Prepare form data
      const formData = new FormData();
      formData.append('answer', feedbackValue === 'good' ? 'Yes' : 'No');
      formData.append('height', parsedHeight.toString());
      formData.append('weight', parsedWeight.toString());
      formData.append('ip', ipData.ip);
      formData.append('ua', navigator.userAgent);
      formData.append('recommendedSize', scrubSize);
      formData.append('gender', gender);

      // Submit to Google Apps Script
      await fetch('https://script.google.com/macros/s/AKfycbzRQbuxQy-jIkPT6nHj-wLdNj7SKgZnpVIVvB3szYsUTq3ZtziSTslvm7jIo7of4BUImA/exec', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      setFeedback(feedbackValue);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Map English size descriptions to Arabic
  const sizeMapArabic = {
    'XXS': 'صغير جداً جداً',
    'XS': 'صغير جداً',
    'S': 'صغير',
    'M': 'متوسط',
    'L': 'كبير',
    'XL': 'كبير جداً',
    '2XL': 'كبير جداً جداً',
    '3XL': 'كبير جداً جداً جداً'
  };
  
  // Highlight the current size in the chart
  const highlightCurrentSize = (size: string) => {
    return size === scrubSize ? "bg-primary/10 font-medium" : "";
  };
  
  return (
    <Card className="p-6 h-full shadow-lg bg-gradient-to-br from-primary/5 to-[#A259FF]/5 border-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start gap-4">
          <motion.div 
            className="p-3 rounded-full bg-primary/10 text-primary"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--primary), 0.2)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ScanSearch className="w-6 h-6" />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <span>مقاس الزي الطبي الموصى به</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="mr-2 text-gray-400 hover:text-primary">
                      <Info className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent dir="rtl">
                    <p className="max-w-xs">
                      تم حساب توصية المقاس باستخدام طولك ووزنك وصيغة مساحة سطح الجسم المقدرة. الهدف منه هو توفير إرشادات عامة.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            
            <motion.div 
              className="flex items-center mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.3,
                type: "spring",
                stiffness: 200
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge className="text-lg py-1.5 px-3 font-bold bg-primary">
                  {scrubSize}
                </Badge>
              </motion.div>
              <span className="mr-3 text-gray-700">
                {sizeMapArabic[scrubSize as keyof typeof sizeMapArabic] || sizeDescription}
              </span>
            </motion.div>
            
            <motion.p 
              className="text-sm text-gray-600 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              يوصى باستخدام المقاس {sizeMapArabic[scrubSize as keyof typeof sizeMapArabic] || scrubSize} للزي الطبي وفقًا لقياساتك الشخصية
            </motion.p>
            
            <motion.button 
              onClick={() => setShowSizeChart(!showSizeChart)}
              className="text-primary text-sm font-medium hover:underline flex items-center"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {showSizeChart ? 'إخفاء جدول المقاسات' : 'عرض جدول المقاسات'}
              <ArrowRight className="w-4 h-4 mr-1 inline" />
            </motion.button>
            
            {showSizeChart && (
              <motion.div 
                className="mt-4 overflow-x-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  <Badge className="ml-2" variant="outline">
                    جدول مقاسات {gender === "male" ? "الرجال" : "النساء"}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    استنادًا إلى القياسات المعيارية
                  </span>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">المقاس</TableHead>
                      <TableHead>طول الأعلى</TableHead>
                      <TableHead>الكتف</TableHead>
                      <TableHead>الصدر</TableHead>
                      <TableHead>الخصر</TableHead>
                      <TableHead className="hidden md:table-cell">طول البنطلون</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gender === "male" ? (
                      // Male size chart
                      <>
                        <TableRow className={highlightCurrentSize('XS')}>
                          <TableCell className="font-medium">XS</TableCell>
                          <TableCell>66</TableCell>
                          <TableCell>47</TableCell>
                          <TableCell>107</TableCell>
                          <TableCell>82</TableCell>
                          <TableCell className="hidden md:table-cell">99</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('S')}>
                          <TableCell className="font-medium">S</TableCell>
                          <TableCell>68.5</TableCell>
                          <TableCell>48.5</TableCell>
                          <TableCell>112</TableCell>
                          <TableCell>84</TableCell>
                          <TableCell className="hidden md:table-cell">100</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('M')}>
                          <TableCell className="font-medium">M</TableCell>
                          <TableCell>71</TableCell>
                          <TableCell>50</TableCell>
                          <TableCell>117</TableCell>
                          <TableCell>86</TableCell>
                          <TableCell className="hidden md:table-cell">101</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('L')}>
                          <TableCell className="font-medium">L</TableCell>
                          <TableCell>73.5</TableCell>
                          <TableCell>51.5</TableCell>
                          <TableCell>122</TableCell>
                          <TableCell>88</TableCell>
                          <TableCell className="hidden md:table-cell">102</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('XL')}>
                          <TableCell className="font-medium">XL</TableCell>
                          <TableCell>76</TableCell>
                          <TableCell>53</TableCell>
                          <TableCell>127</TableCell>
                          <TableCell>90</TableCell>
                          <TableCell className="hidden md:table-cell">103</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('2XL')}>
                          <TableCell className="font-medium">2XL</TableCell>
                          <TableCell>78.5</TableCell>
                          <TableCell>54.5</TableCell>
                          <TableCell>132</TableCell>
                          <TableCell>92</TableCell>
                          <TableCell className="hidden md:table-cell">104</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('3XL')}>
                          <TableCell className="font-medium">3XL</TableCell>
                          <TableCell>81</TableCell>
                          <TableCell>56</TableCell>
                          <TableCell>137</TableCell>
                          <TableCell>94</TableCell>
                          <TableCell className="hidden md:table-cell">105</TableCell>
                        </TableRow>
                      </>
                    ) : (
                      // Female size chart
                      <>
                        <TableRow className={highlightCurrentSize('XXS')}>
                          <TableCell className="font-medium">XXS</TableCell>
                          <TableCell>62.5</TableCell>
                          <TableCell>42.5</TableCell>
                          <TableCell>97</TableCell>
                          <TableCell>80</TableCell>
                          <TableCell className="hidden md:table-cell">95</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('XS')}>
                          <TableCell className="font-medium">XS</TableCell>
                          <TableCell>65</TableCell>
                          <TableCell>44</TableCell>
                          <TableCell>102</TableCell>
                          <TableCell>82</TableCell>
                          <TableCell className="hidden md:table-cell">96</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('S')}>
                          <TableCell className="font-medium">S</TableCell>
                          <TableCell>67.5</TableCell>
                          <TableCell>45.5</TableCell>
                          <TableCell>107</TableCell>
                          <TableCell>84</TableCell>
                          <TableCell className="hidden md:table-cell">97</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('M')}>
                          <TableCell className="font-medium">M</TableCell>
                          <TableCell>70</TableCell>
                          <TableCell>47</TableCell>
                          <TableCell>112</TableCell>
                          <TableCell>86</TableCell>
                          <TableCell className="hidden md:table-cell">98</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('L')}>
                          <TableCell className="font-medium">L</TableCell>
                          <TableCell>72.5</TableCell>
                          <TableCell>48.5</TableCell>
                          <TableCell>117</TableCell>
                          <TableCell>88</TableCell>
                          <TableCell className="hidden md:table-cell">99</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('XL')}>
                          <TableCell className="font-medium">XL</TableCell>
                          <TableCell>75</TableCell>
                          <TableCell>50</TableCell>
                          <TableCell>122</TableCell>
                          <TableCell>90</TableCell>
                          <TableCell className="hidden md:table-cell">100</TableCell>
                        </TableRow>
                        <TableRow className={highlightCurrentSize('2XL')}>
                          <TableCell className="font-medium">2XL</TableCell>
                          <TableCell>77.5</TableCell>
                          <TableCell>51.5</TableCell>
                          <TableCell>127</TableCell>
                          <TableCell>92</TableCell>
                          <TableCell className="hidden md:table-cell">101</TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
                
                <p className="mt-3 text-xs text-gray-500">
                  جميع القياسات بالسنتيمتر. طول الأعلى: من الكتف إلى الأسفل. طول البنطلون: من الخصر إلى الكاحل.
                </p>
              </motion.div>
            )}

            <motion.div 
              className="mt-6 flex items-center justify-start gap-4 flex-wrap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-center justify-center bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Check className="h-4 w-4 ml-1" />
                <span className="text-sm font-medium"> وش رايك بالنتيجة؟</span>
              </div>

              {!feedback && showFeedbackButtons && (
                <motion.div 
                  className="flex gap-2 flex-wrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.button
                    onClick={() => submitFeedback('good')}
                    disabled={isSubmitting}
                    className={`flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full hover:bg-green-200 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    <Check className="h-4 w-4 ml-1" />
                    <span className="text-sm font-medium">المقاس مناسب</span>
                  </motion.button>

                  <motion.button
                    onClick={() => submitFeedback('bad')}
                    disabled={isSubmitting}
                    className={`flex items-center justify-center bg-red-100 text-red-700 px-4 py-2 rounded-full hover:bg-red-200 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    <span className="text-sm font-medium">المقاس غير مناسب</span>
                  </motion.button>
                </motion.div>
              )}

              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500"
                >
                  جاري إرسال تقييمك...
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}

              {feedback === 'good' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full"
                >
                  <Check className="h-4 w-4 ml-1" />
                  <span className="text-sm font-medium">شكراً لتأكيد المقاس المناسب</span>
                </motion.div>
              )}

              {feedback === 'bad' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center bg-red-100 text-red-700 px-4 py-2 rounded-full"
                >
                  <span className="text-sm font-medium">نأسف لعدم مناسبة المقاس</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
}


