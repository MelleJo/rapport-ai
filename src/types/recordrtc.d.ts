declare module 'recordrtc' {
    export default class RecordRTC {
      static StereoAudioRecorder: any;
  
      constructor(stream: MediaStream, options?: {
        type?: string;
        mimeType?: string;
        recorderType?: any;
        disableLogs?: boolean;
        timeSlice?: number;
        ondataavailable?: (blob: Blob) => void;
        onTimeStamp?: (timestamp: number) => void;
      });
  
      startRecording(): void;
      stopRecording(callback?: (audioVideoWebMURL: string) => void): void;
      getBlob(): Blob;
      toURL(): string;
      save(fileName?: string): void;
      destroy(): void;
    }
  }