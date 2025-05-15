import Swal from "sweetalert2";
import type { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

/**
 * Displays a toast notification using SweetAlert2.
 *
 * @param {SweetAlertIcon} type - The icon type for the notification (e.g., 'success', 'error', 'info', etc.).
 * @param {string} message - The message to display in the toast.
 * @param {number} [timer=3000] - Duration in milliseconds before the toast closes automatically.
 * @returns {Promise<SweetAlertResult>} Promise that resolves when the toast is closed.
 *
 * The toast appears at the top-end of the screen, with a progress bar and auto-dismisses after the specified timer.
 * Pauses the timer when hovered.
 */
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