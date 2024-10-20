import tensorflow as tf

import tensorflow_hub as hub

raw = input()

NAME_TO_HANDLE = {
    # trained on SPAQ dataset: https://github.com/h4nwei/SPAQ
    "spaq": "./src/modules/musiq/musiq-tensorflow2-spaq-v1",
    # trained on AVA dataset: https://ieeexplore.ieee.org/document/6247954
    "ava": "./src/modules/musiq/musiq-tensorflow2-ava-v1",
}

selected_model = "spaq"  # @param ['spaq',  'ava']

model_handle = NAME_TO_HANDLE[selected_model]
model = hub.load(model_handle)
predict_fn = model.signatures["serving_default"]

print(f"loaded model {selected_model} ({model_handle})")

prediction = predict_fn(tf.constant(raw))
print("predicted MOS_Spaq: ", prediction)  # out of 100
