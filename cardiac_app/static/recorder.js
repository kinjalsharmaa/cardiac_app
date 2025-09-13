// recorder.js
class Recorder {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.chunks = [];
        this.stream = null;
    }

    async start() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
            this.mediaRecorder.onstop = () => {
                this.stream.getTracks().forEach(track => track.stop());
            };
            this.mediaRecorder.start();
            this.isRecording = true;
        } catch (err) {
            console.error('Error starting audio recording:', err);
        }
    }

    stop() {
        if (this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
        }
    }

    getBlob(callback) {
        const blob = new Blob(this.chunks, { type: 'audio/wav' });
        callback(blob);
    }
}
