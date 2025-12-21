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
    const sites = await Site.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(sites);
  } catch (error) {
    console.error("Get sites error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 특정 사이트 조회
router.get("/:id", async (req, res) => {
  try {
    const site = await Site.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.json(site);
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

      const site = new Site({
        projectName,
        projectUrl,
        subMenus,
        user: req.user._id,
      });

      await site.save();
      res.status(201).json(site);
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

      const site = await Site.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!site) {
        return res.status(404).json({ message: "Site not found" });
      }

      res.json(site);
    } catch (error) {
      console.error("Update site error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// 사이트 삭제
router.delete("/:id", async (req, res) => {
  try {
    const site = await Site.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.json({ message: "Site deleted successfully" });
  } catch (error) {
    console.error("Delete site error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
