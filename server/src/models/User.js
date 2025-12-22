import { supabase } from "../config/database.js";
import bcrypt from "bcryptjs";

/**
 * 사용자 모델 (Supabase)
 */
class User {
  /**
   * 이메일로 사용자 찾기
   */
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data || null;
  }

  /**
   * Google ID로 사용자 찾기
   */
  static async findByGoogleId(googleId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("google_id", googleId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data || null;
  }

  /**
   * ID로 사용자 찾기
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data || null;
  }

  /**
   * 새 사용자 생성
   */
  static async create(userData) {
    const { email, username, password, googleId } = userData;

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const { data, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
        google_id: googleId || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 사용자 업데이트
   */
  static async update(id, updates) {
    // 비밀번호가 있으면 암호화
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 사용자 삭제
   */
  static async delete(id) {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  }

  /**
   * 비밀번호 검증
   */
  static async comparePassword(plainPassword, hashedPassword) {
    if (!hashedPassword) {
      return false;
    }
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;
