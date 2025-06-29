import {create} from 'zustand'

export const useProduct = create((set, get) => ({
    isAddProductModal: false,

    setIsAddProductMadal: (value) => {
        set({isAddProductModal: value})
    }
}))
