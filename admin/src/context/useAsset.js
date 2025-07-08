import { create } from "zustand";
import instance from "../utils/axios";

export const useAsset = create((set, get) => ({
  assetMap: {},
  loaded: false,
  async fetchAssets() {
    if (get().loaded) return; // Only fetch once
    try {
      const res = await instance.get('/assets');

      console.log(res.data.assets);
      if (res.data && res.data.assets) {
        const map = {};
        res.data.assets.forEach(asset => {
          map[asset.name] = asset.url;
        });
        set({ assetMap: map, loaded: true });
      }
    } catch (err) {
      console.error('Failed to fetch assets', err);
    }
  },
  getAssetUrl(name) {
    return get().assetMap[name] || '';
  },
}));

