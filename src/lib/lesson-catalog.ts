export const LESSON_CATALOG = [
  { unit: 1, title: "Ratio, Proportion and Their Properties", pageStart: 4, pageEnd: 8, color: "blue" },
  { unit: 1, title: "Direct Variation", pageStart: 9, pageEnd: 12, color: "teal" },
  { unit: 1, title: "Inverse Variation", pageStart: 13, pageEnd: 16, color: "coral" },
  { unit: 1, title: "Similarity of Polygons", pageStart: 17, pageEnd: 24, color: "gold" },
  { unit: 1, title: "Similarity of Triangles", pageStart: 25, pageEnd: 33, color: "mint" },
  { unit: 2, title: "Directed Angle", pageStart: 35, pageEnd: 41, color: "blue" },
  { unit: 2, title: "Degree Measure and Radian Measure of an Angle", pageStart: 42, pageEnd: 49, color: "teal" },
  { unit: 2, title: "Circular Sector and Circular Segment", pageStart: 50, pageEnd: 56, color: "coral" },
  { unit: 3, title: "Complex Numbers", pageStart: 60, pageEnd: 64, color: "gold" },
  { unit: 3, title: "Addition and Subtraction of Complex Numbers", pageStart: 65, pageEnd: 68, color: "mint" },
  { unit: 3, title: "Multiplication of Complex Numbers and Conjugates", pageStart: 69, pageEnd: 74, color: "blue" },
  { unit: 3, title: "Types of Roots of a Quadratic Equation", pageStart: 75, pageEnd: 78, color: "teal" },
] as const;

export const UNIT_TITLES: Record<number, string> = {
  1: "Ratio and Similarity",
  2: "Degree and Radian Measure",
  3: "Complex Numbers and Quadratic Equations",
};