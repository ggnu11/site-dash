import apiClient from "./client";

export interface SubMenuData {
  name: string;
  url: string;
}

export interface SiteData {
  projectName: string;
  projectUrl: string;
  subMenus?: SubMenuData[];
}

export interface Site {
  _id: string;
  projectName: string;
  projectUrl: string;
  subMenus: Array<{
    _id: string;
    name: string;
    url: string;
  }>;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export const sitesAPI = {
  getAll: async (): Promise<Site[]> => {
    const response = await apiClient.get("/sites");
    return response.data;
  },

  getById: async (id: string): Promise<Site> => {
    const response = await apiClient.get(`/sites/${id}`);
    return response.data;
  },

  create: async (data: SiteData): Promise<Site> => {
    const response = await apiClient.post("/sites", data);
    return response.data;
  },

  update: async (id: string, data: Partial<SiteData>): Promise<Site> => {
    const response = await apiClient.put(`/sites/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sites/${id}`);
  },
};
