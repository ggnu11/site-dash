import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

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
  id: string;
  projectName: string;
  projectUrl: string;
  subMenus: SubMenuData[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const SITES_COLLECTION = "sites";

const toISOString = (val: unknown): string => {
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "string") return val;
  return new Date().toISOString();
};

export const sitesAPI = {
  getAll: async (): Promise<Site[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const sitesRef = collection(db, SITES_COLLECTION);
    const q = query(
      sitesRef,
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);

    const sites = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        projectName: data.projectName,
        projectUrl: data.projectUrl,
        subMenus: data.subMenus || [],
        userId: data.userId,
        createdAt: toISOString(data.createdAt),
        updatedAt: toISOString(data.updatedAt),
      };
    });

    return sites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  create: async (siteData: SiteData): Promise<Site> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = await addDoc(collection(db, SITES_COLLECTION), {
      projectName: siteData.projectName,
      projectUrl: siteData.projectUrl,
      subMenus: siteData.subMenus || [],
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const now = new Date().toISOString();
    return {
      id: docRef.id,
      projectName: siteData.projectName,
      projectUrl: siteData.projectUrl,
      subMenus: siteData.subMenus || [],
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
    };
  },

  update: async (id: string, updates: Partial<SiteData>): Promise<Site> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = doc(db, SITES_COLLECTION, id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };
    if (updates.projectName !== undefined)
      updateData.projectName = updates.projectName;
    if (updates.projectUrl !== undefined)
      updateData.projectUrl = updates.projectUrl;
    if (updates.subMenus !== undefined)
      updateData.subMenus = updates.subMenus;

    await updateDoc(docRef, updateData);

    // 업데이트된 데이터 반환 (로컬 구성)
    const sitesRef = collection(db, SITES_COLLECTION);
    const q = query(sitesRef, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const found = snapshot.docs.find((d) => d.id === id);
    if (!found) throw new Error("Site not found");

    const data = found.data();
    return {
      id: found.id,
      projectName: data.projectName,
      projectUrl: data.projectUrl,
      subMenus: data.subMenus || [],
      userId: data.userId,
      createdAt: toISOString(data.createdAt),
      updatedAt: toISOString(data.updatedAt),
    };
  },

  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, SITES_COLLECTION, id);
    await deleteDoc(docRef);
  },
};
