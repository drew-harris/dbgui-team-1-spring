import { toast } from "react-hot-toast";

export function ToastSuccess(message: string) {
  toast.success(message, {
    duration: 2000,
    style: {
      border: "1px solid #A855F7",
      padding: "16px",
      color: "#A855F7",
    },
    iconTheme: {
      primary: "#A855F7",
      secondary: "#FFFAEE",
    },
  });
}

export function ToastError(message: string) {
  toast.error(message, {
    duration: 2000,
    style: {
      border: "1px solid #EF4444",
      padding: "16px",
      color: "#EF4444",
    },
    iconTheme: {
      primary: "#EF4444",
      secondary: "#FFFAEE",
    },
  });
}
