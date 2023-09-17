import cv2
import os
from sys import argv

import json
from enum import Enum
from typing import List, TypedDict

import numpy as np
import cv2.typing


class FisherfaceFaceRecognizer:
    cascade_classifier: cv2.CascadeClassifier
    face: List[cv2.typing.MatLike]
    labels: List[int]
    is_model_ready: bool

    def __init__(self) -> None:
        # Carrega o classificador Haarcascade para detecção de faces
        self.cascade_classifier = cv2.CascadeClassifier(
            'haarcascade_frontalface_default.xml')
        # Cria o modelo de reconhecimento de faces Fisherface
        self.model = cv2.face.FisherFaceRecognizer_create()
        self.faces = []
        self.labels = []

    def load_model(self, path: str) -> None:
        self.model.read(path)

    def detect_and_resize_face(self, image: cv2.typing.MatLike) -> (cv2.typing.MatLike | None):
        # Tamanho padrão para o rosto redimensionado
        resized_width, resized_height = (50, 38)

        # Converte a imagem para escala de cinza
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detecta rostos na imagem usando o classificador Haarcascade
        detected_faces = self.cascade_classifier.detectMultiScale(
            gray_image, scaleFactor=1.01, minNeighbors=4, minSize=(30, 30))

        if len(detected_faces) == 0:
            return None

        # Seleciona o primeiro rosto detectado
        x, y, w, h = detected_faces[0]
        face_roi = gray_image[y:y+h, x:x+w]

        # Redimensiona o rosto para o tamanho padrão
        resized_face = cv2.resize(face_roi, (resized_width, resized_height))

        return resized_face

    def setup_training_data(self, training_data_path: str) -> None:
        self.faces = []
        self.labels = []

        for dir in os.listdir(training_data_path):
            label = dir.split('s')
            label = int(label[1] if len(label) >= 1 else label[0])

            for pathImage in os.listdir(os.path.join(training_data_path, dir)):
                imagePath = os.path.join(training_data_path, dir, pathImage)
                image = cv2.imread(imagePath)
                detected_face = self.detect_and_resize_face(image)

                if detected_face is not None:
                    self.faces.append(detected_face)
                    self.labels.append(label)

                """DEBUG"""
                # if detected_face is None:
                #     print(f'label: {dir}, image: {pathImage}')

    def train(self) -> None:
        # Treina o modelo com as faces e labels coletados
        self.model.train(self.faces, np.array(self.labels))
        self.model.write('classifierFisherface.xml')

    def predict(self, test_image: str) -> (tuple[int, float] | tuple[None, None]):
        face = self.detect_and_resize_face(test_image)
        if face is not None:
            # Realiza a previsão da label e confiança
            label, confidence = self.model.predict(face)
            if confidence < 270:
                return label, confidence
            else:
                return None, None
        else:
            return None, None


class Action(Enum):
    ADD_CLASS = 'ADD_CLASS'
    TEST_IMG = 'TEST_IMG'


class Args(TypedDict):
    action: str
    data: any


if __name__ == '__main__':
    args: Args = json.loads(argv[1])

    if args['action'] == Action.ADD_CLASS.value:
        print(json.dumps(args))
    elif args['action'] == Action.TEST_IMG.value:
        pass
