import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import { Card, CardContent } from "@/shared/ui/card";
import { useMenuStore } from "@/entities/menu/model/menu.store";
import { MenuDialog } from "@/features/menu/ui/MenuDialog";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

/** ProjectCarousel 프롭스 타입 정의 */
interface ProjectCarouselProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const ProjectCarousel = ({ selectedId, onSelect }: ProjectCarouselProps) => {
  const menus = useMenuStore((state) => state.menus);

  /** 카드 클릭 핸들러 */
  const handleCardClick = (menuId: string) => {
    onSelect(menuId === selectedId ? null : menuId);
  };

  /** URL 유효성 검사 함수 */
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /** 프로젝트명 클릭 핸들러 */
  const handleProjectNameClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    if (isValidUrl(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative mx-12 w-full">
      <div className="mb-4 flex justify-end">
        <MenuDialog />
      </div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 py-8">
          {menus.map((menu) => (
            <CarouselItem key={menu.id} className="basis-1/5 pl-2">
              <div className="p-1">
                <Card
                  className={cn(
                    "relative transform cursor-pointer border-2 border-white/20 bg-black/40 transition-all duration-300 ease-out hover:-translate-y-4 hover:scale-105 hover:shadow-lg hover:shadow-white/10",
                    selectedId === menu.id &&
                      "z-10 scale-110 border-yellow-400 shadow-lg shadow-yellow-400/20",
                  )}
                  onClick={() => handleCardClick(menu.id)}
                >
                  <CardContent className="flex aspect-[16/9] flex-col items-center justify-center gap-2 p-6">
                    <button
                      onClick={(e) =>
                        handleProjectNameClick(e, menu.projectUrl)
                      }
                      className={cn(
                        "group relative text-xl font-semibold",
                        isValidUrl(menu.projectUrl)
                          ? "text-white hover:text-yellow-400"
                          : "cursor-not-allowed text-white/40",
                      )}
                      title={
                        !isValidUrl(menu.projectUrl)
                          ? "유효하지 않은 URL입니다"
                          : undefined
                      }
                    >
                      <span className="relative">
                        {menu.projectName}
                        <ExternalLink
                          className={cn(
                            "absolute top-1/2 -right-6 h-4 w-4 -translate-y-1/2 transition-all duration-300",
                            isValidUrl(menu.projectUrl)
                              ? "opacity-0 group-hover:translate-x-0.5 group-hover:-translate-y-1/2 group-hover:opacity-100"
                              : "text-red-400",
                          )}
                        />
                      </span>
                    </button>
                    <span className="text-sm text-gray-400">
                      {new Date(menu.createdAt).toLocaleDateString()}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 -left-12 z-30 -translate-y-1/2 bg-white/10 hover:bg-white/20" />
        <CarouselNext className="absolute top-1/2 -right-12 z-30 -translate-y-1/2 bg-white/10 hover:bg-white/20" />
      </Carousel>
    </div>
  );
};

export default ProjectCarousel;
