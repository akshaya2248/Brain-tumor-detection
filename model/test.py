from flask import Flask, request, jsonify
import os
import numpy as np
from flask_cors import CORS
import torch
import torch.nn as nn
import torchvision
from torchvision import models, transforms
from PIL import Image

model = models.resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, 5)
model.load_state_dict(torch.load("./model_resnet.pth", map_location=torch.device('cpu'),weights_only=True))

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
    return predicted_class_label

class_names = ["others","glioma_tumor", "meningioma_tumor", "no_tumor", "pituitary_tumor"]

# Preprocess the image
image_path = "/home/acer/Downloads/archive(2)/test_dataset/other_items_1.jpg"  # Replace with your image path
image_tensor = preprocess_image(image_path)

# Predict the class
predicted_class = predict_single_image(model, image_tensor, class_names)
print(f"Predicted class: {predicted_class}")