import { create } from "zustand";

//Global store to hold the selected city
const useCityStore = create((set) => ({
    city: '',
    setCity: (value) => set((state) => ({
        city: (value ?? '').trim()
    })),
    deleteCity: () => set((state) => ({
        city: ""
    })),
}))

export default useCityStore;