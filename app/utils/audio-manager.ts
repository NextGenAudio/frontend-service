/**
 * Audio Manager - High-level audio management with CORS support
 * Handles Howler.js integration and provides event-driven architecture
 */

import { Howl, HowlOptions } from "howler";
import { AudioFactory } from "./audio-factory";

export interface AudioReadyEvent {
  audioElement: HTMLAudioElement | null;
  howlInstance: Howl;
  hasCors: boolean;
}

export interface EnhancedHowlOptions extends HowlOptions {
  corsConfig?: {
    enabled: boolean;
    mode?: "anonymous" | "use-credentials";
  };
}

export class AudioManager {
  private static instance: AudioManager;
  private currentHowl: Howl | null = null;
  private eventTarget = new EventTarget();

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Creates a new Howl instance with CORS support
   */
  async createHowl(options: EnhancedHowlOptions): Promise<Howl> {
    // Cleanup previous instance
    if (this.currentHowl) {
      this.currentHowl.unload();
    }

    const corsEnabled = options.corsConfig?.enabled ?? true;
    const corsMode = options.corsConfig?.mode ?? "use-credentials";

    console.log("🎵 AudioManager: Creating Howl with CORS support", {
      corsEnabled,
      corsMode,
      src: options.src,
      factoryStatus: AudioFactory.getStatus(),
    });

    // More aggressive CORS override approach
    if (corsEnabled && options.html5) {
      // Enable override before creating Howl
      AudioFactory.enableCorsOverride({
        crossOrigin: corsMode,
        preload: "metadata",
      });
      console.log(
        "🎵 AudioManager: CORS override status after enable:",
        AudioFactory.getStatus()
      );

      // Also monitor for any audio elements created
      const audioElements: HTMLAudioElement[] = [];
      const originalCreateElement = document.createElement.bind(document);

      document.createElement = function (
        tagName: string,
        options?: ElementCreationOptions
      ) {
        const element = originalCreateElement(tagName, options);

        if (tagName.toLowerCase() === "audio") {
          console.log(
            "🎵 AudioManager: Detected audio element creation via createElement"
          );
          const audio = element as HTMLAudioElement;
          if (!audio.crossOrigin) {
            audio.crossOrigin = corsMode;
            console.log("🎵 AudioManager: Applied CORS to createElement audio");
          }
          audioElements.push(audio);
        }

        return element;
      };

      // Restore createElement after a delay
      setTimeout(() => {
        document.createElement = originalCreateElement;
        console.log("🎵 AudioManager: Restored original createElement");
      }, 1000);
    }

    const howl = new Howl({
      ...options,
      onload: () => {
        console.log("🎵 AudioManager: Howl onload triggered");

        // Use setTimeout to ensure audio element is fully initialized
        setTimeout(() => {
          const audioElement = this.getAudioElement(howl);
          let hasCors = false;

          if (audioElement) {
            console.log("🎵 AudioManager: Audio element found", {
              crossOrigin: audioElement.crossOrigin,
              src: audioElement.src,
              readyState: audioElement.readyState,
            });

            // Force CORS if needed
            if (corsEnabled && !audioElement.crossOrigin) {
              console.log(
                "🎵 AudioManager: Setting CORS on audio element post-creation"
              );
              audioElement.crossOrigin = corsMode;

              // If audio has already started loading, we need to reload it
              if (audioElement.readyState > 0) {
                const currentTime = audioElement.currentTime;
                const wasPlaying = !audioElement.paused;

                console.log("🎵 AudioManager: Reloading audio with CORS");
                audioElement.load();

                if (wasPlaying) {
                  audioElement.currentTime = currentTime;
                  audioElement.play().catch(console.error);
                }
              }
            }

            hasCors = AudioFactory.validateCors(audioElement);
          } else {
            console.warn("🎵 AudioManager: No audio element found in Howl");
          }

          console.log("🎵 AudioManager: Audio loaded", {
            hasAudioElement: !!audioElement,
            hasCors,
            crossOrigin: audioElement?.crossOrigin,
          });

          // Dispatch audio ready event
          this.dispatchAudioReady({
            audioElement,
            howlInstance: howl,
            hasCors,
          });

          // Disable override after everything is set up
          if (corsEnabled && options.html5) {
            setTimeout(() => {
              AudioFactory.disableCorsOverride();
            }, 500);
          }

          // Call original onload if provided
          if (options.onload) {
            options.onload.call(howl, 0);
          }
        }, 50);
      },
      onloaderror: (id: number, error: unknown) => {
        console.error("🎵 AudioManager: Load error", error);

        // Ensure cleanup on error
        if (corsEnabled && options.html5) {
          AudioFactory.disableCorsOverride();
        }

        // Call original onloaderror if provided
        if (options.onloaderror) {
          options.onloaderror.call(howl, id, error);
        }
      },
    });

    this.currentHowl = howl;
    return howl;
  }

  /**
   * Gets the HTML audio element from a Howl instance
   */
  private getAudioElement(howl: Howl): HTMLAudioElement | null {
    try {
      // Howler's _sounds is typed as any, but we can type it more safely
      const sounds = (
        howl as unknown as { _sounds?: Array<{ _node?: HTMLAudioElement }> }
      )._sounds;
      return sounds?.[0]?._node || null;
    } catch (error) {
      console.warn("🎵 AudioManager: Could not get audio element", error);
      return null;
    }
  }

  /**
   * Dispatches the audioReady event
   */
  private dispatchAudioReady(eventData: AudioReadyEvent): void {
    const event = new CustomEvent("audioReady", {
      detail: eventData,
    });

    // Dispatch on both window and internal event target
    window.dispatchEvent(event);
    this.eventTarget.dispatchEvent(event);

    console.log("🎵 AudioManager: audioReady event dispatched", eventData);
  }

  /**
   * Adds event listener for audio events
   */
  addEventListener(type: string, listener: EventListener): void {
    this.eventTarget.addEventListener(type, listener);
  }

  /**
   * Removes event listener
   */
  removeEventListener(type: string, listener: EventListener): void {
    this.eventTarget.removeEventListener(type, listener);
  }

  /**
   * Cleanup all resources
   */
  cleanup(): void {
    if (this.currentHowl) {
      this.currentHowl.unload();
      this.currentHowl = null;
    }

    AudioFactory.ensureCleanup();
    console.log("🎵 AudioManager: Cleanup completed");
  }

  /**
   * Gets the current Howl instance
   */
  getCurrentHowl(): Howl | null {
    return this.currentHowl;
  }
}
