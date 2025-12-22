import ProjectCarousel from "./ProjectCarousel";
import { useState, useCallback } from "react";
import { useMenuStore } from "@/entities/menu/model/menu.store";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TypingText } from "@/shared/ui/TypingText";
import {
  ArrowUpRight,
  ExternalLink,
  AlertCircle,
  Pencil,
  Trash2,
  LogOut,
  User,
  UserX,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { EditMenuDialog } from "@/entities/menu/ui/EditMenuDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/processes/routing/model/routes";
import { showError } from "@/shared/lib/toast";

/** URL 유효성 검사 함수 */
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const SiteDash = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const menus = useMenuStore((state) => state.menus);
  const removeMenu = useMenuStore((state) => state.removeMenu);
  const { user, logout, deleteAccount } = useAuthStore();
  const navigate = useNavigate();
  const selectedMenu = menus.find((menu) => menu.id === selectedId);

  /** 메인 프로젝트 URL 유효성 */
  const isMainUrlValid = selectedMenu
    ? isValidUrl(selectedMenu.projectUrl)
    : true;

  /** 서브메뉴 URL 유효성 검사 결과 */
  const subMenuUrlValidation =
    selectedMenu?.subMenus?.map((subMenu) => ({
      ...subMenu,
      isValid: isValidUrl(subMenu.url),
    })) || [];

  /** 메뉴 삭제 핸들러 */
  const handleDeleteMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  }, []);

  /** 메뉴 삭제 확인 핸들러 */
  const handleConfirmDelete = useCallback(async () => {
    if (selectedId) {
      try {
        await removeMenu(selectedId);
        setSelectedId(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        // 에러는 menu.store에서 toast로 표시됨
        setIsDeleteDialogOpen(false);
      }
    }
  }, [selectedId, removeMenu]);

  /** 배경 클릭 핸들러 */
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    // 이벤트가 발생한 요소가 배경인 경우에만 포커스 해제
    if ((e.target as HTMLElement).classList.contains("background-area")) {
      setSelectedId(null);
    }
  }, []);

  /** 로그아웃 핸들러 */
  const handleLogout = useCallback(async () => {
    await logout();
    navigate(AppRoutes.LOGIN, { replace: true });
  }, [logout, navigate]);

  /** 회원탈퇴 확인 핸들러 */
  const handleConfirmDeleteAccount = useCallback(async () => {
    const success = await deleteAccount();
    if (success) {
      navigate(AppRoutes.LOGIN, { replace: true });
    } else {
      showError("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
    setIsDeleteAccountDialogOpen(false);
  }, [deleteAccount, navigate]);

  return (
    <div
      className="background-area relative h-screen w-full overflow-hidden text-white"
      onClick={handleBackgroundClick}
    >
      {/* 🔙 배경 텍스트 */}
      <div
        className={cn(
          "background-area absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-700",
          selectedMenu && "opacity-100"
        )}
      >
        <div className="relative">
          <div className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent blur-xl" />
          <h1 className="background-area relative text-[12vw] font-bold text-white/[0.03]">
            {selectedMenu?.projectName || "SITE DASH"}
          </h1>
        </div>
      </div>
      {/* 🧱 어두운 오버레이 */}
      <div className="background-area absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-black/80 to-black/70" />
      {/* 👤 사용자 메뉴 */}
      <motion.div
        className="absolute top-20 right-20 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <User className="h-4 w-4" />
              <span>{user?.username || "User"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[200px] border border-white/20 bg-black/95 p-1 shadow-2xl backdrop-blur-xl"
          >
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteAccountDialogOpen(true)}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
            >
              <UserX className="mr-2 h-4 w-4" />
              회원탈퇴
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
      {/* 🧩 상단 텍스트 + 버튼 */}
      <motion.div
        className="absolute top-20 left-20 z-10 w-[480px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 헤더 섹션 */}
        <div className="space-y-12">
          {/* 상단 헤더 */}
          <div className="space-y-6">
            <div className="space-y-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId || "empty"}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 h-[32px]">
                    <motion.div
                      className="h-1 w-1 rounded-full bg-yellow-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    />
                    <motion.p
                      className="text-sm font-medium tracking-wider text-yellow-500 uppercase"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      {selectedMenu ? "Selected Project" : "Welcome"}
                    </motion.p>
                    {selectedMenu && (
                      <motion.span
                        className="text-sm text-white/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        · Last updated{" "}
                        {new Date(selectedMenu.createdAt).toLocaleDateString()}
                      </motion.span>
                    )}
                  </div>
                  {selectedMenu && (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditDialogOpen(true);
                        }}
                        className="group flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                        title="메뉴 수정"
                      >
                        <Pencil className="h-4 w-4 text-white/60 transition-colors group-hover:text-yellow-500" />
                      </button>
                      <button
                        onClick={handleDeleteMenu}
                        className="group flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-red-500/10"
                        title="메뉴 삭제"
                      >
                        <Trash2 className="h-4 w-4 text-white/60 transition-colors group-hover:text-red-400" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${selectedId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <TypingText
                    text={
                      selectedMenu?.projectName || "프로젝트를 선택해주세요"
                    }
                    className={cn(
                      "text-5xl font-bold tracking-tight transition-all duration-300",
                      selectedMenu ? "text-white" : "text-white/60"
                    )}
                    delay={0.2}
                    staggerChildren={0.05}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {selectedMenu && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId}
                  className="flex items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <a
                    href={selectedMenu.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300",
                      isMainUrlValid
                        ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20"
                        : "cursor-not-allowed bg-red-500/20 text-red-400"
                    )}
                    onClick={(e) => !isMainUrlValid && e.preventDefault()}
                  >
                    <span>메인 프로젝트 방문</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  {!isMainUrlValid && (
                    <motion.p
                      className="flex items-center gap-1 text-sm text-red-400"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>유효하지 않은 URL 형식입니다</span>
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* 추가 메뉴 정보 */}
          {selectedMenu && selectedMenu.subMenus?.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 w-1 rounded-full bg-white/20" />
                  <h3 className="font-medium text-white/80">
                    추가 메뉴 ({selectedMenu.subMenus.length}개)
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {subMenuUrlValidation.map((subMenu) => (
                    <motion.div
                      key={subMenu.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className={cn(
                        "group flex items-center justify-between rounded-lg border px-4 py-3 transition-colors duration-300",
                        subMenu.isValid
                          ? "border-white/10 hover:border-yellow-500/50"
                          : "border-red-500/20"
                      )}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-300",
                          subMenu.isValid ? "text-white/80" : "text-red-400"
                        )}
                      >
                        {subMenu.name}
                      </span>
                      <a
                        href={subMenu.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-1 text-sm transition-all duration-300",
                          subMenu.isValid
                            ? "text-yellow-500 group-hover:text-yellow-400"
                            : "cursor-not-allowed text-red-400"
                        )}
                        onClick={(e) => !subMenu.isValid && e.preventDefault()}
                        title={
                          !subMenu.isValid
                            ? "유효하지 않은 URL 형식입니다"
                            : undefined
                        }
                      >
                        <span>방문</span>
                        <ExternalLink className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
      {/* 🖼️ 캐러셀 카드 */}
      <div className="absolute bottom-10 left-0 z-10 w-full px-8">
        <div className="flex snap-x snap-mandatory items-center gap-4 overflow-x-auto scroll-smooth">
          <ProjectCarousel selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>
      {/* 🗑️ 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border border-white/20 bg-black/95 p-8 shadow-2xl backdrop-blur-xl before:bg-gradient-to-b before:from-white/10 before:to-transparent">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              프로젝트 삭제
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              정말 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              삭제
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ✏️ 수정 다이얼로그 */}
      <EditMenuDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedMenu={selectedMenu}
      />
      {/* 🗑️ 회원탈퇴 확인 다이얼로그 */}
      <Dialog
        open={isDeleteAccountDialogOpen}
        onOpenChange={setIsDeleteAccountDialogOpen}
      >
        <DialogContent className="border border-white/20 bg-black/95 p-8 shadow-2xl backdrop-blur-xl before:bg-gradient-to-b before:from-white/10 before:to-transparent">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              회원탈퇴
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              정말 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든
              데이터가 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleConfirmDeleteAccount}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              회원탈퇴
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteAccountDialogOpen(false)}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteDash;
