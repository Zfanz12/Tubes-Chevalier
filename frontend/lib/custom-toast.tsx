import { toast } from "sonner";

type ToastVariant = "success" | "error" | "hello" | "party";

const GIF_MAP: Record<ToastVariant, string> = {
  success: "/gif/success.gif",
  error: "/gif/failed.gif",
  hello: "/gif/hello.gif",
  party: "/gif/party.gif",
};

const GIF_SIZE_MAP: Record<ToastVariant, number> = {
  success: 36,
  error: 28,
  hello: 36,
  party: 36,
};

const DURATION_MAP: Record<ToastVariant, number> = {
  success: 3000,
  error: 3500,
  hello: 3000,
  party: 3000,
};

function ToastContent({ message, variant }: { message: string; variant: ToastVariant }) {
  const size = GIF_SIZE_MAP[variant];
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg px-3.5 py-2 border border-gray-100 min-w-[270px] max-w-[340px]">
      <img
        src={GIF_MAP[variant]}
        alt={variant}
        style={{ width: size, height: size, objectFit: "contain", flexShrink: 0, display: "block" }}
        className="ml-2"
      />
      <p className="flex-1 text-sm font-semibold text-gray-800 ml-1">{message}</p>
    </div>
  );
}

export function showToast(message: string, variant: ToastVariant = "success") {
  toast.custom(
    () => <ToastContent message={message} variant={variant} />,
    {
      duration: DURATION_MAP[variant],
      className: "!bg-transparent !shadow-none !border-0 !p-0",
    }
  );
}
