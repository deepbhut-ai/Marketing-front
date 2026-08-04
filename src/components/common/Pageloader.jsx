"use client";

import styles from "./Pageloader.module.css";
import { useUserContext } from "@/context/UserContext"; // adjust path to wherever your context lives

/**
 * Full-screen page loader.
 * - Icons are fixed in place and pulse (grow/shrink).
 * - A gradient "snake" trail continuously loops around the icons,
 *   swelling out near LinkedIn / WhatsApp / Facebook / Instagram / X
 *   and skipping past YouTube.
 * - Colors switch between light/dark using isdark from useUserContext().
 */
export default function PageLoader() {
  const { isdark } = useUserContext();

  const loopPath =
    "M193.00,85.00 C193.00,92.50 132.97,91.91 123.97,107.50 C114.97,123.09 145.50,174.78 139.00,178.53 C132.50,182.28 103.00,130.00 85.00,130.00 C67.00,130.00 37.50,182.28 31.00,178.53 C24.50,174.78 55.03,123.09 46.03,107.50 C37.03,91.91 -23.00,92.50 -23.00,85.00 C-23.00,77.50 37.03,78.09 46.03,62.50 C55.03,46.91 24.50,-4.78 31.00,-8.53 C37.50,-12.28 67.00,40.00 85.00,40.00 C103.00,40.00 132.50,-12.28 139.00,-8.53 C145.50,-4.78 114.97,46.91 123.97,62.50 C132.97,78.09 193.00,77.50 193.00,85.00 Z";

  return (
    <div className={`${styles.root} ${isdark ? styles.dark : ""}`}>
      <div className={styles.loaderWrap}>
        <div className={styles.orbit}>
          <svg className={styles.loopSvg} viewBox="0 0 170 170">
            <defs>
              <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "var(--purple)" }} />
                <stop offset="50%" style={{ stopColor: "var(--pink)" }} />
                <stop offset="100%" style={{ stopColor: "var(--teal)" }} />
              </linearGradient>
            </defs>
            <path className={styles.trackPath} d={loopPath} />
            <path className={styles.snakePath} d={loopPath} />
          </svg>

          {/* Facebook */}
          <div className={`${styles.iconSlot} ${styles.slot1}`}>
            <div className={styles.iconBubble}>
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
              </svg>
            </div>
          </div>

          {/* Instagram */}
          <div className={`${styles.iconSlot} ${styles.slot2}`}>
            <div className={styles.iconBubble}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
              </svg>
            </div>
          </div>

          {/* X */}
          <div className={`${styles.iconSlot} ${styles.slot3}`}>
            <div className={styles.iconBubble}>
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M18.9 2H22l-7.2 8.2L23.3 22h-6.9l-5.4-7-6.2 7H1.3l7.7-8.8L1 2h7.1l4.9 6.4L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
              </svg>
            </div>
          </div>

          {/* YouTube */}
          <div className={`${styles.iconSlot} ${styles.slot4}`}>
            <div className={styles.iconBubble}>
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M21.6 7.2s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C15.9 3.8 12 3.8 12 3.8h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1 1-.6.7-.8 2.2-.8 2.2S2.2 9 2.2 10.7v1.6C2.2 14 2.4 15.8 2.4 15.8s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 7.4.2 7.4.2s3.9 0 6.7-.3c.4 0 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.2-1.7.2-3.5v-1.6c0-1.7-.2-3.4-.2-3.4ZM9.8 14.6V8.9l5.4 2.9-5.4 2.8Z" />
              </svg>
            </div>
          </div>

          {/* LinkedIn */}
          <div className={`${styles.iconSlot} ${styles.slot5}`}>
            <div className={styles.iconBubble}>
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M6.94 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM3 21h4V8H3v13Zm7-13h3.8v1.8h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.64 4.76 6.08V21h-4v-6.4c0-1.52-.03-3.48-2.12-3.48-2.12 0-2.45 1.66-2.45 3.37V21h-4V8Z" />
              </svg>
            </div>
          </div>

          {/* WhatsApp */}
          <div className={`${styles.iconSlot} ${styles.slot6}`}>
            <div className={styles.iconBubble}>
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M17.5 3.5A8.5 8.5 0 0 0 5.4 15L4 20l5.1-1.4a8.5 8.5 0 0 0 12.2-7.5 8.44 8.44 0 0 0-3.8-7.6ZM12 19.1a7 7 0 0 1-3.6-1l-.26-.16-3 .8.8-2.9-.17-.28A7.05 7.05 0 1 1 19.1 12 7.06 7.06 0 0 1 12 19.1Zm3.9-5.3c-.2-.1-1.2-.6-1.4-.7-.2-.1-.34-.1-.48.1-.14.2-.55.7-.68.85-.12.14-.25.16-.46.05-.2-.1-.87-.32-1.66-1.02-.6-.55-1.02-1.22-1.14-1.43-.12-.2 0-.32.1-.42.1-.1.2-.25.3-.37.1-.13.14-.2.2-.34.06-.14.03-.27-.02-.37-.05-.1-.48-1.15-.66-1.58-.17-.4-.35-.35-.48-.36h-.4c-.14 0-.37.05-.56.27-.2.2-.73.72-.73 1.75s.75 2.03.86 2.17c.1.14 1.47 2.24 3.56 3.14.5.22.88.34 1.19.44.5.16.95.14 1.3.08.4-.06 1.2-.5 1.37-.97.17-.48.17-.9.12-.98-.05-.1-.18-.15-.38-.24Z" />
              </svg>
            </div>
          </div>

          <div className={styles.orbitCore} />
        </div>

        <div>
          <div className={styles.loaderBrand}>Makingira</div>
          <div className={styles.loaderText}>Connecting your platforms...</div>
        </div>
      </div>
    </div>
  );
}