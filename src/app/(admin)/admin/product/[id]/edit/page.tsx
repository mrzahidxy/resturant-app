"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { editProductSchema } from "./shema";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
  isFeatured: number;
};

type Option = {
  title: string;
  additionalPrice: number;
};

type ProductResponse = {
  id: string;
  title: string;
  desc: string;
  price: string | number;
  catSlug: string;
  img?: string;
  isFeatured: boolean;
  options?: { title: string; additionalPrice: string | number }[];
};

const EditProductPage = () => {
  const { status } = useSession();
  const { push } = useRouter();
  const params = useParams<{ id: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const optionsRefTitle = useRef<HTMLInputElement>(null);
  const optionsRefAdditionalPrice = useRef<HTMLInputElement>(null);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState<string>("");
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "pizzas",
    isFeatured: 0,
  });
  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });
  const [options, setOptions] = useState<Option[]>([]);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = (await response.json()) as ProductResponse;

        setInputs({
          title: data.title,
          desc: data.desc,
          price: Number(data.price),
          catSlug: data.catSlug,
          isFeatured: data.isFeatured ? 1 : 0,
        });

        setOptions(
          Array.isArray(data.options)
            ? data.options.map((item) => ({
                title: item.title,
                additionalPrice: Number(item.additionalPrice),
              }))
            : []
        );

        setCurrentImg(data.img ?? "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setIsPageLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked ? 1 : 0;

    const parsedValue = name === "price" ? Number(value) : value;
    const newValue = type === "checkbox" ? checked : parsedValue;

    setInputs((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleChangeOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "additionalPrice" ? Number(value) : value;

    setOption((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleAddOption = () => {
    if (!option.title.trim()) {
      toast.error("Option title is required");
      return;
    }

    setOptions((prev) => [...prev, option]);
    setOption({ title: "", additionalPrice: 0 });

    if (optionsRefTitle.current) optionsRefTitle.current.value = "";
    if (optionsRefAdditionalPrice.current) optionsRefAdditionalPrice.current.value = "";
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    if (item) {
      setFile(item);
    }
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Product is successfully updated");
        push("/admin/product");
      } else {
        toast.error("Something went wrong");
      }

      return response.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const validatedInputs = editProductSchema.parse({
        ...inputs,
        options,
        file,
      });

      const formData = new FormData();
      formData.append("title", validatedInputs.title);
      formData.append("desc", validatedInputs.desc);
      formData.append("price", validatedInputs.price.toString());
      formData.append("catSlug", validatedInputs.catSlug);
      formData.append("options", JSON.stringify(validatedInputs.options));
      formData.append("isFeatured", validatedInputs.isFeatured.toString());

      if (file) {
        formData.append("img", file);
      }

      mutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  if (status === "loading" || isPageLoading) {
    return <p>Loading...</p>;
  }

  const previewImage = file
    ? URL.createObjectURL(file)
    : currentImg || "/upload.jpg";

  return (
    <div className="py-4 lg:px-20 xl:px-40 flex items-center justify-center text-red-500">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-1/2 flex flex-col gap-3"
      >
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">Edit Product</h1>

        <div className="w-full flex flex-col gap-1">
          <label
            className="text-sm cursor-pointer flex gap-4 items-center"
            htmlFor="file"
          >
            <Image
              src={previewImage}
              alt=""
              width={50}
              height={50}
              loading="lazy"
            />
            <span className="cursor-pointer font-medium">Upload Image</span>
          </label>
          <input
            type="file"
            onChange={handleChangeImg}
            id="file"
            className="hidden"
          />
        </div>

        <div className="w-full flex flex-col gap-1 ">
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <span>*</span>
          </div>
          <input
            className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="title"
            id="title"
            onChange={handleChange}
            value={inputs.title}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <div>
            <label htmlFor="desc" className="text-sm font-medium">
              Details
            </label>
            <span>*</span>
          </div>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            id="desc"
            onChange={handleChange}
            value={inputs.desc}
          />
        </div>

        <div className="w-full flex flex-col gap-1 ">
          <div>
            <label htmlFor="price" className="text-sm font-medium">
              Price
            </label>
            <span>*</span>
          </div>
          <input
            className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            type="number"
            placeholder="29"
            name="price"
            id="price"
            onChange={handleChange}
            value={inputs.price}
          />
        </div>

        <div className="w-full flex flex-col gap-1 ">
          <div>
            <label htmlFor="catSlug" className="text-sm font-medium">
              Category
            </label>
            <span>*</span>
          </div>
          <select
            className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            name="catSlug"
            id="catSlug"
            onChange={handleChange}
            value={inputs.catSlug}
          >
            <option value="pizzas">Cheesy Pizzas</option>
            <option value="pastas">Italian Pastas</option>
            <option value="burgers">Juicy Burgers</option>
          </select>
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="options" className="text-sm font-medium">
            Options
          </label>
          <div className="flex">
            <input
              className="flex-1 ring-1 ring-red-200 p-1 rounded-sm placeholder:text-red-200 outline-none"
              type="text"
              placeholder="Title"
              name="title"
              ref={optionsRefTitle}
              onChange={handleChangeOptions}
            />
            <input
              className="flex-1 ring-1 ring-red-200 p-1 rounded-sm placeholder:text-red-200 outline-none"
              type="number"
              placeholder="Additional Price"
              name="additionalPrice"
              ref={optionsRefAdditionalPrice}
              onChange={handleChangeOptions}
            />
            <button
              type="button"
              className="bg-gray-500 p-1 text-white"
              onClick={handleAddOption}
            >
              Add Option
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            {options.map((opt) => (
              <button
                key={`${opt.title}-${opt.additionalPrice}`}
                type="button"
                className="p-2 rounded-md cursor-pointer bg-gray-200 text-gray-400"
                onClick={() =>
                  setOptions((prev) => prev.filter((item) => item !== opt))
                }
              >
                <span>{opt.title}</span>
                <span className="text-xs"> (+ ${opt.additionalPrice})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex gap-4 ">
          <div>
            <label htmlFor="isFeatured" className="text-sm font-medium">
              Featured
            </label>
          </div>
          <input
            type="checkbox"
            name="isFeatured"
            checked={inputs.isFeatured === 1}
            id="isFeatured"
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-red-500 p-2 text-white w-48 rounded-md relative h-10 text-center"
          >
            {mutation.isPending ? "Submitting" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
