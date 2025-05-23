import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Plus, X } from "lucide-react";
import type { MenuItem } from "../model/menu.store";
import { useMenuStore } from "../model/menu.store";

interface EditMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMenu: MenuItem | undefined;
}

export const EditMenuDialog = ({
  open,
  onOpenChange,
  selectedMenu,
}: EditMenuDialogProps) => {
  const updateMenu = useMenuStore((state) => state.updateMenu);

  const [formData, setFormData] = useState({
    projectName: "",
    projectUrl: "",
    subMenus: [] as { name: string; url: string }[],
  });

  useEffect(() => {
    if (selectedMenu) {
      setFormData({
        projectName: selectedMenu.projectName,
        projectUrl: selectedMenu.projectUrl,
        subMenus: selectedMenu.subMenus.map(({ name, url }) => ({ name, url })),
      });
    }
  }, [selectedMenu]);

  /** 서브메뉴 추가 핸들러 */
  const handleAddSubMenu = () => {
    setFormData((prev) => ({
      ...prev,
      subMenus: [...prev.subMenus, { name: "", url: "" }],
    }));
  };

  /** 서브메뉴 제거 핸들러 */
  const handleRemoveSubMenu = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subMenus: prev.subMenus.filter((_, i) => i !== index),
    }));
  };

  /** 서브메뉴 수정 핸들러 */
  const handleSubMenuChange = (
    index: number,
    field: "name" | "url",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      subMenus: prev.subMenus.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  /** 폼 제출 핸들러 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMenu) {
      updateMenu(selectedMenu.id, formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto border border-white/20 bg-black/95 p-8 shadow-2xl backdrop-blur-xl before:bg-gradient-to-b before:from-white/10 before:to-transparent sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            프로젝트 수정
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-white">
                프로젝트명
              </Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectName: e.target.value,
                  }))
                }
                className="border-white/20 bg-white/5 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectUrl" className="text-white">
                프로젝트 URL
              </Label>
              <Input
                id="projectUrl"
                value={formData.projectUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectUrl: e.target.value,
                  }))
                }
                className="border-white/20 bg-white/5 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white">서브메뉴</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubMenu}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                추가
              </Button>
            </div>
            <div className="space-y-3">
              {formData.subMenus.map((subMenu, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Input
                    value={subMenu.name}
                    onChange={(e) =>
                      handleSubMenuChange(index, "name", e.target.value)
                    }
                    placeholder="메뉴명"
                    className="border-white/20 bg-white/5 text-white"
                    required
                  />
                  <Input
                    value={subMenu.url}
                    onChange={(e) =>
                      handleSubMenuChange(index, "url", e.target.value)
                    }
                    placeholder="URL"
                    className="border-white/20 bg-white/5 text-white"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubMenu(index)}
                    className="h-10 w-10 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              className="bg-yellow-500 text-black hover:bg-yellow-400"
            >
              수정
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/10"
            >
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
