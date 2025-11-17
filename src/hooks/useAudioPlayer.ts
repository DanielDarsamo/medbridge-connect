import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface AudioPlayerOptions {
  onPlaybackEnd?: () => void;
  onError?: (error: Error) => void;
}

export const useAudioPlayer = (options: AudioPlayerOptions = {}) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  // Initialize AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  // Progress tracking
  const updateProgress = useCallback(() => {
    if (!audioContextRef.current || !bufferRef.current || playbackState !== 'playing') {
      return;
    }

    const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
    const progressPercent = (elapsed / bufferRef.current.duration) * 100;
    
    setProgress(Math.min(progressPercent, 100));

    if (progressPercent < 100) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [playbackState]);

  const stopTracking = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const loadAudio = useCallback(async (storagePath: string): Promise<AudioBuffer> => {
    if (!audioContextRef.current) {
      throw new Error('AudioContext not initialized');
    }

    setPlaybackState('loading');
    
    try {
      // Get public URL from Supabase Storage
      const { data } = supabase.storage
        .from('medical-audio')
        .getPublicUrl(storagePath);

      if (!data?.publicUrl) {
        throw new Error('Failed to get audio URL');
      }

      // Fetch audio file
      const response = await fetch(data.publicUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      
      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      return audioBuffer;
    } catch (error) {
      setPlaybackState('error');
      const err = error instanceof Error ? error : new Error('Failed to load audio');
      options.onError?.(err);
      toast({
        title: 'Audio Error',
        description: 'Failed to load audio file',
        variant: 'destructive',
      });
      throw err;
    }
  }, [options, toast]);

  const play = useCallback(async (storagePath: string, forceReload = false) => {
    if (!audioContextRef.current) {
      console.error('AudioContext not initialized');
      return;
    }

    // Stop current playback if any
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    stopTracking();

    try {
      // Load audio buffer if needed
      if (forceReload || !bufferRef.current || currentAudioUrl !== storagePath) {
        bufferRef.current = await loadAudio(storagePath);
        setCurrentAudioUrl(storagePath);
        setDuration(bufferRef.current.duration);
      }

      // Resume AudioContext if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create new source
      const source = audioContextRef.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.connect(audioContextRef.current.destination);

      // Handle playback end
      source.onended = () => {
        setPlaybackState('idle');
        setProgress(0);
        stopTracking();
        sourceRef.current = null;
        options.onPlaybackEnd?.();
      };

      // Start playback
      startTimeRef.current = audioContextRef.current.currentTime - pauseTimeRef.current;
      source.start(0, pauseTimeRef.current);
      sourceRef.current = source;
      
      setPlaybackState('playing');
      pauseTimeRef.current = 0;
      
      // Start progress tracking
      animationFrameRef.current = requestAnimationFrame(updateProgress);

    } catch (error) {
      console.error('Playback error:', error);
      setPlaybackState('error');
    }
  }, [currentAudioUrl, loadAudio, options, stopTracking, updateProgress]);

  const pause = useCallback(() => {
    if (sourceRef.current && audioContextRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
      
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      setPlaybackState('paused');
      stopTracking();
    }
  }, [stopTracking]);

  const stop = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    stopTracking();
    setPlaybackState('idle');
    setProgress(0);
    pauseTimeRef.current = 0;
    startTimeRef.current = 0;
  }, [stopTracking]);

  const resume = useCallback(() => {
    if (currentAudioUrl && playbackState === 'paused') {
      play(currentAudioUrl, false);
    }
  }, [currentAudioUrl, play, playbackState]);

  return {
    play,
    pause,
    stop,
    resume,
    playbackState,
    progress,
    duration,
    isPlaying: playbackState === 'playing',
    isLoading: playbackState === 'loading',
    isPaused: playbackState === 'paused',
  };
};
