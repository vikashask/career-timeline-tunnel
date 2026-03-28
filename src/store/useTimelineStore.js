import { create } from 'zustand';

const useTimelineStore = create((set) => ({
  cameraZ: 0,
  targetZ: 0,
  activePortal: null,
  isDetailView: false,
  hoveredPortal: null,

  setCameraZ: (z) => set({ cameraZ: z }),
  setTargetZ: (z) => set({ targetZ: z }),

  enterPortal: (portalData) =>
    set({
      activePortal: portalData,
      isDetailView: true,
    }),

  exitPortal: () =>
    set({
      activePortal: null,
      isDetailView: false,
    }),

  setHoveredPortal: (portalData) => set({ hoveredPortal: portalData }),
}));

export default useTimelineStore;
