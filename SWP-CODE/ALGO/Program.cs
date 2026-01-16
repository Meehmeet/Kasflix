using System;
using System.Collections.Generic;
using System.IO;
using System.Diagnostics;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            string filePath = "../unsortierte_zahlen.txt";

            // Kommandozeilenargument lesen
            string algorithm = args.Length > 0 ? args[0].ToLower() : "all";

            // Textdatei einlesen
            List<int> numbers = ReadNumbers(filePath);

            Console.WriteLine("Original Daten:");
            Console.WriteLine($"Anzahl der Zahlen: {numbers.Count}");
            Console.WriteLine();

            Stopwatch sw = new Stopwatch();

            if (algorithm == "bubble")
            {
                sw.Start();
                BubbleSort(numbers);
                sw.Stop();
                Console.WriteLine("\n=== BUBBLESORT ===");
                PrintAllNumbers(numbers);
                Console.WriteLine($"\nZeit: {sw.Elapsed.TotalSeconds:F6} Sekunden");
            }
            else if (algorithm == "quick")
            {
                sw.Start();
                QuickSort(numbers, 0, numbers.Count - 1);
                sw.Stop();
                Console.WriteLine("\n=== QUICKSORT ===");
                PrintAllNumbers(numbers);
                Console.WriteLine($"\nZeit: {sw.Elapsed.TotalSeconds:F6} Sekunden");
            }
            else if (algorithm == "insert")
            {
                sw.Start();
                InsertSort(numbers);
                sw.Stop();
                Console.WriteLine("\n=== INSERTSORT ===");
                PrintAllNumbers(numbers);
                Console.WriteLine($"\nZeit: {sw.Elapsed.TotalSeconds:F6} Sekunden");
            }
            else
            {
                Console.WriteLine("Bitte wählen Sie: bubble, quick oder insert");
            }
        }

        // Textdatei einlesen
        static List<int> ReadNumbers(string path)
        {
            List<int> numbers = new List<int>();

            try
            {
                if (File.Exists(path))
                {
                    string content = File.ReadAllText(path);
                    string[] values = content.Split(new char[] { ',', ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries);

                    foreach (string value in values)
                    {
                        if (int.TryParse(value.Trim(), out int number))
                        {
                            numbers.Add(number);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fehler beim Lesen der Datei: {ex.Message}");
            }

            return numbers;
        }

        // Bubblesort Algorithmus
        static void BubbleSort(List<int> arr)
        {
            int n = arr.Count;
            Console.WriteLine("Sortiere mit Bubblesort...");

            for (int i = 0; i < n - 1; i++)
            {
                if (n > 10 && i % Math.Max(1, (n - 1) / 10) == 0)
                {
                    int progress = (int)((double)i / (n - 1) * 100);
                    Console.Write($"\rFortschritt: {progress}%");
                }

                for (int j = 0; j < n - i - 1; j++)
                {
                    if (arr[j] > arr[j + 1])
                    {
                        int temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }

            if (n > 10) Console.WriteLine("\rFortschritt: 100%");
            Console.WriteLine("Sortierung abgeschlossen!");
        }

        // Quicksort Algorithmus
        static void QuickSort(List<int> arr, int low, int high)
        {
            if (low == 0 && high == arr.Count - 1)
            {
                Console.WriteLine("Sortiere mit Quicksort...");
            }

            if (low < high)
            {
                int pivotIndex = Partition(arr, low, high);
                QuickSort(arr, low, pivotIndex - 1);
                QuickSort(arr, pivotIndex + 1, high);
            }

            if (low == 0 && high == arr.Count - 1)
            {
                Console.WriteLine("Sortierung abgeschlossen!");
            }
        }

        static int Partition(List<int> arr, int low, int high)
        {
            int pivot = arr[high];
            int i = low - 1;

            for (int j = low; j < high; j++)
            {
                if (arr[j] < pivot)
                {
                    i++;
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }

            int temp2 = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp2;

            return i + 1;
        }

        // Insertsort Algorithmus
        static void InsertSort(List<int> arr)
        {
            int n = arr.Count;
            Console.WriteLine("Sortiere mit Insertsort...");

            for (int i = 1; i < n; i++)
            {
                if (n > 10 && i % Math.Max(1, n / 10) == 0)
                {
                    int progress = (int)((double)i / n * 100);
                    Console.Write($"\rFortschritt: {progress}%");
                }

                int key = arr[i];
                int j = i - 1;

                while (j >= 0 && arr[j] > key)
                {
                    arr[j + 1] = arr[j];
                    j--;
                }
                arr[j + 1] = key;
            }

            if (n > 10) Console.WriteLine("\rFortschritt: 100%");
            Console.WriteLine("Sortierung abgeschlossen!");
        }

        // Alle Zahlen ausgeben
        static void PrintAllNumbers(List<int> arr)
        {
            Console.WriteLine("Sortierte Zahlen:");
            foreach (int num in arr)
            {
                Console.WriteLine(num);
            }
        }
    }
}
