from flask import Flask, request, jsonify
import os
import numpy as np
from flask_cors import CORS
import torch
import torch.nn as nn
import torchvision
from torchvision import models, transforms
from PIL import Image

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

model = models.resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, 6)
model.load_state_dict(torch.load("./resnet18_brain_tumor.pth", map_location=torch.device('cpu'),weights_only=True))

def preprocess_image(image_path, image_size=(224, 224)):
    transform = transforms.Compose([
        transforms.Resize(image_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    image = Image.open(image_path).convert('RGB')
    image_tensor = transform(image).unsqueeze(0) 
    return image_tensor

def predict_single_image(model, image_tensor, class_names, device='cpu'):
    model.eval()  
    image_tensor = image_tensor.to(device)
    with torch.no_grad():
        outputs = model(image_tensor)  
        probabilities = torch.nn.functional.softmax(outputs, dim=1)  
        predicted_class_idx = torch.argmax(probabilities, dim=1).item()          
        confidence_score = probabilities[0, predicted_class_idx].item()  
        print(confidence_score)
    predicted_class_label = class_names[predicted_class_idx]  
    return predicted_class_label,predicted_class_idx,confidence_score

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST"])
def upload_file():
    print(f"Starting")
    class_names = ["others","other_body_part", "glioma_tumor", "meningioma_tumor", "no_tumor", "pituitary_tumor"]
    sentences = [
        "This doesnt seem to be an MRI image. please check and try again.",
        "This doesnt seem to be an MRI image of brain. please check and try again.",
        "Glioma tumors arise from glial cells in the brain and can infiltrate surrounding tissue, making complete surgical resection challenging. Targeted therapies and immunotherapy hold promise for improving outcomes in glioma patients by targeting specific genetic mutations and enhancing the body's immune response against tumor cells.",
        "Meningioma tumors originate from the meninges surrounding the brain and spinal cord and often grow slowly, allowing for a relatively favorable prognosis in many cases. Surgical resection remains the primary treatment modality for meningiomas, with advancements in imaging technology and surgical techniques contributing to improved patient outcomes and reduced morbidity.",
        "No tumor is detected in this image",
        "Pituitary tumors, typically benign and hormonally active, can disrupt endocrine function, leading to hormonal imbalances and associated symptoms such as infertility, fatigue, and metabolic disturbances. Management of pituitary tumors often involves a multidisciplinary approach, including endocrinologists, neurosurgeons, and radiation oncologists, to tailor treatment strategies based on tumor size, hormone secretion patterns, and patient comorbidities.",
    ]
    if "image" not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files["image"]
    print(request.files)
    print(request.files["image"])
    print(file)
    if file.filename == "":
        return jsonify({"error": "No selected file"})
    if file and allowed_file(file.filename):
        filename = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filename)
        print(f"Image received and saved: {filename}")
    image_tensor = preprocess_image(filename)
    predicted_class, predicted_class_idx,confidence_score = predict_single_image(model, image_tensor, class_names)
    print(f"Predicted class: {predicted_class}")
    print(predicted_class)
    print(predicted_class_idx)
    descrip = sentences[predicted_class_idx]
    print(descrip)
    body = {}
    data = {}
    data["class"] = predicted_class
    data["descrip"] = descrip
    data["cfscore"] = confidence_score
    body["data"] = data
    return buildResponse(body)
def buildResponse(body):
    response = jsonify(body)
    return response
if __name__ == "__main__":
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.debug = True
    app.run(port=5000, threaded=True)
