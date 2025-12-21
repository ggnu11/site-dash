import { create } from "zustand";
import { sitesAPI, type Site } from "@/shared/api/sites";

/** 서브메뉴 아이템 타입 정의 */
export interface SubMenuItem {
  id: string;
  name: string;
  url: string;
}

/** 메뉴 아이템 타입 정의 */
export interface MenuItem {
  id: string;
  projectName: string;
  projectUrl: string;
  subMenus: SubMenuItem[];
  createdAt: Date;
}

/** 백엔드 사이트를 프론트엔드 메뉴 형식으로 변환 */
const transformSiteToMenuItem = (site: Site): MenuItem => ({
  id: site._id,
  projectName: site.projectName,
  projectUrl: site.projectUrl,
  subMenus: site.subMenus.map((sub) => ({
    id: sub._id,
    name: sub.name,
    url: sub.url,
  })),
  createdAt: new Date(site.createdAt),
});

/** 메뉴 스토어 상태 타입 정의 */
interface MenuState {
  menus: MenuItem[];
  loading: boolean;
  fetchMenus: () => Promise<void>;
  addMenu: (
    projectName: string,
    projectUrl: string,
    subMenus?: { name: string; url: string }[]
  ) => Promise<void>;
  removeMenu: (id: string) => Promise<void>;
  updateMenu: (
    id: string,
    updates: {
      projectName?: string;
      projectUrl?: string;
      subMenus?: { name: string; url: string }[];
    }
  ) => Promise<void>;
}

/** 메뉴 상태 관리 스토어 */
export const useMenuStore = create<MenuState>((set, get) => ({
  menus: [],
  loading: false,

  fetchMenus: async () => {
    set({ loading: true });
    try {
      const sites = await sitesAPI.getAll();
      const menus = sites.map(transformSiteToMenuItem);
      set({ menus, loading: false });
    } catch (error) {
      console.error("Error fetching menus:", error);
      set({ loading: false });
    }
  },

  addMenu: async (projectName: string, projectUrl: string, subMenus = []) => {
    try {
      const site = await sitesAPI.create({ projectName, projectUrl, subMenus });
      const newMenu = transformSiteToMenuItem(site);
      set((state) => ({
        menus: [...state.menus, newMenu],
      }));
    } catch (error) {
      console.error("Error adding menu:", error);
      throw error;
    }
  },

  removeMenu: async (id: string) => {
    try {
      await sitesAPI.delete(id);
      set((state) => ({
        menus: state.menus.filter((menu) => menu.id !== id),
      }));
    } catch (error) {
      console.error("Error removing menu:", error);
      throw error;
    }
  },

  updateMenu: async (id: string, updates) => {
    try {
      const site = await sitesAPI.update(id, updates);
      const updatedMenu = transformSiteToMenuItem(site);
      set((state) => ({
        menus: state.menus.map((menu) => (menu.id === id ? updatedMenu : menu)),
      }));
    } catch (error) {
      console.error("Error updating menu:", error);
      throw error;
    }
  },
}));
