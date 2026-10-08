# AI-Based Road Surface Roughness and Ride-Quality Estimation Using Computer Vision
An AI-powered road inspection system that analyzes road images and estimates the surface quality using Computer Vision and Deep Learning.
## Project Overview
This project uses Computer Vision and an AI classification model to analyze road images and classify road surface quality into three categ
- GOOD
- MODERATE
- POOR
The system also provides:
- AI confidence score
- Severity level
- Estimated maintenance cost
- Road inspection results
- Location support
## Objectives
1. Analyze road images using Artificial Intelligence.
2. Classify road surface quality automatically.
3. Estimate the severity of the road condition.
4. Provide an AI confidence score.
5. Provide an estimated maintenance cost.
6. Provide a simple web interface for road inspection.
## AI Model
The project uses the YOLO11n Classification Model.
The model was trained for three classes:
| Class | Meaning |
|---|---|
| GOOD | Good-quality road surface |
| MODERATE | Intermediate road surface condition |
| POOR | Bad or very bad road surface |
The original surface-quality categories were mapped as:
```text
excellent + good -> GOOD
intermediate -> MODERATE
bad + very_bad -> POOR
```
## Model Performance
| Evaluation | Accuracy |
|---|---:|
| Validation Top-1 Accuracy | 76.6% |
| Test Top-1 Accuracy | 74.09% |
| Test Top-5 Accuracy | 100% |
## Dataset
The project uses the StreetSurfaceVis dataset.
Dataset source:
https://zenodo.org/records/11449977
### Dataset Distribution
| Class | Images |
|---|---:|
| GOOD | 4908 |
| MODERATE | 2610 |
| POOR | 1604 |
| Total | 9122 |
### Dataset Split
```text
Training: 70%
Validation: 15%
Testing: 15%
```
## Technologies Used
### AI / Machine Learning
- Python
- YOLO11
- Ultralytics
- PyTorch
- Computer Vision
### Backend
- Flask
- Python
- REST API
### Frontend
- HTML
- CSS
- JavaScript
- Leaflet Maps
### Development Tools
- Visual Studio Code
- Git
- GitHub
## System Architecture
```text
Road Image
|
Web Frontend
|
Flask Backend
|
YOLO11n Classifier
|
GOOD / MODERATE / POOR
|
AI Confidence
|
Severity Level
|
Estimated Maintenance Cost
```
## Severity Mapping
| Road Condition | Severity |
|---|---|
| GOOD | LOW |
| MODERATE | MEDIUM |
| POOR | HIGH |
## Estimated Maintenance Cost
| Road Condition | Estimated Cost |
|---|---:|
| GOOD | Rs. 0 |
| MODERATE | Rs. 3,000 |
| POOR | Rs. 6,000 |
These are prototype/demo estimates and are not actual engineering quotations.
## Project Structure
```text
RoadDamageAI/
|
|-- backend/
|-- dataset/
|-- frontend/
|-- image/
|-- runs/
|-- .gitignore
`-- README.md
```
## How to Run
Clone the repository:
```bash
git clone https://github.com/ajitkumar2032005-droid/RoadDamageAI.git
```
Open the project:
```bash
cd RoadDamageAI
```
Create a virtual environment:
```bash
python -m venv .venv
```
Activate it on Windows:
```powershell
.venv\Scripts\Activate.ps1
```
Install required packages:
```bash
pip install ultralytics flask
```
Start the backend:
```powershell
python backend/server.py
```
The backend runs at:
```text
http://127.0.0.1:5000
```
## Example Prediction
```text
Road Condition: POOR
Confidence: 80.58%
Severity: HIGH
Estimated Cost: Rs. 6000
```
## Limitations
This project estimates road surface quality from images.
It does not directly measure:
- International Roughness Index (IRI)
- Vehicle vibration
- Physical road elevation
- Actual ride comfort
- Exact repair cost
Therefore, this system is an AI-based visual inspection prototype and not a replacement for professional road engineering surveys.
## Future Scope
- Larger and more diverse datasets
- Improved model accuracy
- Real-time camera/video analysis
- Pothole detection
- Crack detection
- Direct roughness estimation
- IRI estimation
- Cloud deployment
- Mobile application
- GIS-based road-condition mapping
- Historical road-condition tracking
## Developer
**Ajit Kumar**

B.Tech Computer Science & Engineering
## License
This project is developed for educational and academic purposes.