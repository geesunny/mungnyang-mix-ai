import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

export async function getModel() {
    if (model) return model;
    if (tf.getBackend() === 'webgl') await tf.setBackend('webgl');
    await tf.ready();
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    return model;
}

export async function classifyImage(el: HTMLImageElement, topk = 5) {
    const model = await getModel();
    return model.classify(el, topk);
}
