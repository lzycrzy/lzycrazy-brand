import {create} from 'zustand'

export const useProduct = create((set, get) => ({
    isAddProductModal: false,
    isEditing: false,
    editData: [],

    setIsAddProductModal: (value) => {
        set({isAddProductModal: value})
    },

    setIsEditing: (val) => {
        set({isEditing: val})
    },

    setEditData: (val) => {
        set({editData: val})
    }
}))


export const ProductDetails = create((set, get) => ({
    product: [],

    setProductDetails: (data) => {
        set({product: data})
    }
}))