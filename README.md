# ds-analytics

## Dependencies
- Node

https://nodejs.org/en/download/package-manager/
- Python 3 

Note: If ```python3 --version``` does not work and ```python --version``` does, then you will need to update /routes/index.js

## Running
```bash
npm i
npm run start
```
You can then open your browser and go to the ipaddress of the device running the application **Probably localhost:3000**

## Viewing the comparisons
The comparisons section can be seen by going to **localhost:3000/comparison**

## Running your own ds-client
run the parser.py in your project location and move data.json into the data directory
Note: You have to **have a /data directory** in the file you run it in, this can be changed by chaning the line in the parser.py:
```python
with open('./data/data.json, 'w') as fp:
```
you just need to change the ```'./data/data.json'``` to ```'./data.json'``` this can be seen on line 144.

## Contributions
Thank you whoever it was from last year that made the parser.py, I definitely would not have been bothered to do the rest otherwise.
This was hacked together, so feel free to improve the code in any way you like!
**Help would be greatly appreciated**.
