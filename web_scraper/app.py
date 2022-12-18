import os
import time
import math
from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from dotenv import load_dotenv
import requests
import shutil
import json
from pathlib import Path
load_dotenv(".env")

mainRoute = str(os.getenv("main_route"))

def writeSingleNoticeImage(filename,url):
    response = requests.get(url, stream=True,  headers={'User-agent': 'Mozilla/5.0'})
    with open(filename,"wb") as file: 
      shutil.copyfileobj(response.raw, file)

driverOptions = Options()
driverOptions.binary_location =  str(os.getenv("firefox_path"))

driver = webdriver.Firefox(executable_path= str(os.getenv("geckodriver_path")),options= driverOptions) 

driver.get("https://www.cezmikalorifer.com/turkiyenin-81-iline-ait-81-fotograf")

contents = driver.find_element(by= By.XPATH, value= '//*[@id="post-57372"]/div[2]/div/div[1]/div/div/div/div/div[3]')

paragraphs = contents.find_elements(by=By.TAG_NAME, value = "p")
cityTitles = contents.find_elements(by=By.TAG_NAME, value = "h2")

currentIndex = 2

cities = []
imageUrls = []

for i in cityTitles:
  cities.append(i.text.split(" ")[1])

while currentIndex < (len(paragraphs) -2):
    currentParagraph = paragraphs[currentIndex]
    cityName = currentParagraph.find_element(by= By.TAG_NAME , value ="img")
    url =cityName.get_attribute("data-src")
    imageUrls.append(url)
    currentIndex += 1

for i in range(81):
  writeSingleNoticeImage(f'files/{cities[i]}.{imageUrls[i].split(".")[-1]}', imageUrls[i])
  time.sleep(1)

data = []

for i in sorted(Path("files/").iterdir(), key=os.path.getmtime):
  data.append({"name": i.name.split(".")[0]})

with open('cities_of_turkey.json', 'w', encoding='utf-8') as f:
  json.dump(data, f, ensure_ascii=False, indent=4)

for i  in range(81):
  path = sorted(Path("files/").iterdir(), key=os.path.getmtime)[i].name
  data = {"image": open(f"files/{path}", "rb")}
  response = requests.put(f"{mainRoute}/admin/add_image/{i}", files = data, headers = {"admin-key": os.environ["admin_psw"]})
  print(response.content)