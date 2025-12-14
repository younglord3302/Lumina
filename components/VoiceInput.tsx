import React, { useState, useRef } from 'react';
import { Mic, Loader2, Square, AlertCircle } from 'lucide-react';
import { transcribeAudio } from '../services/geminiService';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setPermissionError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          const text = await transcribeAudio(base64Audio);
          if (text) {
            onTranscript(text);
          }
          setIsProcessing(false);
        };
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setPermissionError(true);
      // Reset error after 3 seconds
      setTimeout(() => setPermissionError(false), 3000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`p-2 rounded-full transition-all ${
          permissionError
            ? 'bg-red-100 text-red-500'
            : isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : isProcessing
                ? 'bg-slate-100 text-slate-400'
                : 'text-slate-400 hover:text-primary hover:bg-slate-100'
        }`}
        title={permissionError ? "Microphone permission denied" : "Voice Search"}
      >
        {isProcessing ? (
          <Loader2 size={20} className="animate-spin" />
        ) : permissionError ? (
          <AlertCircle size={20} />
        ) : isRecording ? (
          <Square size={20} fill="currentColor" />
        ) : (
          <Mic size={20} />
        )}
      </button>
      {permissionError && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
          Check mic permissions
        </div>
      )}
    </div>
  );
};
