import express from "express";
import { body, validationResult } from "express-validator";
import Site from "../models/Site.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 사이트 목록 조회
router.get("/", async (req, res) => {
  try {
    const sites = await Site.findByUserId(req.user.id);
    
    // Supabase 응답을 MongoDB 형식으로 변환
    const formattedSites = sites.map(site => ({
      _id: site.id,
      projectName: site.project_name,
      projectUrl: site.project_url,
      subMenus: site.sub_menus || [],
      user: site.user_id,
      createdAt: site.created_at,
      updatedAt: site.updated_at,
    }));

    res.json(formattedSites);
  } catch (error) {
    console.error("Get sites error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 특정 사이트 조회
router.get("/:id", async (req, res) => {
  try {
    const site = await Site.findById(req.params.id, req.user.id);

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Supabase 응답을 MongoDB 형식으로 변환
    const formattedSite = {
      _id: site.id,
      projectName: site.project_name,
      projectUrl: site.project_url,
      subMenus: site.sub_menus || [],
      user: site.user_id,
      createdAt: site.created_at,
      updatedAt: site.updated_at,
    };

    res.json(formattedSite);
  } catch (error) {
    console.error("Get site error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 새 사이트 생성
router.post(
  "/",
  [
    body("projectName").trim().isLength({ min: 1 }),
    body("projectUrl").trim().isURL(),
    body("subMenus").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { projectName, projectUrl, subMenus = [] } = req.body;

      const site = await Site.create({
        projectName,
        projectUrl,
        subMenus,
        userId: req.user.id,
      });

      // Supabase 응답을 MongoDB 형식으로 변환
      const formattedSite = {
        _id: site.id,
        projectName: site.project_name,
        projectUrl: site.project_url,
        subMenus: site.sub_menus || [],
        user: site.user_id,
        createdAt: site.created_at,
        updatedAt: site.updated_at,
      };

      res.status(201).json(formattedSite);
    } catch (error) {
      console.error("Create site error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// 사이트 수정
router.put(
  "/:id",
  [
    body("projectName").optional().trim().isLength({ min: 1 }),
    body("projectUrl").optional().trim().isURL(),
    body("subMenus").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const site = await Site.update(req.params.id, req.user.id, req.body);

      if (!site) {
        return res.status(404).json({ message: "Site not found" });
      }

      // Supabase 응답을 MongoDB 형식으로 변환
      const formattedSite = {
        _id: site.id,
        projectName: site.project_name,
        projectUrl: site.project_url,
        subMenus: site.sub_menus || [],
        user: site.user_id,
        createdAt: site.created_at,
        updatedAt: site.updated_at,
      };

      res.json(formattedSite);
    } catch (error) {
      console.error("Update site error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// 사이트 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Site.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.json({ message: "Site deleted successfully" });
  } catch (error) {
    console.error("Delete site error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
