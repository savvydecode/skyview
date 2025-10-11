import { create } from "zustand";

//Global store to hold the selected city
const useCityStore = create((set) => ({
    city: '',
    setCity: (value) => set((state) => ({
        city: (value ?? '').trim()
    })),
    setCity: () => set((state) => ({
        city: ""
    })),
}))

export default useCityStore;