import cv2
import os
from sys import argv

import json
from enum import Enum
from typing import List, TypedDict

import numpy as np
import cv2.typing

BASE_PATH = __file__.removesuffix("fisherface.py")

DEFAULT_MODEL_FILE = f"{BASE_PATH}classifierFisherface.xml"
DEFAULT_TRAINING_DATA = f"{BASE_PATH}dataset/AT&T Database of Faces/training-data"


class Model:
    def read(self, path: str) -> None:
        pass

    def train(self, faces: List[cv2.typing.MatLike], labels: List[int]) -> None:
        pass

    def write(self, path: str) -> None:
        pass

    def predict(self, img: cv2.typing.MatLike) -> tuple[int, int]:
        pass


class FisherfaceFaceRecognizer:
    model: Model
    cascade_classifier: cv2.CascadeClassifier
    faces: List[cv2.typing.MatLike]
    labels: List[int]
    trained: bool

    def __init__(self) -> None:
        self.model = cv2.face.FisherFaceRecognizer_create()
        self.cascade_classifier = cv2.CascadeClassifier(
            f"{BASE_PATH}haarcascade_frontalface_default.xml"
        )
        self.faces = []
        self.labels = []
        self.trained = False

    def load_model(self, path: str = None) -> None:
        if path is not None and not os.path.exists(path):
            raise ValueError(
                f"The model file was not found in the specified directory: {path}. Please ensure the file exists and the path is correct."
            )
        self.model.read(path if path is not None else DEFAULT_MODEL_FILE)
        self.trained = True

    def detect_and_resize_face(
        self, image: cv2.typing.MatLike
    ) -> cv2.typing.MatLike | None:
        resized_width, resized_height = (50, 38)
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        detected_faces = self.cascade_classifier.detectMultiScale(
            gray_image, scaleFactor=1.01, minNeighbors=4, minSize=(30, 30)
        )

        if len(detected_faces) == 0:
            return None

        x, y, w, h = detected_faces[0]
        face_roi = gray_image[y : y + h, x : x + w]
        resized_face = cv2.resize(face_roi, (resized_width, resized_height))

        return resized_face

    def training_data_setup(
        self, training_data_path: str = DEFAULT_TRAINING_DATA, default_label: int = None
    ) -> None:
        old_len_faces = len(self.faces)

        label = None
        for dir in os.listdir(training_data_path):
            if default_label is not None:
                label = default_label
            else:
                label = dir.split("s")
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

        if old_len_faces == len(self.faces):
            raise ValueError("No new classes have been added.")

    def train(self, file_name: str = None) -> None:
        if len(self.faces) == 0 or len(self.labels) == 0:
            raise ValueError(
                "The training dataset setup function has not been called before."
            )

        self.model.train(self.faces, np.array(self.labels))
        self.model.write(file_name if file_name is not None else DEFAULT_MODEL_FILE)
        self.trained = True

    def predict(
        self, test_image: cv2.typing.MatLike
    ) -> tuple[int, float] | tuple[None, None]:
        if not self.trained:
            raise ValueError(
                "The model has not been trained yet. Please train the model first."
            )

        face = self.detect_and_resize_face(test_image)
        if face is not None:
            label, confidence = self.model.predict(face)
            if confidence < 270:
                return label, confidence
            else:
                return None, None
        else:
            return None, None

    def add_class(
        self,
        model_file=DEFAULT_MODEL_FILE,
        new_class_path: str = "dataset/new_class",
        label=0,
    ) -> bool:
        """This function is designed to be called by Electron"""

        self.training_data_setup()
        self.training_data_setup(
            training_data_path=f"{BASE_PATH}{new_class_path}", default_label=label
        )
        self.train(file_name=model_file)
        return True


class Action(Enum):
    ADD_CLASS = "ADD_CLASS"
    TEST_IMG = "TEST_IMG"


class Args(TypedDict):
    action: str
    data: any


if __name__ == "__main__":
    args: Args = json.loads(argv[1])
    recognizer = FisherfaceFaceRecognizer()

    if args["action"] == Action.ADD_CLASS.value:
        recognizer.add_class(
            model_file=f"{BASE_PATH}{args['data']['modelFile']}",
            new_class_path=args["data"]["classPath"],
        )
        print(json.dumps({"result": True}))
    elif args["action"] == Action.TEST_IMG.value:
        pass
