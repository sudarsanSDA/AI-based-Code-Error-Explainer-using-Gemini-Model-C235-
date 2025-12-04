export enum SupportedLanguage {
  PYTHON = 'python',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  JAVA = 'java',
  C = 'c',
  CPP = 'cpp',
  GO = 'go',
  RUST = 'rust',
  SQL = 'sql',
}

export interface AnalysisResponse {
  summary: string;
  errorType: string;
  detailedExplanation: string;
  technicalDetails: string; // New field for deeper technical breakdown
  correctedCode: string;
  bestPractices?: string[];
  complexity?: {            // New field for Big O notation
    time: string;
    space: string;
  };
}

export interface CodeSnippet {
  language: SupportedLanguage;
  code: string;
}

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  [SupportedLanguage.PYTHON]: 'Python',
  [SupportedLanguage.JAVASCRIPT]: 'JavaScript',
  [SupportedLanguage.TYPESCRIPT]: 'TypeScript',
  [SupportedLanguage.JAVA]: 'Java',
  [SupportedLanguage.C]: 'C',
  [SupportedLanguage.CPP]: 'C++',
  [SupportedLanguage.GO]: 'Go',
  [SupportedLanguage.RUST]: 'Rust',
  [SupportedLanguage.SQL]: 'SQL',
};

export const DEFAULT_SNIPPETS: Record<SupportedLanguage, string> = {
  [SupportedLanguage.PYTHON]: `def calculate_average(numbers):
    total = sum(numbers)
    # Error: Using len() on an integer if numbers is not a list, or generic division by zero risk
    return total / len(numbers)

print(calculate_average([]))`,
  [SupportedLanguage.JAVASCRIPT]: `function greet(name) {
  if (name = "Alice") { // Error: Assignment instead of comparison
    console.log("Hello, Alice!");
  }
}`,
  [SupportedLanguage.TYPESCRIPT]: `interface User {
  id: number;
  name: string;
}

const user: User = {
  id: "123", // Error: Type mismatch
  name: "Bob"
};`,
  [SupportedLanguage.JAVA]: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3};
        // Error: Array index out of bounds
        System.out.println(numbers[3]);
    }
}`,
  [SupportedLanguage.C]: `#include <stdio.h>

int main() {
    int x = 10;
    int *ptr = NULL;
    // Error: Dereferencing a null pointer
    printf("%d", *ptr);
    return 0;
}`,
  [SupportedLanguage.CPP]: `#include <iostream>

int main() {
    int* ptr = new int(10);
    delete ptr;
    // Error: Use after free
    *ptr = 20; 
    return 0;
}`,
  [SupportedLanguage.GO]: `package main
import "fmt"

func main() {
    var m map[string]int
    // Error: Assignment to entry in nil map
    m["key"] = 1
    fmt.Println(m)
}`,
  [SupportedLanguage.RUST]: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    // Error: Borrow of moved value
    println!("{}, world!", s1); 
}`,
  [SupportedLanguage.SQL]: `SELECT name, COUNT(*) 
FROM users 
WHERE age > 18
-- Error: Missing GROUP BY
`,
};