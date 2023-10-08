import os
import sys

import json
import re
from enum import Enum

import cv2
import numpy as np

from typing import List, TypedDict
import cv2.typing

BASE_PATH: str = None

if getattr(sys, "frozen", False):
    BASE_PATH = os.path.dirname(sys.executable)
elif __file__:
    BASE_PATH = os.path.dirname(__file__)

DEFAULT_MODEL_FILE = os.path.join(BASE_PATH, "classifierFisherface.xml")
DEFAULT_TRAINING_DATA = os.path.join(
    BASE_PATH, "dataset", "AT&T Database of Faces", "training-data"
)


def debug_img(img: cv2.typing.MatLike):
    cv2.imshow("DEBUG", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


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
            os.path.join(BASE_PATH, "haarcascade_frontalface_default.xml")
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

    def preprocess_img(
        self, img: cv2.typing.MatLike
    ) -> cv2.typing.MatLike | None:
        resized_width, resized_height = (25, 25)
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        detected_faces = self.cascade_classifier.detectMultiScale(
            gray_img, scaleFactor=1.2, minNeighbors=3, minSize=(25, 25)
        )

        if len(detected_faces) == 0:
            """DEBUG"""
            # debug_img(gray_img)
            return None

        x, y, w, h = detected_faces[0]
        face_roi = gray_img[y: y + h, x: x + w]
        resized_face = cv2.resize(face_roi, (resized_width, resized_height))

        return resized_face

    def training_data_setup(
        self, training_data_path: str = DEFAULT_TRAINING_DATA, default_label: int = None
    ) -> None:
        old_len_faces = len(self.faces)

        label = None
        for dir in os.listdir(training_data_path):
            if dir.startswith("."):
                continue

            if default_label is not None:
                label = default_label
            else:
                label = dir.split("s")
                label = int(label[1] if len(label) >= 1 else label[0])

            for pathImg in os.listdir(os.path.join(training_data_path, dir)):
                if pathImg.startswith("."):
                    continue
                pathImg = os.path.join(training_data_path, dir, pathImg)
                img = cv2.imread(pathImg)
                detected_face = self.preprocess_img(img)

                if detected_face is not None:
                    self.faces.append(detected_face)
                    self.labels.append(label)

                """DEBUG"""
                # if detected_face is None:
                #     print(f"label: {dir}, img: {pathImg}")

        if old_len_faces == len(self.faces) or len(self.faces) <= (old_len_faces + 7):
            raise ValueError("No new classes have been added.")

    def train(self, file_name: str = None) -> None:
        if len(self.faces) == 0 or len(self.labels) == 0:
            raise ValueError(
                "The training dataset setup function has not been called before."
            )

        self.model.train(self.faces, np.array(self.labels))
        self.model.write(
            file_name if file_name is not None else DEFAULT_MODEL_FILE)
        self.trained = True

    def predict(
        self, test_img: cv2.typing.MatLike, _confidence: int = None
    ) -> tuple[int, float] | tuple[None, None]:
        if not self.trained:
            raise ValueError(
                "The model has not been trained yet. Please train the model first."
            )

        detected_face = self.preprocess_img(test_img)

        if detected_face is not None:
            label, confidence = self.model.predict(detected_face)
            if confidence < (_confidence if _confidence is not None else 215):
                return label, confidence
            else:
                return None, None
        else:
            return None, None

    def add_class(
        self,
        model_file=DEFAULT_MODEL_FILE,
        new_class_path: str = os.path.join(BASE_PATH, "dataset", "new_class"),
        label=0,
    ) -> bool:
        """This function is designed to be called by Electron"""

        self.training_data_setup()
        self.training_data_setup(
            training_data_path=new_class_path, default_label=label)
        self.train(file_name=model_file)
        return True


class Action(Enum):
    ADD_CLASS = "ADD_CLASS"
    TEST_IMG = "TEST_IMG"


class Args(TypedDict):
    action: str
    data: any


if __name__ == "__main__":
    args: Args = json.loads(sys.argv[1])
    recognizer = FisherfaceFaceRecognizer()

    if args["action"] == Action.ADD_CLASS.value:
        recognizer.add_class(
            model_file=os.path.join(
                BASE_PATH, *re.split(r"[\\/]", args["data"]["modelFile"])
            ),
            new_class_path=os.path.join(
                BASE_PATH, *re.split(r"[\\/]", args["data"]["classPath"])
            ),
        )

        print(json.dumps({"result": True}))
    elif args["action"] == Action.TEST_IMG.value:
        recognizer.load_model(
            os.path.join(
                BASE_PATH, *re.split(r"[\\/]", args["data"]["modelFile"]))
        )

        test_result: List[tuple[int, float]] = []

        for img_path in args["data"]["testImagesPath"]:
            label, confidence = recognizer.predict(
                cv2.imread(
                    os.path.join(
                        BASE_PATH, *
                        re.split(r"[\\/]", img_path)
                    )
                ),
            )

            if label is not None and confidence is not None:
                test_result.append((label, confidence))

        if len(test_result) > 0:
            label, confidence = min(test_result, key=lambda x: x[1])
            print(json.dumps({"label": label, "confidence": confidence}))
        else:
            print(json.dumps({"label": None, "confidence": None}))
