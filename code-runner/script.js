const LAMBDA_URL = "https://ofrbuv645u5yajnxuottfvly640uhzlu.lambda-url.ap-southeast-2.on.aws/"

const languages = {
  71: {
    // PYTHON
    name: "Python (3.12.0)",
    monaco: "python",
    sample: `import sys

print("Hello, World!")

name = (sys.stdin.readline() or "").strip() or "Guest"
print(f"Hello, {name}!\\n")

nums = []
for line in sys.stdin:
    line = line.strip()
    if not line:
        break
    for tok in line.split():
        try:
            nums.append(int(tok))
        except ValueError:
            pass

print("Numbers Entered:", nums if nums else "[]")
if nums:
    total = sum(nums)
    count = len(nums)
    avg = total / count
    print("\\nCount:", count)
    print("Sum:", total)
    print("Average:", f"{avg:.2f}")
    print("Min:", min(nums))
    print("Max:", max(nums))
else:
    print("No numbers provided.")`,
    stdinSample: `Alice
10 20 30
40 50 120
60 70 80 90 100

`,
    extension: "py",
  },

  92: {
    // PYTHON ML
    name: "Python for ML (3.8.1)",
    monaco: "python",
    sample: `import sys
from collections import Counter

print("Hello, World!")

name = (sys.stdin.readline() or "").strip() or "Guest"
print(f"Hello, {name}!")

tokens = []
for line in sys.stdin:
    line = line.strip()
    if not line:
        break
    tokens.extend(line.split())

nums = []
for t in tokens:
    try:
        nums.append(float(t))
    except ValueError:
        pass

if not nums:
    print("No data")
    raise SystemExit

nums.sort()
n = len(nums)
mean = sum(nums) / n
median = nums[n//2] if n % 2 == 1 else (nums[n//2 - 1] + nums[n//2]) / 2
freq = Counter(nums).most_common()
mode_val = freq[0][0] if freq else None

print("\\nNumbers Entered:", nums)
print("\\nCount:", n)
print("Mean:", f"{mean:.2f}")
print("Median:", f"{median:.2f}")
print("Mode:", mode_val)`,
    stdinSample: `Gehlee
1 2 2 3 3 3 4 4 5
5 5 6 7 8 9
10 10 10 11 12

`,
    extension: "py",
  },

  63: {
    // JAVASCRIPT
    name: "JavaScript (Node.js 12.14.0)",
    monaco: "javascript",
    sample: `const fs = require("fs");

console.log("Hello, World!");

// Read all input lines
const lines = fs.readFileSync(0, "utf8").split(/\\r?\\n/);

// --- Simple Greeting ---
const name = (lines[0] || "").trim() || "Guest";
console.log(\`Hello, \${name}!\`);

// --- Ask operation ---
console.log("\\nWhat would you choose?");
console.log("Options: sum | avg | min | max");

const op = (lines[1] || "sum").trim().toLowerCase();
console.log("You chose:", op);

// --- Ask numbers ---
console.log("\\nInput your numbers separated by space :)");

let nums = [];
for (let i = 2; i < lines.length; i++) {
  const line = (lines[i] || "").trim();
  if (!line) break;
  for (const tok of line.split(/\\s+/)) {
    const v = Number(tok);
    if (Number.isFinite(v)) nums.push(v);
  }
}

if (!nums.length) {
  console.log("No numbers entered.");
  process.exit(0);
}

// Echo numbers entered
console.log("You entered:", nums.join(" "));

// --- Compute ---
let out = null;
if (op === "sum") out = nums.reduce((a, b) => a + b, 0);
else if (op === "avg") out = nums.reduce((a, b) => a + b, 0) / nums.length;
else if (op === "min") out = Math.min(...nums);
else if (op === "max") out = Math.max(...nums);
else out = "Unknown operation";

// --- Results ---
console.log("\\nOperation:", op);
console.log("Count:", nums.length);
console.log("Result:", typeof out === "number" ? Number(out.toFixed(2)) : out);`,
    stdinSample: `Rafael
avg
5 10 15
20 25 30 35
40 45 50

`,
    extension: "js",
  },

  74: {
    // TYPESCRIPT
    name: "TypeScript (3.7.4)",
    monaco: "typescript",
    sample: String.raw`declare var require: any;
declare var process: any;

const fs = require("fs");

// --- Utility Functions ---

function greet(userName: string): void {
  console.log("Hello, " + userName + "!");
}

function parseNumbers(input: string): number[] {
  const nums: number[] = [];
  for (const tok of input.split(/\s+/)) {
    const v = Number(tok);
    if (isFinite(v)) nums.push(v);
  }
  return nums;
}

const filterEven = (nums: number[]): number[] => nums.filter(n => n % 2 === 0);
const filterOdd = (nums: number[]): number[] => nums.filter(n => n % 2 !== 0);

function chooseFilter(type: string, nums: number[]): number[] {
  switch (type) {
    case "even": return filterEven(nums);
    case "odd": return filterOdd(nums);
    default: return nums;
  }
}

function printResults(filterType: string, nums: number[], out: number[]): void {
  console.log("\nFilter:", filterType);
  console.log("Input:", nums);
  console.log("Output:", out);
}

function toTitleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// --- Main Program ---

console.log("Hello, World!");

// Read from stdin (all at once)
const raw = fs.readFileSync(0, "utf8").trim().split(/\r?\n/);

const userName = (raw[0] || "Guest").trim();
greet(toTitleCase(userName));

const filterType = (raw[1] || "even").trim().toLowerCase();
const nums = parseNumbers(raw.slice(2).join(" "));

const out = chooseFilter(filterType, nums);
printResults(filterType, nums, out);
`,
    stdinSample: `Klaire
odd
1 2 3 4 5 6 7 8 9 10 11 12 13
`,
    extension: "ts",
  },

  72: {
    // RUBY
    name: "Ruby (2.7.0)",
    monaco: "ruby",
    sample: `# ---- Options (shown to the user) ----
OPTIONS = {
  "stats"        => "Show count, sum, and average",
  "filter-even"  => "Keep only even integers",
  "filter-odd"   => "Keep only odd integers",
  "square"       => "Square every number",
  "unique"       => "Remove duplicates (keep first occurrence)"
}

# ---- Simple greeting ----
def greet(name)
  puts "Hello, #{name}!"
end

# ---- Print choices ----
def print_options
  puts "\nAvailable commands:"
  OPTIONS.each do |cmd, desc|
    puts "  - #{cmd}: #{desc}"
  end
  puts
end

def parse_numbers(line)
  nums = []
  line.to_s.split.each do |t|
    begin
      nums << Float(t)
    rescue
    end
  end
  nums
end

def filter_even(arr) arr.select { |n| n % 1 == 0 && n.to_i.even? } end
def filter_odd(arr)  arr.select { |n| n % 1 == 0 && n.to_i.odd?  } end
def square_all(arr)  arr.map { |n| n * n } end
def unique(arr)      arr.uniq end
def sum(arr)         arr.reduce(0.0, :+) end
def average(arr)     arr.empty? ? 0.0 : sum(arr) / arr.length end

# ---- Program ----
puts "Hello, World!"

name = (STDIN.gets || "").strip
name = "Guest" if name.nil? || name.empty?
greet(name)

print_options # Print user options

command = (STDIN.gets || "").strip.downcase
command = "stats" if command.empty?

numbers_line = (STDIN.gets || "").strip
nums = parse_numbers(numbers_line)

puts "Command: #{command}"
puts "\nInput: #{nums.inspect}"

if nums.empty?
  puts "No numbers"
elsif command == "filter-even"
  puts "Result: #{filter_even(nums).inspect}"
elsif command == "filter-odd"
  puts "Result: #{filter_odd(nums).inspect}"
elsif command == "square"
  puts "Result: #{square_all(nums).inspect}"
elsif command == "unique"
  puts "Result: #{unique(nums).inspect}"
else # "stats" or anything else
  puts "Count: #{nums.length}"
  puts "Sum: #{sum(nums).round(2)}"
  puts "Average: #{average(nums).round(2)}"
end
`,
    stdinSample: `Bob
unique
12 12 27 9 18 34 0 11 97 12 32 21 40 57 38 69 421 69
`,
    extension: "rb",
  },

  46: {
    // BASH
    name: "Bash (5.0.0)",
    monaco: "shell",
    sample: `#!/usr/bin/env bash

echo "Hello, World!"

# ---- Read name ----
read -r name || name=""
[ -z "$name" ] && name="Guest"
echo "Hello, $name!"

# ---- Show options ----
echo
echo "Available commands:"
echo "  - stats         : Show line count and word count"
echo "  - upper         : Convert all input lines to UPPERCASE"
echo "  - lower         : Convert all input lines to lowercase"
echo "  - unique-lines  : Remove duplicate lines (keep first occurrence)"
echo "  - sort-lines    : Sort lines alphabetically (A->Z)"
echo "  - reverse-lines : Reverse the order of the lines"
echo "  - char-count    : Show total characters (excluding newlines)"
echo

# ---- Read command ----
read -r command || command=""
[ -z "$command" ] && command="stats"
command=$(printf "%s" "$command" | tr 'A-Z' 'a-z')

# ---- Read remaining input until EOF (no blank line needed) ----
text=""
line_count=0
words_count=0
while IFS= read -r line; do
  # strip trailing CR (Windows)
  line=$(printf "%s" "$line" | tr -d '\r')
  if [ -z "$text" ]; then
    text="$line"
  else
    text="$(printf "%s\n%s" "$text" "$line")"
  fi
  line_count=$((line_count + 1))
  set -- $line
  words_count=$((words_count + $#))
done

# ---- Echo back inputs ----
echo "Name: $name"
echo "Command: $command"
echo "Text:"
if [ "$line_count" -eq 0 ]; then
  echo "(no text)"
else
  # print as-is
  printf "%s\n" "$text"
fi
echo
echo "----------------------"
echo

echo "Command: $command"
echo "Input lines: $line_count"

# ---- Execute command ----
case "$command" in
  stats)
    echo "Lines: $line_count"
    echo "Words: $words_count"
    ;;
  upper)
    if [ "$line_count" -eq 0 ]; then echo "No input"; else printf "%s\n" "$text" | tr '[:lower:]' '[:upper:]'; fi
    ;;
  lower)
    if [ "$line_count" -eq 0 ]; then echo "No input"; else printf "%s\n" "$text" | tr '[:upper:]' '[:lower:]'; fi
    ;;
  unique-lines)
    if [ "$line_count" -eq 0 ]; then echo "No input"; else printf "%s\n" "$text" | awk '!seen[$0]++'; fi
    ;;
  sort-lines)
    if [ "$line_count" -eq 0 ]; then echo "No input"; else printf "%s\n" "$text" | sort; fi
    ;;
  reverse-lines)
    if [ "$line_count" -eq 0 ]; then echo "No input"; else printf "%s\n" "$text" | awk '{a[NR]=$0} END{for(i=NR;i>=1;i--) print a[i]}'; fi
    ;;
  char-count)
    if [ "$line_count" -eq 0 ]; then
      echo "Chars: 0"
    else
      # exclude newlines and carriage returns
      chars=$(printf "%s" "$text" | tr -d '\n' | tr -d '\r' | wc -c | awk '{print $1}')
      echo "Chars: $chars"
    fi
    ;;
  *)
    echo "Unknown command. Try: stats, upper, lower, unique-lines, sort-lines, reverse-lines, char-count"
    ;;
esac

`,
    stdinSample: `Cristyne
char-count
Durian has always held a special place in my heart, not just as a fruit but as an experience that awakens all the senses. The moment its creamy, golden flesh touches my tongue, I’m reminded of why I adore it so much—its rich, custard-like texture and bold sweetness create a flavor that no other fruit can match. Many people find its scent overwhelming, but to me, it’s a comforting aroma that signals indulgence and home. Every bite feels like a celebration of something uniquely Southeast Asian, deeply rooted in culture and memory.
And let’s be honest—nothing pairs quite as heavenly with durian as an ice-cold Coke. The sweet, fizzy drink perfectly balances the richness of the fruit, creating a combination that feels almost divine. But of course, as tempting as it is to indulge, I always remind myself to enjoy both in moderation. Too much of this delicious duo might not be the best for the health—so a little self-control goes a long way! After all, savoring durian (with a bit of Coke on the side) is best when you can enjoy it guilt-free and without regrets.
`,
    extension: "sh",
  },

  57: {
    // ELIXIR
    name: "Elixir (1.9.4)",
    monaco: "elixir",
    sample: `IO.puts("Hello, World!")
IO.puts("\\nAvailable commands:")
IO.puts("  - stats        : Show count, sum, and average")
IO.puts("  - filter-even  : Keep only even integers")
IO.puts("  - filter-odd   : Keep only odd integers")
IO.puts("  - square       : Square every number")
IO.puts("  - unique       : Remove duplicates (keep first occurrence)")
IO.puts("")

# ---- Helpers ----
parse_ints = fn s ->
  s
  |> String.split(~r/\\s+/, trim: true)
  |> Enum.flat_map(fn tok ->
    case Integer.parse(tok) do
      {v, _} -> [v]
      :error -> []    # ignore non-integers
    end
  end)
end

sum = fn arr -> Enum.reduce(arr, 0, &+/2) end
avg = fn arr -> if arr == [], do: 0.0, else: sum.(arr) / max(length(arr), 1) end

filter_even = fn arr -> Enum.filter(arr, fn n -> rem(n, 2) == 0 end) end
filter_odd  = fn arr -> Enum.filter(arr, fn n -> rem(n, 2) != 0 end) end
square_all  = fn arr -> Enum.map(arr, fn n -> n * n end) end
unique      = fn arr -> Enum.uniq(arr) end

get_line_or = fn default ->
  case IO.gets("") do
    nil -> default
    data ->
      v = data |> to_string() |> String.trim()
      if v == "", do: default, else: v
  end
end

# ---- Read name and command ----
name    = get_line_or.("Guest")
IO.puts("Hello, #{name}!")
command = get_line_or.("stats") |> String.downcase()

# ---- Read ALL remaining lines until EOF ----
rest =
  case IO.read(:stdio, :all) do
    :eof -> ""
    data -> data |> String.replace(~r/[\\r\\n]+/, " ") |> String.trim()
  end

nums = parse_ints.(rest)

# ---- Echo inputs ----
IO.puts("Name: #{name}")
IO.puts("Command: #{command}")
IO.puts("Numbers: " <> (Enum.map(nums, &Integer.to_string/1) |> Enum.join(" ")))
IO.puts("")

# ---- Execute command ----
cond do
  nums == [] and command in ["filter-even", "filter-odd", "square", "unique"] ->
    IO.puts("No numbers")

  command == "filter-even" ->
    IO.inspect(filter_even.(nums), label: "Result")

  command == "filter-odd" ->
    IO.inspect(filter_odd.(nums),  label: "Result")

  command == "square" ->
    IO.inspect(square_all.(nums),  label: "Result")

  command == "unique" ->
    IO.inspect(unique.(nums),      label: "Result")

  true ->  # "stats" or anything else
    IO.puts("Count: #{length(nums)}")
    IO.puts("Sum: #{sum.(nums)}")
    IO.puts("Average: #{Float.round(avg.(nums), 2)}")
end
`,
    stdinSample: `Brian
filter-even
11 22 33 44 55 66 77 88 99 100
`,
    extension: "ex",
  },

  54: {
    // C++ 
    name: "C++ (GCC 9.2.0)",
    monaco: "cpp",
    sample: `#include <iostream>
#include <vector>
#include <string>

int main() {
  std::ios::sync_with_stdio(false);
  std::cin.tie(nullptr);

  std::cout << "Hello, World!\\n";

  // Read name (allow empty -> "Guest"; trim possible trailing \\r)
  std::string name;
  if (!std::getline(std::cin, name)) name = "Guest";
  if (!name.empty() && name.back() == '\\r') name.pop_back();
  if (name.empty()) name = "Guest";
  std::cout << "Hello, " << name << "!\\n";

  // Read matrix size
  int r = 0, c = 0;
  if (!(std::cin >> r >> c) || r <= 0 || c <= 0) {
    std::cout << "Bad size\\n";
    return 0;
  }

  // Read matrix values (row-major)
  std::vector<std::vector<long long>> a(r, std::vector<long long>(c, 0));
  for (int i = 0; i < r; ++i) {
    for (int j = 0; j < c; ++j) {
      long long v = 0;
      if (std::cin >> v) a[i][j] = v;  // if read fails, keep 0
      else { a[i][j] = 0; std::cin.clear(); }
    }
  }

  std::cout << "\\nRows: " << r << ", Columns: " << c << "\\n";
  std::cout << "\\nDisplay:\\n";
  for (int j = 0; j < c; ++j) {
    for (int i = 0; i < r; ++i) {
      std::cout << a[i][j] << (i + 1 == r ? '\\n' : ' ');
    }
  }
  return 0;
}
`,
    stdinSample: `Ana
6 4
1 2 3 4 69 57 68 32
5 6 7 8 102 56 37 85 
9 10 11 12 111 92 13

`,
    extension: "cpp",
  },

  60: {
    // GO
    name: "Go (1.13.5)",
    monaco: "go",
    sample: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"unicode"
)

func normalizeToken(s string) string {
	s = strings.ToLower(s)
	// strip leading/trailing punctuation
	s = strings.TrimFunc(s, func(r rune) bool { return unicode.IsPunct(r) })
	return s
}

func lineHasTarget(line, target string) bool {
	for _, tok := range strings.Fields(line) {
		if normalizeToken(tok) == target {
			return true
		}
	}
	return false
}

func main() {
	fmt.Println("Hello, World!")
	fmt.Println("\\nAvailable commands:")
	fmt.Println("  - count : Total occurrences of the target word (default)")
	fmt.Println("  - lines : Number of lines that contain the target word")
	fmt.Println("  - list  : List the lines that contain the target word")
	fmt.Println()

	in := bufio.NewScanner(os.Stdin)
	// allow long lines if needed
	in.Buffer(make([]byte, 0, 64*1024), 1024*1024)

	// ---- Name ----
	name := "Guest"
	if in.Scan() {
		n := strings.TrimSpace(in.Text())
		if n != "" {
			name = n
		}
	}
	fmt.Printf("Hello, %s!\\n\\n", name)

	// ---- Read next line: either command OR target (backward compatible) ----
	command := "count"
	target := ""
	if in.Scan() {
		l2 := strings.TrimSpace(in.Text())
		l2low := strings.ToLower(l2)
		switch l2low {
		case "count", "lines", "list":
			command = l2low
			// read target on the next line
			if in.Scan() {
				target = strings.ToLower(strings.TrimSpace(in.Text()))
			}
		default:
			// treat as target; keep default command = "count"
			target = strings.ToLower(l2)
		}
	}
	target = strings.TrimSpace(target)

	// ---- Read text lines until blank line or EOF ----
	var lines []string
	for in.Scan() {
		line := strings.TrimRight(in.Text(), "\\r")
		if strings.TrimSpace(line) == "" {
			break
		}
		lines = append(lines, line)
	}

	// ---- Echo inputs ----
	fmt.Println("Name:", name)
	fmt.Println("Command:", command)
	fmt.Println("\\nTarget:", target)
	fmt.Println("Text:")
	if len(lines) == 0 {
		fmt.Println("(no text)")
	} else {
		for _, ln := range lines {
			fmt.Println(ln)
		}
	}
	fmt.Println()

	// ---- Run command ----
	targetNorm := strings.ToLower(target)
	if targetNorm == "" {
		fmt.Println("No target provided")
		return
	}

	switch command {
	case "count":
		count := 0
		for _, ln := range lines {
			for _, tok := range strings.Fields(ln) {
				if normalizeToken(tok) == targetNorm {
					count++
				}
			}
		}
		fmt.Println("Word:", targetNorm)
		fmt.Println("Count:", count)

	case "lines":
		cnt := 0
		for _, ln := range lines {
			if lineHasTarget(ln, targetNorm) {
				cnt++
			}
		}
		fmt.Println("Word:", targetNorm)
		fmt.Println("Lines with word:", cnt)

	case "list":
		fmt.Println("Matching lines:")
		found := false
		for _, ln := range lines {
			if lineHasTarget(ln, targetNorm) {
				fmt.Println(ln)
				found = true
			}
		}
		if !found {
			fmt.Println("(none)")
		}
	}
}
`,
    stdinSample: `Pedro
go
Go is fun
We like to go fast with Go
going is not go go go go

`,
    extension: "go",
  },

  62: {
    // JAVA
    name: "Java (OpenJDK 13.0.1)",
    monaco: "java",
    sample: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");

    Scanner sc = new Scanner(System.in);

    // ---- Name (line 1) ----
    String first = sc.hasNextLine() ? sc.nextLine().trim() : "";
    String caller = first.isEmpty() ? "Guest" : first;
    System.out.println("Hello, " + caller + "!");

    // ---- Read score lines until a blank line or EOF ----
    List<String> echoLines = new ArrayList<>();
    int best = Integer.MIN_VALUE;
    List<String> topNames = new ArrayList<>();

    while (sc.hasNextLine()) {
      String raw = sc.nextLine();
      String line = raw == null ? "" : raw.trim();
      if (line.isEmpty()) break;          // stop on blank line
      echoLines.add(line);                // for input echo

      // split on whitespace
      String[] p = line.split("\\\\s+");
      if (p.length < 2) continue;

      String name = p[0];
      try {
        int score = Integer.parseInt(p[1]);
        if (score > best) {
          best = score;
          topNames.clear();
          topNames.add(name);
        } else if (score == best) {
          topNames.add(name);
        }
      } catch (NumberFormatException ignored) {
        // skip invalid score tokens
      }
    }
    sc.close();

    // ---- Echo the inputs ----
    System.out.println();
    System.out.println("----- TD TO WIN IT! -----");
    System.out.println();
    System.out.println("SCOREBOARD:");
    if (echoLines.isEmpty()) {
      System.out.println("(no scores)");
    } else {
      for (String s : echoLines) System.out.println(s);
    }
    System.out.println();
    System.out.println("----------------------");
    System.out.println();

    // ---- Result ----
    if (best == Integer.MIN_VALUE) {
      System.out.println("No scores");
    } else if (topNames.size() == 1) {
      System.out.println("TOP SCORER/S: " + topNames.get(0) + " " + best);
    } else {
      System.out.println("TOP SCORER/S: " + best + " by " + String.join(", ", topNames));
    }
  }
}
`,
    stdinSample: `Professor Utonium 
Ana 91
Blossom 100 
Bubbles 51
Buttercup 85
Ben 77
Cai 84
Dexter 96
Elle 96
Fox 70
`,
    extension: "java"
  },

  68: {
    // PHP
    name: "PHP (7.4.1)",
    monaco: "php",
    sample: `<?php
echo "Hello, World!\\n";

// ---- Read name ----
$name = trim(fgets(STDIN) ?: "");
if ($name === "") $name = "Guest";
echo "Hello, $name!\\n";

echo "\\nAvailable commands:\\n";
echo "  - get   : Print the value of the provided key\\n";
echo "  - keys  : List all keys\\n";
echo "  - all   : Print all key=value pairs\\n";
echo "  - count : Print how many pairs were provided\\n\\n";

// ---- Read command ----
$command = strtolower(trim(fgets(STDIN) ?: ""));
if ($command === "") $command = "get";

// ---- Read key (used by 'get') ----
$key = trim(fgets(STDIN) ?: "");

// ---- Read remaining lines until EOF; build map and keep a raw echo copy ----
$map = [];
$rawLines = [];
while (($line = fgets(STDIN)) !== false) {
    // Trim trailing \\r\\n but keep internal spaces
    $line = rtrim($line, "\\r\\n");
    $rawLines[] = $line;

    if ($line === "") continue;
    $pos = strpos($line, "=");
    if ($pos === false) continue;

    $k = trim(substr($line, 0, $pos));
    $v = trim(substr($line, $pos + 1));

    if ($k !== "") {
        $map[$k] = $v; // last one wins if duplicate keys
    }
}

// ---- Echo inputs ----
echo "Command: $command\\n";
echo "Key: " . ($key === "" ? "(none)" : $key) . "\\n";
echo "\\nPAIRS:\\n";
if (count($rawLines) === 0) {
    echo "(no lines)\\n";
} else {
    foreach ($rawLines as $rl) echo $rl . "\\n";
}
echo "\\n----------------------\\n\\n";

// ---- Execute command ----
switch ($command) {
    case "get":
        if ($key !== "" && array_key_exists($key, $map)) {
            echo "Value: " . $map[$key] . "\\n";
        } elseif ($key === "") {
            echo "NOT_FOUND (no key provided)\\n";
        } else {
            echo "NOT_FOUND\\n";
        }
        break;

    case "keys":
        if (empty($map)) {
            echo "(no keys)\\n";
        } else {
            // print keys one per line
            foreach (array_keys($map) as $k) echo $k . "\\n";
        }
        break;

    case "all":
        if (empty($map)) {
            echo "(no pairs)\\n";
        } else {
            foreach ($map as $k => $v) echo $k . "=" . $v . "\\n";
        }
        break;

    case "count":
        echo "Count: " . count($map) . "\\n";
        break;

    default:
        echo "Unknown command. Try: get, keys, all, count\\n";
        break;
}
`,
    stdinSample: `Jon
get
fruit
color=blue
fruit=durian
mood=happy
animal=cat
food = pizza
pet=dog
country=USA
language=english
mood=excited
`,
    extension: "php",
  },

  73: {
    // RUST
    name: "Rust (1.40.0)",
    monaco: "rust",
    sample: `use std::io::{self, Read};

fn main() {
    println!("Hello, World!");

    // Read all input
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();

    // Create an iterator over lines in the input string
    let mut it = s.lines();

    // ---- Read name (line 1) ----
    let name = it.next().unwrap_or("").trim().to_string();
    let name = if name.is_empty() { "Guest".to_string() } else { name };
    println!("Hello, {}!", name);

    // ---- Show options ----
    println!("\\nAvailable commands:");
    println!("  - threshold : Filter integers greater than or equal to a threshold (default threshold: 0)");
    println!();

    // ---- Read threshold (line 2) ----
    let th_line = it.next().unwrap_or("0").trim().to_string();
    let th: i64 = th_line.parse().unwrap_or(0);

    println!("Threshold: {}", th);
    println!();

    // ---- Read integer lines ----
    let mut out: Vec<i64> = Vec::new();
    println!("FILTERED INTEGERS (greater than or equal to threshold):");

    for line in it {
        let line = line.trim();
        if line.is_empty() { break; }  // stop if a blank line
        for tok in line.split_whitespace() {
            if let Ok(v) = tok.parse::<i64>() {
                if v >= th {
                    out.push(v);
                }
            }
        }
    }

    if out.is_empty() {
        println!("No integers meet the threshold.");
    } else {
        println!("Filtered Values – {:?}", out);
    }
}
`,
    stdinSample: `Sofia
20
10 20 30 40 50 60 70 80 90 100

`,
    extension: "rs",
  },

  51: {
    // C#
    name: "C# (Mono 6.6.0.161)",
    monaco: "csharp",
    sample: `using System;
using System.Text;

class Program {
    static void Main() {
        // Display initial message and options
        Console.WriteLine("Hello, World!");
        Console.WriteLine("\\nAvailable modes:");
        Console.WriteLine("  - upper : Convert text to uppercase");
        Console.WriteLine("  - lower : Convert text to lowercase");
        Console.WriteLine();

        // ---- Read name ----
        string name = Console.ReadLine() ?? "";
        if (string.IsNullOrWhiteSpace(name)) name = "Guest";
        Console.WriteLine($"Hello, {name}!");

        // ---- Read mode (default to "upper") ----
        string mode = Console.ReadLine() ?? "upper";
        Console.WriteLine($"Mode: {mode}");

        // ---- Read text lines until EOF or blank line ----
        var sb = new StringBuilder();
        Console.WriteLine("Enter text (empty line to stop):");

        while (true) {
            var line = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(line)) break;  // Stop if line is empty
            sb.AppendLine(line);
        }
        string text = sb.ToString().TrimEnd();

        // ---- Show input ----
        Console.WriteLine();
        Console.WriteLine($"Name: {name}");
        Console.WriteLine($"Mode: {mode}");
        Console.WriteLine("Text:");
        Console.WriteLine(text);
        Console.WriteLine("\\n----------------------\\n");

        // ---- Process text based on mode ----
        string outText = text;
        if (mode.Equals("upper", StringComparison.OrdinalIgnoreCase)) {
            outText = text.ToUpperInvariant();
        } else if (mode.Equals("lower", StringComparison.OrdinalIgnoreCase)) {
            outText = text.ToLowerInvariant();
        }

        // ---- Display result ----
        Console.WriteLine();
        Console.WriteLine(outText);
        Console.WriteLine("Chars: " + outText.Length);
    }
}
`,
    stdinSample: `Alice
upper
Hello world!
This is a test.
Another example of input.

`,
    extension: "cs",
  },

  50: {
    // C
    name: "C (GCC 9.2.0)",
    monaco: "c",
    sample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int cmp(const void *a, const void *b) {
    int x = *(const int*)a, y = *(const int*)b;
    return (x > y) - (x < y);
}

int main() {
    printf("Hello, World!\\n");

    char name[256] = {0};
    if (!fgets(name, sizeof(name), stdin)) name[0] = '\\0';
    size_t len = strlen(name);
    if (len > 0 && name[len - 1] == '\\n') name[len - 1] = '\\0';
    if (name[0] == '\\0') strcpy(name, "Guest");
    printf("Hello, %s!\\n", name);

    // Read subsequent lines; blank line ends; collect integers.
    int cap = 1024, n = 0;
    int *arr = (int*)malloc(sizeof(int) * cap);
    char line[1024];

    while (fgets(line, sizeof(line), stdin)) {
        if (line[0] == '\\n' || line[0] == '\\0') break;
        char *tok = strtok(line, " \\t\\r\\n");
        while (tok) {
            char *endp = NULL;
            long v = strtol(tok, &endp, 10);
            if (endp != tok) {
                if (n == cap) {
                    cap *= 2;
                    arr = (int*)realloc(arr, sizeof(int) * cap);
                }
                arr[n++] = (int)v;
            }
            tok = strtok(NULL, " \\t\\r\\n");
        }
    }

    if (n == 0) {
        printf("\\nNo data entered.\\n");
        free(arr);
        return 0;
    }

    // Print numbers as entered
    printf("\\nYou entered: \\n");
    for (int i = 0; i < n; i++) {
        printf("%d%s", arr[i], (i + 1 < n) ? " " : "\\n");
    }

    // Sort and print numbers
    qsort(arr, n, sizeof(int), cmp);

    printf("Arranged Numbers: \\n");
    for (int i = 0; i < n; i++) {
        printf("%d%s", arr[i], (i + 1 < n) ? " " : "\\n");
    }

    free(arr);
    return 0;
}`,
    stdinSample: `Steve
9 3 7 1 4 14
6 2 8 5 10 12 11 13

`,
    extension: "c",
  },
}

// Numeric alias map so alternative ids (e.g., 24) resolve to a canonical Judge0 id above.
const languageIdAliases = {
  // Example mappings commonly requested:
  24: 50, // Treat 24 as "C", but our canonical C is 50 (GCC 9.2.0)
  // Add more aliases here if needed, e.g. 27: 54 for C++ in some lists, etc.
}

let editor
let currentLanguageId = 71 // default Python
let currentFileName = "main.py"

let isResizingHorizontal = false
let isResizingVertical = false

// Declare Monaco Editor variable
window.monaco = window.monaco || {}

// Monaco Editor init
require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" } })
require(["vs/editor/editor.main"], () => {
  editor = window.monaco.editor.create(document.getElementById("editor"), {
    value: languages[currentLanguageId].sample,
    language: languages[currentLanguageId].monaco,
    theme: "vs-dark",
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
  })

  // Ensure input box has default stdin on load
  const inputArea = document.getElementById("inputArea")
  inputArea.value = languages[currentLanguageId].stdinSample ?? ""
})

// File menu
document.getElementById("fileDropdownBtn").addEventListener("click", (e) => {
  e.stopPropagation()
  const dropdown = document.getElementById("fileDropdownContent")
  dropdown.classList.toggle("show")
})

document.addEventListener("click", () => {
  const dropdown = document.getElementById("fileDropdownContent")
  dropdown.classList.remove("show")
})

document.getElementById("openFileBtn").addEventListener("click", () => {
  document.getElementById("fileInput").click()
  document.getElementById("fileDropdownContent").classList.remove("show")
})

document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (!file) return

  const extension = file.name.split(".").pop().toLowerCase()
  const languageMap = {
    py: 71,
    js: 63,
    ts: 74,
    rb: 72,
    sh: 46,
    ex: 57,
    cpp: 54,
    cc: 54,
    cxx: 54,
    go: 60,
    java: 62,
    php: 68,
    rs: 73,
    cs: 51,
    c: 50,
    // (optional) map these if desired:
    html: 63,
    css: 63,
    json: 63,
    xml: 63,
    md: 63,
  }

  const reader = new FileReader()
  reader.onload = (evt) => {
    const content = evt.target.result

    if (languageMap[extension]) {
      const langId = languageMap[extension]
      document.getElementById("languageSelector").value = String(langId)
      switchLanguage(langId, { presetSample: false, preserveFileName: true })
    }

    if (editor) editor.setValue(content)

    currentFileName = file.name
    document.getElementById("currentFileName").textContent = file.name

    document.getElementById("fileDropdownContent").classList.remove("show")
  }
  reader.readAsText(file)
})

document.getElementById("saveCodeBtn").addEventListener("click", () => {
  if (!editor) return

  const code = editor.getValue()
  const language = languages[currentLanguageId]
  const fallbackExt = language?.extension || "txt"

  const filename = currentFileName && currentFileName.trim() ? currentFileName : `code.${fallbackExt}`

  const blob = new Blob([code], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  document.getElementById("fileDropdownContent").classList.remove("show")
})

// Theme toggle (fix: use monaco.editor.setTheme)
document.getElementById("themeToggle").addEventListener("click", function () {
  const body = document.body

  if (body.classList.contains("light-theme")) {
    body.classList.remove("light-theme")
    this.textContent = "🌙"
    if (editor) window.monaco.editor.setTheme("vs-dark")
  } else {
    body.classList.add("light-theme")
    this.textContent = "☀️"
    if (editor) window.monaco.editor.setTheme("vs")
  }
})

// Language selector
document.getElementById("languageSelector").addEventListener("change", function () {
  const languageId = Number.parseInt(this.value)
  switchLanguage(languageId)
})

// Run
document.getElementById("runButton").addEventListener("click", runCode)

// Resizers
const horizontalResize = document.getElementById("horizontalResize")
const rightPane = document.querySelector(".right-pane")
const outputSection = document.getElementById("outputSection")
const inputSection = document.getElementById("inputSection")

const verticalResize = document.getElementById("verticalResize")
const editorElement = document.getElementById("editor")

horizontalResize.addEventListener("mousedown", (e) => {
  isResizingHorizontal = true
  document.addEventListener("mousemove", handleHorizontalResize)
  document.addEventListener("mouseup", stopHorizontalResize)
  e.preventDefault()
})

verticalResize.addEventListener("mousedown", (e) => {
  isResizingVertical = true
  document.addEventListener("mousemove", handleVerticalResize)
  document.addEventListener("mouseup", stopVerticalResize)
  e.preventDefault()
})

function handleHorizontalResize(e) {
  if (!isResizingHorizontal) return
  const containerWidth = document.querySelector(".split-container").offsetWidth
  const rightWidth = containerWidth - e.clientX
  const minWidth = 250
  const maxWidth = containerWidth - 300

  if (rightWidth >= minWidth && rightWidth <= maxWidth) {
    rightPane.style.width = rightWidth + "px"
  }
}

function stopHorizontalResize() {
  isResizingHorizontal = false
  document.removeEventListener("mousemove", handleHorizontalResize)
  document.removeEventListener("mouseup", stopHorizontalResize)
}

function handleVerticalResize(e) {
  if (!isResizingVertical) return

  const leftPane = document.querySelector(".left-pane")
  const leftPaneRect = leftPane.getBoundingClientRect()
  const filenameHeader = document.querySelector(".filename-header")
  const filenameHeaderHeight = filenameHeader.offsetHeight
  const verticalResizeHeight = verticalResize.offsetHeight

  const availableHeight = leftPaneRect.height - filenameHeaderHeight - verticalResizeHeight

  // Calculate new editor height based on mouse position
  const newEditorHeight = e.clientY - leftPaneRect.top - filenameHeaderHeight

  const minEditorHeight = 150
  const minInputHeight = 120 // Increased from 100px to ensure proper scrollbar containment
  const maxEditorHeight = availableHeight - minInputHeight

  if (newEditorHeight >= minEditorHeight && newEditorHeight <= maxEditorHeight) {
    const inputHeight = availableHeight - newEditorHeight

    editorElement.style.flex = "none"
    editorElement.style.height = `${newEditorHeight}px`

    inputSection.style.flex = "none"
    inputSection.style.height = `${inputHeight}px`
  }
}

function stopVerticalResize() {
  isResizingVertical = false
  document.removeEventListener("mousemove", handleVerticalResize)
  document.removeEventListener("mouseup", stopVerticalResize)
}

// ---------- Language Switching Core ----------

function resolveCanonicalLanguageId(rawId) {
  const idNum = Number.parseInt(rawId)
  if (Number.isNaN(idNum)) return null

  if (languages[idNum]) return idNum // already canonical/supported
  if (languageIdAliases[idNum] && languages[languageIdAliases[idNum]]) {
    return languageIdAliases[idNum] // alias -> canonical
  }
  return null
}

function switchLanguage(languageId, opts = { presetSample: true, preserveFileName: false }) {
  const canonicalId = resolveCanonicalLanguageId(languageId)
  if (canonicalId == null) return // unknown id, ignore

  currentLanguageId = canonicalId
  const language = languages[canonicalId]

  // Sync selector to canonical id
  const selector = document.getElementById("languageSelector")
  if (selector.value !== String(canonicalId)) {
    selector.value = String(canonicalId)
  }

  // Update language badge
  const languageName = extractLanguageName(language.name)
  document.getElementById("currentLanguage").textContent = languageName

  // Update filename unless the user opened a file or asked to preserve
  if (!opts.preserveFileName) {
    const extension = language.extension || "txt"
    currentFileName = `main.${extension}`
    document.getElementById("currentFileName").textContent = currentFileName
  }

  // Update editor
  if (editor) {
    if (opts.presetSample) {
      editor.setValue(language.sample)
    }
    window.monaco.editor.setModelLanguage(editor.getModel(), language.monaco)
  }

  document.getElementById("inputArea").value = languages[canonicalId].stdinSample || ""
}

function extractLanguageName(fullName) {
  const match = fullName.match(/^([^(]+)/)
  return match ? match[1].trim() : fullName
}

/* ---------- UTF-8 safe Base64 helpers ---------- */
// Encode Unicode → Base64 (UTF-8 safe)
function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)))
}
// Decode Base64 → Unicode (UTF-8 safe)
function fromBase64(str) {
  return decodeURIComponent(escape(atob(str)))
}

// ---------- Run Code ----------

async function runCode() {
  const runButton = document.getElementById("runButton")
  const statusElement = document.getElementById("status")
  const outputArea = document.getElementById("outputArea")
  const executionTimeElement = document.getElementById("executionTime")
  const memoryUsedElement = document.getElementById("memoryUsed")
  const inputArea = document.getElementById("inputArea")

  if (!editor) return

  const code = editor.getValue()
  const stdin = inputArea.value

  runButton.disabled = true
  runButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...'
  statusElement.textContent = "Running..."
  statusElement.className = "status-value loading"
  outputArea.textContent = "Executing code..."
  executionTimeElement.textContent = "-"
  memoryUsedElement.textContent = "-"

  // (Optional) keep stdin visible; remove this line if you prefer to clear it
  // inputArea.value = "";

  try {
    const response = await fetch(LAMBDA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language_id: currentLanguageId,
        source_code: toBase64(code),
        stdin: toBase64(stdin),
      }),
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          "You have exceeded the DAILY quota for Submissions for Tutorial's Dojo's Code Runner. Please come back again later.",
        )
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Safely assemble decoded output (fields may be null/empty)
    let output = ""
    if (result.stdout) output += fromBase64(result.stdout)
    if (result.stderr) output += (output ? "\n" : "") + fromBase64(result.stderr)
    if (!output && result.compile_output) output = fromBase64(result.compile_output)
    if (!output) output = "No output"

    outputArea.textContent = output

    const statusText = result.status ? result.status.description : "Completed"
    statusElement.textContent = statusText
    statusElement.className = "status-value " + (result.status && result.status.id === 3 ? "success" : "error")

    executionTimeElement.textContent = result.time ? `${result.time}s` : "-"
    memoryUsedElement.textContent = result.memory ? `${result.memory} KB` : "-"
  } catch (error) {
    console.error("Error:", error)
    outputArea.textContent = `Error: ${error.message}`
    statusElement.textContent = "Error"
    statusElement.className = "status-value error"
  } finally {
    runButton.disabled = false
    runButton.innerHTML = '<i class="fa-solid fa-circle-play"></i> Run'
  }
}

// ---------- URL handling ----------

function handleUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search)

  // New required param
  const langIdParam = urlParams.get("langId")
  // Backwards-compat param
  const legacyParam = urlParams.get("languageId")

  const paramToUse = langIdParam ?? legacyParam

  const canonical = resolveCanonicalLanguageId(paramToUse)
  if (canonical != null) {
    switchLanguage(canonical)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleUrlParameters()
})

// Handle back/forward navigation if the query changes
window.addEventListener("popstate", handleUrlParameters)

// Keyboard shortcut: Ctrl/Cmd + Enter => Run
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault()
    runCode()
  }
})