export type ScrubSize = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';
export type Gender = 'male' | 'female';

interface ScrubSizeParams {
  gender: Gender;
  unitSystem: "metric"; // Only metric system is supported now
  heightCm: number;
  weightKg: number;
  heightFeet: number;  // Kept for backward compatibility
  heightInches: number;  // Kept for backward compatibility
  weightLbs: number;  // Kept for backward compatibility
}

// Define the size charts based on the provided reference
interface SizeChart {
  topLength: number;
  shoulder: number;
  chest: number;
  sleeveLength: number;
  sleeveBottom: number;
  pantsLength: number;
  waist: number;
  thigh: number;
  pantsBottom: number;
}

// Male size chart (in cm)
const maleSizeChart: Record<ScrubSize, SizeChart> = {
  'XXS': { topLength: 0, shoulder: 0, chest: 0, sleeveLength: 0, sleeveBottom: 0, pantsLength: 0, waist: 0, thigh: 0, pantsBottom: 0 }, // Not in reference chart
  'XS': { topLength: 66, shoulder: 47, chest: 107, sleeveLength: 21, sleeveBottom: 36, pantsLength: 99, waist: 82, thigh: 66, pantsBottom: 38 },
  'S': { topLength: 68.5, shoulder: 48.5, chest: 112, sleeveLength: 22, sleeveBottom: 37, pantsLength: 100, waist: 84, thigh: 68, pantsBottom: 38 },
  'M': { topLength: 71, shoulder: 50, chest: 117, sleeveLength: 23, sleeveBottom: 38, pantsLength: 101, waist: 86, thigh: 70, pantsBottom: 38 },
  'L': { topLength: 73.5, shoulder: 51.5, chest: 122, sleeveLength: 24, sleeveBottom: 39, pantsLength: 102, waist: 88, thigh: 72, pantsBottom: 40 },
  'XL': { topLength: 76, shoulder: 53, chest: 127, sleeveLength: 25, sleeveBottom: 40, pantsLength: 103, waist: 90, thigh: 74, pantsBottom: 40 },
  '2XL': { topLength: 78.5, shoulder: 54.5, chest: 132, sleeveLength: 26, sleeveBottom: 41, pantsLength: 104, waist: 92, thigh: 76, pantsBottom: 40 },
  '3XL': { topLength: 81, shoulder: 56, chest: 137, sleeveLength: 27, sleeveBottom: 42, pantsLength: 105, waist: 94, thigh: 78, pantsBottom: 40 }
};

// Female size chart (in cm)
const femaleSizeChart: Record<ScrubSize, SizeChart> = {
  'XXS': { topLength: 62.5, shoulder: 42.5, chest: 97, sleeveLength: 17, sleeveBottom: 33, pantsLength: 95, waist: 80, thigh: 64, pantsBottom: 38 },
  'XS': { topLength: 65, shoulder: 44, chest: 102, sleeveLength: 18, sleeveBottom: 34, pantsLength: 96, waist: 82, thigh: 66, pantsBottom: 38 },
  'S': { topLength: 67.5, shoulder: 45.5, chest: 107, sleeveLength: 19, sleeveBottom: 35, pantsLength: 97, waist: 84, thigh: 68, pantsBottom: 38 },
  'M': { topLength: 70, shoulder: 47, chest: 112, sleeveLength: 20, sleeveBottom: 36, pantsLength: 98, waist: 86, thigh: 70, pantsBottom: 40 },
  'L': { topLength: 72.5, shoulder: 48.5, chest: 117, sleeveLength: 21, sleeveBottom: 37, pantsLength: 99, waist: 88, thigh: 72, pantsBottom: 40 },
  'XL': { topLength: 75, shoulder: 50, chest: 122, sleeveLength: 22, sleeveBottom: 38, pantsLength: 100, waist: 90, thigh: 74, pantsBottom: 40 },
  '2XL': { topLength: 77.5, shoulder: 51.5, chest: 127, sleeveLength: 23, sleeveBottom: 39, pantsLength: 101, waist: 92, thigh: 76, pantsBottom: 40 },
  '3XL': { topLength: 0, shoulder: 0, chest: 0, sleeveLength: 0, sleeveBottom: 0, pantsLength: 0, waist: 0, thigh: 0, pantsBottom: 0 } // Not in reference chart
};

export function calculateScrubSize({
  gender,
  heightCm,
  weightKg
}: ScrubSizeParams): ScrubSize {
  // Use metric measurements directly
  const height = heightCm;
  const weight = weightKg;
  
  // Calculate chest size estimation based on height and weight
  // This is a simplified estimation algorithm using correlation between body measurements
  let estimatedChest: number;
  
  if (gender === 'male') {
    // For males: estimate chest circumference using height and weight correlation
    estimatedChest = (height * 0.35) + (weight * 0.5) + 20;
    
    // Find the closest size match in the male chart based on chest measurement
    if (estimatedChest < 107) return 'XS';
    if (estimatedChest < 112) return 'S';
    if (estimatedChest < 116) return 'M';
    if (estimatedChest < 122) return 'L';
    if (estimatedChest < 127) return 'XL';
    if (estimatedChest < 132) return '2XL';
    return '3XL';
  } else {
    // For females: estimate chest circumference using height and weight correlation
    // Female chest estimation uses slightly different factors
    estimatedChest = (height * 0.33) + (weight * 0.45) + 18;
    
    // Find the closest size match in the female chart based on chest measurement
    if (estimatedChest < 97) return 'XXS';
    if (estimatedChest < 102) return 'XS';
    if (estimatedChest < 107) return 'S';
    if (estimatedChest < 112) return 'M';
    if (estimatedChest < 117) return 'L';
    if (estimatedChest < 122) return 'XL';
    return '2XL';
  }
}

export function getScrubSizeDescription(size: ScrubSize): string {
  switch (size) {
    case 'XXS': return 'صغير جداً جداً';
    case 'XS': return 'صغير جداً';
    case 'S': return 'صغير';
    case 'M': return 'متوسط';
    case 'L': return 'كبير';
    case 'XL': return 'كبير جداً';
    case '2XL': return 'كبير جداً جداً';
    case '3XL': return 'كبير جداً جداً جداً';
  }
}

export function getScrubSizeChartText(): string {
  return "مقاسات الأزياء الطبية تقريبية وقد تختلف بين الشركات المصنعة. للحصول على أفضل النتائج، تحقق من جداول المقاسات الخاصة بالعلامة التجارية عند توفرها.";
}