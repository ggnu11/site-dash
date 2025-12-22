import { toast } from "sonner";

/** 성공 메시지를 표시합니다 */
export const showSuccess = (message: string) => {
  toast.success(message);
};

/** 에러 메시지를 표시합니다 */
export const showError = (message: string) => {
  toast.error(message);
};

/** 정보 메시지를 표시합니다 */
export const showInfo = (message: string) => {
  toast.info(message);
};

/** 경고 메시지를 표시합니다 */
export const showWarning = (message: string) => {
  toast.warning(message);
};

/** 로딩 메시지를 표시하고 토스트 ID를 반환합니다 */
export const showLoading = (message: string) => {
  return toast.loading(message);
};

/** 로딩 토스트를 성공으로 변경합니다 */
export const showLoadingSuccess = (toastId: string | number, message: string) => {
  toast.success(message, { id: toastId });
};

/** 로딩 토스트를 에러로 변경합니다 */
export const showLoadingError = (toastId: string | number, message: string) => {
  toast.error(message, { id: toastId });
};

