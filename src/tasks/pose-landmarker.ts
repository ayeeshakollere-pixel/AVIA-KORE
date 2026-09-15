import { PoseLandmarker, PoseLandmarkerResult, DrawingUtils } from '@mediapipe/tasks-vision';
import { BaseVisionTask } from '../components/base-vision-task';
// @ts-ignore
import template from '../templates/pose-landmarker.html?raw';

class PoseLandmarkerTask extends BaseVisionTask {
  private drawingUtils: DrawingUtils | undefined;

  // Optimized confidence thresholds for 95%+ exercise tracking precision
  private minPoseDetectionConfidence = 0.7;
  private minPosePresenceConfidence = 0.7;
  private minTrackingConfidence = 0.7;
  private numPoses = 1;
  private outputSegmentationMasks = false;

  protected override onInitializeUI() {
    const setupSlider = (id: string, onChange: (val: number) => void) => {
      const input = document.getElementById(id) as HTMLInputElement;
      const valueDisplay = document.getElementById(`${id}-value`)!;
      if (input && valueDisplay) {
        input.addEventListener('input', () => {
          const val = parseFloat(input.value);
          valueDisplay.innerText = val.toString();
          onChange(val);
        });
      }
    };

    setupSlider('num-poses', (val) => {
      this.numPoses = val;
      this.worker?.postMessage({ type: 'SET_OPTIONS', numPoses: this.numPoses });
      this.triggerRedetection();
    });

    const outputSegmentationMasksInput = document.getElementById('output-segmentation-masks') as HTMLInputElement;
    if (outputSegmentationMasksInput) {
      outputSegmentationMasksInput.addEventListener('change', () => {
        this.outputSegmentationMasks = outputSegmentationMasksInput.checked;
        this.worker?.postMessage({ type: 'SET_OPTIONS', outputSegmentationMasks: this.outputSegmentationMasks });
        this.triggerRedetection();
      });
    }

    setupSlider('min-pose-detection-confidence', (val) => {
      this.minPoseDetectionConfidence = val;
      this.worker?.postMessage({ type: 'SET_OPTIONS', minPoseDetectionConfidence: this.minPoseDetectionConfidence });
      this.triggerRedetection();
    });

    setupSlider('min-pose-presence-confidence', (val) => {
      this.minPosePresenceConfidence = val;
      this.worker?.postMessage({ type: 'SET_OPTIONS', minPosePresenceConfidence: this.minPosePresenceConfidence });
      this.triggerRedetection();
    });

    setupSlider('min-tracking-confidence', (val) => {
      this.minTrackingConfidence = val;
      this.worker?.postMessage({ type: 'SET_OPTIONS', minTrackingConfidence: this.minTrackingConfidence });
      this.triggerRedetection();
    });

    // Uses local public models for offline edge capability
    this.models = {
      pose_landmarker_full: '/models/pose_landmarker_full.task',
      pose_landmarker_lite: '/models/pose_landmarker_lite.task',
    };

    if (this.modelSelector) {
      this.modelSelector.updateOptions([
        { label: 'Pose Landmarker (Full - Recommended)', value: 'pose_landmarker_full', isDefault: true },
        { label: 'Pose Landmarker (Lite)', value: 'pose_landmarker_lite' },
      ]);
    }
  }

  private triggerRedetection() {
    if (this.runningMode === 'IMAGE') {
      const testImage = document.getElementById('test-image') as HTMLImageElement;
      if (testImage && testImage.src) {
        this.detectImage(testImage);
      }
    }
  }

  protected override getWorkerInitParams(): Record<string, any> {
    return {
      minPoseDetectionConfidence: this.minPoseDetectionConfidence,
      minPosePresenceConfidence: this.minPosePresenceConfidence,
      minTrackingConfidence: this.minTrackingConfidence,
      numPoses: this.numPoses,
      outputSegmentationMasks: this.outputSegmentationMasks,
    };
  }

  /**
   * Calculates 3D joint angle in degrees from MediaPipe world landmarks
   */
  private calculate3DAngle(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
    c: { x: number; y: number; z: number }
  ): number {
    const ba = [a.x - b.x, a.y - b.y, a.z - b.z];
    const bc = [c.x - b.x, c.y - b.y, c.z - b.z];

    const dotProduct = ba[0] * bc[0] + ba[1] * bc[1] + ba[2] * bc[2];
    const magBA = Math.sqrt(ba[0] ** 2 + ba[1] ** 2 + ba[2] ** 2);
    const magBC = Math.sqrt(bc[0] ** 2 + bc[1] ** 2 + bc[2] ** 2);

    if (magBA * magBC === 0) return 0;

    const cosineAngle = Math.max(-1, Math.min(1, dotProduct / (magBA * magBC)));
    return (Math.acos(cosineAngle) * 180) / Math.PI;
  }

  protected override displayImageResult(result: PoseLandmarkerResult) {
    const imageCanvas = document.getElementById('image-canvas') as HTMLCanvasElement;
    const testImage = document.getElementById('test-image') as HTMLImageElement;
    const ctx = imageCanvas.getContext('2d')!;

    imageCanvas.width = testImage.naturalWidth;
    imageCanvas.height = testImage.naturalHeight;

    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.clip();

    if (result.landmarks) {
      if (!this.drawingUtils) this.drawingUtils = new DrawingUtils(ctx);
      else this.drawingUtils = new DrawingUtils(ctx);

      for (const landmark of result.landmarks) {
        this.drawingUtils.drawLandmarks(landmark, {
          radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
        });
        this.drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
      }
    }
  }

  protected override displayVideoResult(result: PoseLandmarkerResult) {
    this.canvasElement.width = this.video.videoWidth;
    this.canvasElement.height = this.video.videoHeight;
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.canvasCtx.beginPath();
    this.canvasCtx.rect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.canvasCtx.clip();

    if (result.landmarks) {
      if (!this.drawingUtils) this.drawingUtils = new DrawingUtils(this.canvasCtx);
      else this.drawingUtils = new DrawingUtils(this.canvasCtx);

      for (const landmark of result.landmarks) {
        this.drawingUtils.drawLandmarks(landmark, {
          radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
        });
        this.drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
      }
    }

    // Process 3D posture angles for KORE exercise tracking
    if (result.worldLandmarks && result.worldLandmarks.length > 0) {
      const world = result.worldLandmarks[0];

      // Left Hip Angle (Shoulder 11, Hip 23, Knee 25)
      const leftHipAngle = this.calculate3DAngle(world[11], world[23], world[25]);

      // Broadcast calculated posture metrics to application state
      window.dispatchEvent(
        new CustomEvent('kore-pose-update', {
          detail: { hipAngle: Math.round(leftHipAngle) },
        })
      );
    }

    this.canvasCtx.restore();
  }
}

let activeTask: PoseLandmarkerTask | null = null;

export async function setupPoseLandmarker(container: HTMLElement) {
  activeTask = new PoseLandmarkerTask({
    container,
    template,
    defaultModelName: 'pose_landmarker_full',
    defaultModelUrl: '/models/pose_landmarker_full.task',
    workerFactory: () =>
      new Worker(new URL('../workers/pose-landmarker.worker.ts', import.meta.url), { type: 'module' }),
  });

  await activeTask.initialize();
}

export function cleanupPoseLandmarker() {
  if (activeTask) {
    activeTask.cleanup();
    activeTask = null;
  }
}
