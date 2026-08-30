import csv
import json

def export_cases():
    cases = []
    with open("cases.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cases.append(row)
            
    content = f"export const casesData = {json.dumps(cases, indent=2)};\n"
    with open("src/data/casesData.js", "w", encoding="utf-8") as f:
        f.write(content)
    print("Exported src/data/casesData.js")

if __name__ == "__main__":
    export_cases()
