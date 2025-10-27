/**
 * Audio Factory - Centralized audio element creation with CORS support
 * Provides a clean abstraction for creating audio elements with proper CORS configuration
 */

export interface AudioConfig {
  crossOrigin?: "anonymous" | "use-credentials";
  preload?: "none" | "metadata" | "auto";
  controls?: boolean;
}

export class AudioFactory {
  // Don't access `window` at module evaluation time — that breaks SSR/prerender.
  // Lazily capture the original Audio constructor when first needed.
  private static originalAudio: typeof Audio | null = null;
  private static isOverridden = false;

  /**
   * Creates a CORS-enabled audio element
   */
  static createCorsAudio(
    src?: string,
    config: AudioConfig = {}
  ): HTMLAudioElement {
    

    // Lazily initialize originalAudio reference if not set
    if (!this.originalAudio) {
      this.originalAudio = window.Audio;
    }

    // Always use the original Audio constructor to avoid circular reference
    const audio = new this.originalAudio();

    // Set CORS before any loading
    const crossOrigin = config.crossOrigin || "use-credentials";
    audio.crossOrigin = crossOrigin;
    audio.preload = config.preload || "metadata";

    if (config.controls !== undefined) {
      audio.controls = config.controls;
    }

    if (src) {
      audio.src = src;
    }

    console.log("🎵 AudioFactory: Created CORS-enabled audio element", {
      crossOrigin: audio.crossOrigin,
      src: audio.src,
      readyState: audio.readyState,
      timestamp: Date.now(),
    });

    return audio;
  }

  /**
   * Temporarily overrides the global Audio constructor to ensure CORS
   * This is used during Howler.js initialization
   */
  static enableCorsOverride(config: AudioConfig = {}): void {
    

    if (this.isOverridden) {
      console.log(
        "🎵 AudioFactory: CORS override already enabled, keeping active"
      );
      return;
    }

    // Capture the original Audio constructor lazily
    if (!this.originalAudio) {
      this.originalAudio = window.Audio;
    }
    this.isOverridden = true;

    window.Audio = function (src?: string) {
      const audio = AudioFactory.createCorsAudio(src, config);
      console.log("🎵 AudioFactory: Override used - created CORS audio", {
        crossOrigin: audio.crossOrigin,
        src: audio.src,
      });
      return audio;
    } as unknown as typeof Audio;

    console.log("🎵 AudioFactory: CORS override enabled");
  }

  /**
   * Restores the original Audio constructor
   */
  static disableCorsOverride(): void {
  

    if (!this.isOverridden || !this.originalAudio) {
      console.warn("🎵 AudioFactory: No CORS override to disable");
      return;
    }

    window.Audio = this.originalAudio;
    this.isOverridden = false;

    console.log("🎵 AudioFactory: CORS override disabled");
  }

  /**
   * Ensures CORS override is disabled (cleanup safety)
   */
  static ensureCleanup(): void {
    if (this.isOverridden) {
      this.disableCorsOverride();
    }
  }

  /**
   * Checks if an audio element has proper CORS configuration
   */
  static validateCors(audio: HTMLAudioElement): boolean {
    const isValid =
      audio.crossOrigin === "use-credentials" ||
      audio.crossOrigin === "anonymous";

    if (!isValid) {
      console.warn(
        "🎵 AudioFactory: Audio element missing CORS configuration",
        {
          crossOrigin: audio.crossOrigin,
          src: audio.src,
          readyState: audio.readyState,
          currentOverride: this.isOverridden,
        }
      );
    }

    return isValid;
  }

  /**
   * Check if CORS override is currently active
   */
  static isOverrideActive(): boolean {
    return this.isOverridden;
  }

  /**
   * Get detailed status for debugging
   */
  static getStatus(): { isOverridden: boolean; hasOriginal: boolean } {
    return {
      isOverridden: this.isOverridden,
      hasOriginal: !!this.originalAudio,
    };
  }
}
