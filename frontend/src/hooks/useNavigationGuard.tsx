import { useEffect, useRef, useState } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';

interface UseNavigationGuardOptions {
  hasUnsavedChanges: boolean;
  onConfirmNavigation?: () => void;
  onCancelNavigation?: () => void;
}

export const useNavigationGuard = ({ 
  hasUnsavedChanges, 
  onConfirmNavigation,
  onCancelNavigation 
}: UseNavigationGuardOptions) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();
  const bypassNextRef = useRef(false);

  // Block all navigation when there are unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      if (bypassNextRef.current) {
        // consume bypass and allow this navigation
        bypassNextRef.current = false;
        return false;
      }
      const shouldBlock = hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname;
      console.log('Navigation blocked:', { 
        hasUnsavedChanges, 
        currentPath: currentLocation.pathname, 
        nextPath: nextLocation.pathname, 
        shouldBlock 
      });
      return shouldBlock;
    }
  );

  // Handle browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Handle blocked navigation
  useEffect(() => {
    console.log('Blocker state changed:', blocker.state, blocker.location?.pathname);
    if (blocker.state === 'blocked' && blocker.location) {
      console.log('Showing confirmation modal for blocked navigation');
      setPendingNavigation(blocker.location.pathname);
      setShowConfirmModal(true);
    }
  }, [blocker.state, blocker.location]);

  // Handle programmatic navigation
  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowConfirmModal(true);
    } else {
      navigate(path);
    }
  };

  const confirmNavigation = () => {
    // Bypass guard for this one transition
    bypassNextRef.current = true;
    setShowConfirmModal(false);

    if (blocker.state === 'blocked') {
      // Proceed with the blocked transition (works for browser back/forward)
      blocker.proceed();
      setPendingNavigation(null);
      onConfirmNavigation?.();
      return;
    }

    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
      onConfirmNavigation?.();
      return;
    }
  };

  const cancelNavigation = () => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
    setPendingNavigation(null);
    setShowConfirmModal(false);
    onCancelNavigation?.();
  };

  return {
    showConfirmModal,
    confirmNavigation,
    cancelNavigation,
    handleNavigation,
    // navigate once without triggering the guard/modal
    navigateBypassingGuard: (path: string) => {
      bypassNextRef.current = true;
      navigate(path);
    },
  };
};
