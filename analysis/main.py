import pandas as pd
import json

# Load the CSV file into a pandas DataFrame
try:
  df = pd.read_csv('synthetic_nfr_data.csv')
except FileNotFoundError:
  print("Error: 'synthetic_nfr_data.csv' not found. Please upload the file or provide the correct path.")
  exit()

data = df.to_dict('records')

attr_data = [
  {k: v for k, v in item.items() if k not in ["requirement", "fr_requirement", "justification", "validity", "applicability"]}
  for item in data
  if item.get('assignedFor') == 'attr'
]

nfr_data = [
  {k: v for k, v in item.items() if k not in ["requirement", "fr_requirement", "justification", "humanAttr"]}
  for item in data
  if item.get('assignedFor') == 'nfr'
]
print(json.dumps(nfr_data, indent=4))