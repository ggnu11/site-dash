import { supabase } from "../config/database.js";

/**
 * 사이트 모델 (Supabase)
 */
class Site {
  /**
   * 사용자의 모든 사이트 조회
   */
  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * ID로 사이트 찾기
   */
  static async findById(id, userId) {
    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data || null;
  }

  /**
   * 새 사이트 생성
   */
  static async create(siteData) {
    const { projectName, projectUrl, subMenus = [], userId } = siteData;

    const { data, error } = await supabase
      .from("sites")
      .insert({
        project_name: projectName,
        project_url: projectUrl,
        sub_menus: subMenus,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 사이트 업데이트
   */
  static async update(id, userId, updates) {
    // 필드명 변환
    const updateData = {};
    if (updates.projectName !== undefined) {
      updateData.project_name = updates.projectName;
    }
    if (updates.projectUrl !== undefined) {
      updateData.project_url = updates.projectUrl;
    }
    if (updates.subMenus !== undefined) {
      updateData.sub_menus = updates.subMenus;
    }

    const { data, error } = await supabase
      .from("sites")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 사이트 삭제
   */
  static async delete(id, userId) {
    const { error } = await supabase
      .from("sites")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return true;
  }
}

export default Site;
