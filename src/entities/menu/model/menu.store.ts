import { create } from "zustand";

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

/** 메뉴 스토어 상태 타입 정의 */
interface MenuState {
  menus: MenuItem[];
  addMenu: (
    projectName: string,
    projectUrl: string,
    subMenus?: { name: string; url: string }[],
  ) => void;
  removeMenu: (id: string) => void;
  updateMenu: (
    id: string,
    updates: {
      projectName?: string;
      projectUrl?: string;
      subMenus?: { name: string; url: string }[];
    },
  ) => void;
}

/** 메뉴 상태 관리 스토어 */
export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  addMenu: (projectName: string, projectUrl: string, subMenus = []) => {
    const newMenu: MenuItem = {
      id: crypto.randomUUID(),
      projectName,
      projectUrl,
      subMenus: subMenus.map((menu) => ({
        id: crypto.randomUUID(),
        ...menu,
      })),
      createdAt: new Date(),
    };
    set((state) => ({
      menus: [...state.menus, newMenu],
    }));
  },
  removeMenu: (id: string) => {
    set((state) => ({
      menus: state.menus.filter((menu) => menu.id !== id),
    }));
  },
  updateMenu: (id: string, updates) => {
    set((state) => ({
      menus: state.menus.map((menu) =>
        menu.id === id
          ? {
              ...menu,
              ...updates,
              subMenus: updates.subMenus
                ? updates.subMenus.map((subMenu) => ({
                    id: crypto.randomUUID(),
                    ...subMenu,
                  }))
                : menu.subMenus,
            }
          : menu,
      ),
    }));
  },
}));
