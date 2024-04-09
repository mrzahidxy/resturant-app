"use client";

import { TProductBody } from "@/types/product";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
};

type Option = {
  title: string;
  additionalPrice: number;
};

const AddPage = () => {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });

  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });
  const [options, setOptions] = useState<Option[]>([]);
  const [file, setFile] = useState<File>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };


  const handleChangeOptions = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOption((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", "resturant-app");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/mrzahidxy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const resData = await res.json();

    return resData.url;
  };

  const mutation = useMutation({
    mutationFn: (body: TProductBody) => {
      return fetch(`http://localhost:3000/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    },
    onSuccess() {
      toast.success("Product is successfully added");
      setInputs({ title: "", desc: "", price: 0, catSlug: "" }); 
      setOption({ title: "", additionalPrice: 0 });
      setOptions([]);
      setFile(undefined);
      if (formRef.current) {
        formRef.current.reset();
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = await upload();

      mutation.mutate({
        img: url,
        ...inputs,
        options,
      });
    } catch (error) {
      toast.error(error as any);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    push("/");
  }



  return (
    <div className="py-4 lg:px-20 xl:px-40 flex items-center justify-center text-red-500">
      <form ref={formRef} onSubmit={handleSubmit} className="w-1/2 flex flex-wrap gap-6">
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">
          Add New Product
        </h1>
        <div className="w-full flex flex-col gap-2 ">
          <label
            className="text-sm cursor-pointer flex gap-4 items-center"
            htmlFor="file"
          >
            <Image src={file ? URL.createObjectURL(file as File) :"/upload.jpg"} alt="" width={50} height={50} />
            <span className="cursor-pointer font-medium">Upload Image</span>
          </label>
          <input
            type="file"
            onChange={handleChangeImg}
            id="file"
            className="hidden"
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm font-medium">Title</label>
          <input
            className="ring-1 ring-red-200 p-3 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-3 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm font-medium">Price</label>
          <input
            className="ring-1 ring-red-200 p-3 rounded-sm placeholder:text-red-200 outline-none"
            type="number"
            placeholder="29"
            name="price"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm font-medium">Category</label>
          <select
            className="ring-1 ring-red-200 p-3 rounded-sm placeholder:text-red-200 outline-none"
            name="catSlug"
            onChange={handleChange}
          >
            <option value="pizzas">Pizaa</option>
            <option value="pastas">Pasta</option>
            <option value="burgers">Burger</option>
          </select>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm font-medium">Options</label>
          <div className="flex">
            <input
              className="ring-1 ring-red-200 p-3 rounded-sm placeholder:text-red-200 outline-none"
              type="text"
              placeholder="Title"
              name="title"
              onChange={handleChangeOptions}
            />
            <input
              className="ring-1 ring-red-200 p-3 rounded-sm placeholder:text-red-200 outline-none"
              type="number"
              placeholder="Additional Price"
              name="additionalPrice"
              onChange={handleChangeOptions}
            />
            <button
              type="button"
              className="bg-gray-500 p-2 text-white"
              onClick={() => setOptions((prev) => [...prev, option])}
            >
              Add Option
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {options?.map((opt) => (
              <div
                key={opt.title}
                className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
                onClick={() =>
                  setOptions((prev) =>
                    prev.filter((item) => item.title !== opt.title)
                  )
                }
              >
                <span>{opt.title}</span>
                <span className="text-xs"> (+ ${opt.additionalPrice})</span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-red-500 p-3 text-white w-48 rounded-md relative h-12 flex items-center justify-center"
        >
          {mutation.isPending ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddPage;
