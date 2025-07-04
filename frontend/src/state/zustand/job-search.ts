import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface JobSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useJobSearchStore = create<JobSearchState>()(
  devtools((set) => ({
    searchQuery: '',
    setSearchQuery: (query: string) => set({ searchQuery: query }),
  }))
);

export default useJobSearchStore; 