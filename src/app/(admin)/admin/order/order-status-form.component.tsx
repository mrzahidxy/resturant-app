"use client";

import { useMutation} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Props = {
  item: any;
};

const OrderStatusForm = ({ item }: Props) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });
    },

    onSuccess() {
      toast.success("Order status has been updated");
      router.refresh();
    },
  });
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form[0] as HTMLInputElement;
    const status = input?.value;
  
    status && mutation.mutate({ id, status });

  };

  return (
    <div>
      <form
        className="flex items-center justify-center gap-4"
        onSubmit={(e) => handleUpdate(e, item.id)}
      >
        <input
          placeholder={item.status}
          className="p-2 ring-1 ring-red-100 rounded-md"
        />
        <button className="bg-red-400 text-white p-2 rounded-md">
          Update
        </button>
      </form>
    </div>
  );
};

export default OrderStatusForm;
