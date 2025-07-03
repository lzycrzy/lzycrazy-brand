import {create} from 'zustand'

export const useProduct = create((set, get) => ({
    isAddProductModal: false,

    setIsAddProductMadal: (value) => {
        set({isAddProductModal: value})
    }
}))


export const ProductDetails = create((set, get) => ({
    product: [],

    setProductDetails: (data) => {
        set({product: data})
    }
}))