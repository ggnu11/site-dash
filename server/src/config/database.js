import mongoose from "mongoose";

const connectDB = async (retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!process.env.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not defined in environment variables");
        return;
      }

      console.log(
        `🔄 Attempting to connect to MongoDB... (${i + 1}/${retries})`
      );

      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // 30초 타임아웃
        socketTimeoutMS: 45000, // 소켓 타임아웃
        connectTimeoutMS: 30000, // 연결 타임아웃
        maxPoolSize: 10, // 연결 풀 크기
        retryWrites: true,
        w: "majority",
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      // 연결 상태 모니터링
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("✅ MongoDB reconnected");
      });

      return; // 성공하면 함수 종료
    } catch (error) {
      console.error(
        `❌ MongoDB connection attempt ${i + 1} failed:`,
        error.message
      );

      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("❌ All MongoDB connection attempts failed");
        console.error("Full error:", error);
        console.warn(
          "⚠️  Server will continue running without database connection. Some features may not work."
        );
        console.warn("💡 Please check:");
        console.warn("   1. MONGODB_URI is correct in .env file");
        console.warn("   2. MongoDB Atlas cluster exists and is accessible");
        console.warn(
          "   3. MongoDB Atlas IP whitelist includes your IP (or 0.0.0.0/0 for all)"
        );
        console.warn("   4. Network connection is stable");
        console.warn("   5. MongoDB Atlas cluster is not paused");
      }
    }
  }
};

export default connectDB;
