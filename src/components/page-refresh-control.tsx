
"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const PULL_ACTIVATION_THRESHOLD = 20; // Pixels to pull down before indicator appears strongly
const PULL_TRIGGER_THRESHOLD = 70; // Pixels to pull down to trigger refresh
const MAX_VISUAL_PULL_DISTANCE = 90; // For visual feedback scaling

export function PageRefreshControl() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isRefreshingButton, setIsRefreshingButton] = useState(false);

  // Swipe to refresh states
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const [isProcessingSwipeRefresh, setIsProcessingSwipeRefresh] = useState(false);
  
  const touchStartY = useRef(0);
  const currentPullDistance = useRef(0);
  const isPullingActive = useRef(false); // Tracks if a pull gesture is currently active

  const handleRefreshClick = useCallback(async () => {
    setIsRefreshingButton(true);
    router.refresh();
    // The page reloads, so this state might be reset quickly.
    // The animation provides immediate feedback.
    setTimeout(() => setIsRefreshingButton(false), 1200);
  }, [router]);

  useEffect(() => {
    if (!isMobile) {
      // Reset states if view changes from mobile to desktop
      setShowSwipeIndicator(false);
      setIsProcessingSwipeRefresh(false);
      currentPullDistance.current = 0;
      touchStartY.current = 0;
      isPullingActive.current = false;
      return;
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && e.touches.length === 1) {
        touchStartY.current = e.touches[0].clientY;
        isPullingActive.current = true; // Gesture potentially starts
        currentPullDistance.current = 0; // Reset pull distance
        // Do not set showSwipeIndicator yet, only on move
      } else {
        isPullingActive.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingActive.current || e.touches.length !== 1) {
        return;
      }

      const touchCurrentY = e.touches[0].clientY;
      const pullAmount = touchCurrentY - touchStartY.current;

      if (pullAmount > 0) { // Pulling down
        // Prevent scrolling only when a pull gesture is clearly identified
        if (pullAmount > PULL_ACTIVATION_THRESHOLD / 2) { // Add a small buffer before preventing scroll
             if (e.cancelable) e.preventDefault();
        }
        currentPullDistance.current = Math.min(pullAmount, MAX_VISUAL_PULL_DISTANCE + 20); // Allow slight overpull for visual
        
        if (pullAmount > PULL_ACTIVATION_THRESHOLD) {
          if (!showSwipeIndicator) setShowSwipeIndicator(true);
        } else {
          if (showSwipeIndicator) setShowSwipeIndicator(false);
        }
      } else { 
        // If user scrolls up or gesture is not downwards from top
        isPullingActive.current = false;
        setShowSwipeIndicator(false);
        currentPullDistance.current = 0;
      }
    };

    const handleTouchEnd = () => {
      if (!isPullingActive.current) {
        return;
      }
      
      isPullingActive.current = false; // End of gesture

      if (currentPullDistance.current >= PULL_TRIGGER_THRESHOLD) {
        setShowSwipeIndicator(true); // Ensure indicator is visible
        setIsProcessingSwipeRefresh(true);
        router.refresh();
        // Visual states will be reset by page refresh
        // For a brief moment, keep indicator:
        setTimeout(() => {
            setShowSwipeIndicator(false);
            setIsProcessingSwipeRefresh(false);
            currentPullDistance.current = 0;
        }, 1500); // Longer than button to account for potential network
      } else {
        setShowSwipeIndicator(false);
        setIsProcessingSwipeRefresh(false);
        currentPullDistance.current = 0;
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isMobile, router, showSwipeIndicator]); // Added showSwipeIndicator to re-evaluate if needed

  // Visual indicator for swipe to refresh
  const displaySwipeIndicator = isMobile && (showSwipeIndicator || isProcessingSwipeRefresh);
  const effectivePullDistance = currentPullDistance.current;
  const iconScale = Math.min(1, Math.max(0.5, effectivePullDistance / PULL_TRIGGER_THRESHOLD));
  const iconOpacity = Math.min(1, Math.max(0, (effectivePullDistance - PULL_ACTIVATION_THRESHOLD/2) / (PULL_TRIGGER_THRESHOLD - PULL_ACTIVATION_THRESHOLD/2)));

  return (
    <>
      {displaySwipeIndicator && (
        <div
          style={{
            position: 'fixed',
            top: `${Math.min(20, effectivePullDistance / 4)}px`,
            left: '50%',
            transform: `translateX(-50%) scale(${iconScale})`,
            opacity: isProcessingSwipeRefresh ? 1 : iconOpacity,
            zIndex: 1000, // Ensure it's above other content
            transition: 'top 0.2s ease-out, transform 0.2s ease-out, opacity 0.2s ease-out',
          }}
          className="p-2 bg-card rounded-full shadow-lg"
        >
          <RefreshCcw
            className={`h-6 w-6 text-primary ${ (effectivePullDistance >= PULL_TRIGGER_THRESHOLD || isProcessingSwipeRefresh) ? 'animate-spin' : ''}`}
            style={{
                transform: (effectivePullDistance < PULL_TRIGGER_THRESHOLD && !isProcessingSwipeRefresh) ? `rotate(${effectivePullDistance * 2.5}deg)` : undefined,
            }}
          />
        </div>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={handleRefreshClick}
        aria-label="Refresh page"
      >
        <RefreshCcw className={`h-4 w-4 ${isRefreshingButton ? "animate-spin" : ""}`} />
      </Button>
    </>
  );
}
