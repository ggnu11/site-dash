import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Supabase 클라이언트 생성
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ SUPABASE_URL and SUPABASE_ANON_KEY are required in environment variables");
  console.warn("⚠️  Server will continue running without Supabase connection.");
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

// 데이터베이스 연결 확인
const connectDB = async () => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn("⚠️  Supabase credentials not configured");
      return null;
    }

    // 연결 테스트 (users 테이블 조회 시도)
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (error && error.code !== "PGRST116") {
      // PGRST116은 테이블이 없을 때 발생하는 에러 (정상)
      console.error("❌ Supabase connection error:", error.message);
      throw error;
    }

    console.log("✅ Supabase Connected");
    return supabase;
  } catch (error) {
    console.error("❌ Failed to connect to Supabase:", error.message);
    throw error;
  }
};

export { supabase };
export default connectDB;
