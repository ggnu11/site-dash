import { create } from "zustand";
import { sitesAPI, type Site } from "@/shared/api/sites";
import { showError, showSuccess } from "@/shared/lib/toast";

export interface SubMenuItem {
  id: string;
  name: string;
  url: string;
}

export interface MenuItem {
  id: string;
  projectName: string;
  projectUrl: string;
  subMenus: SubMenuItem[];
  createdAt: Date;
}

const transformSiteToMenuItem = (site: Site): MenuItem => ({
  id: site.id,
  projectName: site.projectName,
  projectUrl: site.projectUrl,
  subMenus: (site.subMenus || []).map((sub, index) => ({
    id: `${site.id}-sub-${index}`,
    name: sub.name,
    url: sub.url,
  })),
  createdAt: new Date(site.createdAt),
});

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

export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  loading: false,

  fetchMenus: async () => {
    set({ loading: true });
    try {
      const sites = await sitesAPI.getAll();
      const menus = sites.map(transformSiteToMenuItem);
      set({ menus, loading: false });
    } catch (error) {
      console.error("fetchMenus error:", error);
      showError("메뉴를 불러오는데 실패했습니다.");
      set({ loading: false });
    }
  },

  addMenu: async (projectName, projectUrl, subMenus = []) => {
    try {
      const site = await sitesAPI.create({ projectName, projectUrl, subMenus });
      const newMenu = transformSiteToMenuItem(site);
      set((state) => ({ menus: [...state.menus, newMenu] }));
      showSuccess("메뉴가 성공적으로 추가되었습니다.");
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "메뉴 추가에 실패했습니다.";
      showError(msg);
      throw error;
    }
  },

  removeMenu: async (id) => {
    try {
      await sitesAPI.delete(id);
      set((state) => ({ menus: state.menus.filter((menu) => menu.id !== id) }));
      showSuccess("메뉴가 성공적으로 삭제되었습니다.");
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "메뉴 삭제에 실패했습니다.";
      showError(msg);
      throw error;
    }
  },

  updateMenu: async (id, updates) => {
    try {
      const site = await sitesAPI.update(id, updates);
      const updatedMenu = transformSiteToMenuItem(site);
      set((state) => ({
        menus: state.menus.map((menu) => (menu.id === id ? updatedMenu : menu)),
      }));
      showSuccess("메뉴가 성공적으로 수정되었습니다.");
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "메뉴 수정에 실패했습니다.";
      showError(msg);
      throw error;
    }
  },
}));
