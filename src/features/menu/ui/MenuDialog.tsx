import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useMenuStore } from "@/entities/menu/model/menu.store";
import { z } from "zod";
import { Plus, X, AlertCircle } from "lucide-react";

/** 서브메뉴 입력 폼 타입 */
interface SubMenuForm {
  name: string;
  url: string;
}

/** 메뉴 등록 폼 스키마 */
const menuFormSchema = z.object({
  projectName: z.string().min(1, "프로젝트명을 입력해주세요"),
  projectUrl: z
    .string()
    .url("올바른 URL 형식이 아닙니다 (예: https://example.com)"),
  subMenus: z.array(
    z.object({
      name: z.string().min(1, "메뉴명을 입력해주세요"),
      url: z
        .string()
        .url("올바른 URL 형식이 아닙니다 (예: https://example.com)"),
    })
  ),
});

/** 초기 상태 */
const initialState = {
  projectName: "",
  projectUrl: "",
  subMenus: [] as SubMenuForm[],
  errors: {} as {
    projectName?: string;
    projectUrl?: string;
    subMenus?: { name?: string; url?: string }[];
  },
};

/** 최대 서브메뉴 개수 */
const MAX_SUBMENU_COUNT = 2;

/** 메뉴 등록 다이얼로그 컴포넌트 */
export function MenuDialog() {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState(initialState.projectName);
  const [projectUrl, setProjectUrl] = useState(initialState.projectUrl);
  const [subMenus, setSubMenus] = useState<SubMenuForm[]>(
    initialState.subMenus
  );
  const [errors, setErrors] = useState(initialState.errors);

  const addMenu = useMenuStore((state) => state.addMenu);

  /** 모든 상태 초기화 */
  const resetState = () => {
    setProjectName(initialState.projectName);
    setProjectUrl(initialState.projectUrl);
    setSubMenus(initialState.subMenus);
    setErrors(initialState.errors);
  };

  /** 다이얼로그 상태 변경 핸들러 */
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetState();
    }
  };

  /** 서브메뉴 추가 핸들러 */
  const handleAddSubMenu = () => {
    if (subMenus.length < MAX_SUBMENU_COUNT) {
      setSubMenus([...subMenus, { name: "", url: "" }]);
    }
  };

  /** 서브메뉴 제거 핸들러 */
  const handleRemoveSubMenu = (index: number) => {
    setSubMenus(subMenus.filter((_, i) => i !== index));
  };

  /** 서브메뉴 수정 핸들러 */
  const handleSubMenuChange = (
    index: number,
    field: keyof SubMenuForm,
    value: string
  ) => {
    const newSubMenus = [...subMenus];
    newSubMenus[index] = { ...newSubMenus[index], [field]: value };
    setSubMenus(newSubMenus);
  };

  /** 폼 제출 핸들러 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      menuFormSchema.parse({ projectName, projectUrl, subMenus });
      addMenu(projectName, projectUrl, subMenus);
      setOpen(false);
      resetState();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, curr) => {
            const path = curr.path[0];
            if (path === "subMenus") {
              const subMenuIndex = curr.path[1] as number;
              const subMenuField = curr.path[2] as keyof SubMenuForm;
              const subMenus = acc.subMenus ? [...acc.subMenus] : [];
              if (!subMenus[subMenuIndex]) subMenus[subMenuIndex] = {};
              subMenus[subMenuIndex][subMenuField] = curr.message;
              return { ...acc, subMenus };
            }
            return { ...acc, [path]: curr.message };
          },
          {} as typeof errors
        );
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2 origin-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
        >
          메뉴 등록
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-white/20 bg-black/95 p-8 shadow-2xl backdrop-blur-xl before:bg-gradient-to-b before:from-white/10 before:to-transparent sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            메뉴 등록
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            프로젝트 정보와 추가 메뉴를 등록하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="projectName"
                className="text-right font-medium text-white"
              >
                프로젝트명
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="col-span-3 border-white/20 bg-[#121212] text-white placeholder:text-gray-400 focus:border-yellow-500 focus-visible:ring-1 focus-visible:ring-yellow-500 [-webkit-autofill:active]:!bg-[#121212] [-webkit-autofill:focus]:!bg-[#121212] [-webkit-autofill:hover]:!bg-[#121212]"
              />
              {errors.projectName && (
                <p className="col-span-3 col-start-2 text-sm text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.projectName}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="projectUrl"
                className="text-right font-medium text-white"
              >
                URL
              </Label>
              <Input
                id="projectUrl"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="col-span-3 border-white/20 bg-[#121212] text-white placeholder:text-gray-400 focus:border-yellow-500 focus-visible:ring-1 focus-visible:ring-yellow-500 [-webkit-autofill:active]:!bg-[#121212] [-webkit-autofill:focus]:!bg-[#121212] [-webkit-autofill:hover]:!bg-[#121212]"
              />
              {errors.projectUrl && (
                <p className="col-span-3 col-start-2 text-sm text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.projectUrl}
                </p>
              )}
            </div>

            {/* 서브메뉴 목록 */}
            {subMenus.map((subMenu, index) => (
              <div
                key={index}
                className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">
                    추가 메뉴 {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubMenu(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor={`subMenu-${index}-name`}
                    className="text-right font-medium text-white"
                  >
                    메뉴명
                  </Label>
                  <Input
                    id={`subMenu-${index}-name`}
                    value={subMenu.name}
                    onChange={(e) =>
                      handleSubMenuChange(index, "name", e.target.value)
                    }
                    className="col-span-3 border-white/20 bg-[#121212] text-white placeholder:text-gray-400 focus:border-yellow-500 focus-visible:ring-1 focus-visible:ring-yellow-500 [-webkit-autofill:active]:!bg-[#121212] [-webkit-autofill:focus]:!bg-[#121212] [-webkit-autofill:hover]:!bg-[#121212]"
                  />
                  {errors.subMenus?.[index]?.name && (
                    <p className="col-span-3 col-start-2 text-sm text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.subMenus[index].name}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor={`subMenu-${index}-url`}
                    className="text-right font-medium text-white"
                  >
                    URL
                  </Label>
                  <Input
                    id={`subMenu-${index}-url`}
                    value={subMenu.url}
                    onChange={(e) =>
                      handleSubMenuChange(index, "url", e.target.value)
                    }
                    className="col-span-3 border-white/20 bg-[#121212] text-white placeholder:text-gray-400 focus:border-yellow-500 focus-visible:ring-1 focus-visible:ring-yellow-500 [-webkit-autofill:active]:!bg-[#121212] [-webkit-autofill:focus]:!bg-[#121212] [-webkit-autofill:hover]:!bg-[#121212]"
                  />
                  {errors.subMenus?.[index]?.url && (
                    <p className="col-span-3 col-start-2 text-sm text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.subMenus[index].url}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* 서브메뉴 추가 버튼 */}
            {subMenus.length < MAX_SUBMENU_COUNT && (
              <Button
                type="button"
                variant="outline"
                className="mt-2 border-white/20 text-white transition-all duration-300 hover:border-yellow-500 hover:text-yellow-500"
                onClick={handleAddSubMenu}
              >
                <Plus className="mr-2 h-4 w-4" />
                메뉴 추가
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-yellow-500 text-black transition-all duration-300 hover:bg-yellow-400"
            >
              등록
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              취소
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
