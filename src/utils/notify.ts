import Swal from "sweetalert2";
import type { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

export default function notify(
  type: SweetAlertIcon,
  message: string,
  timer = 3000
): Promise<SweetAlertResult> {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast: HTMLElement) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon: type,
    title: message,
  });
}