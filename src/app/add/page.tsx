"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
  isFeatured: boolean;
};

type Option = {
  title: string;
  additionalPrice: number;
};

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  catSlug: z.string().min(1, "Category is required"),
  options: z.array(
    z.object({
      title: z.string().min(1, "Option title is required"),
      additionalPrice: z.number().min(0, "Additional price must be at least 0"),
    })
  ),
  file: z.any().refine((file) => file && typeof file === "object", {
    message: "File must be uploaded",
  }),
});

const AddPage = () => {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "pizzas",
    isFeatured: false,
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
    const { name, type,value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const isPrice = name === "price";
    const parsedPrice = isPrice ? parseInt(value) : value;
    const newValue = type === "checkbox" ? checked : parsedPrice;

    setInputs((prev) => {
      return { ...prev, [e.target.name]: newValue };
    });
  };

  const handleChangeOptions = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue = name === "additionalPrice" ? parseInt(value) : value;

    setOption((prev) => {
      return { ...prev, [e.target.name]: parsedValue };
    });
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, option]);
    setOption({ title: "", additionalPrice: 0 });
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  };

  // Add product mutation & submission
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response?.ok) {
        toast.success("Product is successfully added");
      } else {
        toast.error("Something went wrong");
      }

      return response.json();
    },
  });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const validatedInputs = productSchema.parse({
        ...inputs,
        options,
        file,
      });

      if (validatedInputs) {
        const formData = new FormData();

        formData.append("title", validatedInputs.title);
        formData.append("desc", validatedInputs.desc);
        formData.append("price", validatedInputs.price.toString());
        formData.append("catSlug",  validatedInputs.catSlug);
        formData.append("img", validatedInputs.file);
        formData.append(`options`, JSON.stringify(validatedInputs.options))
  
        mutation.mutate(formData);
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display validation errors
        error.errors.forEach((err) =>toast.error(err.message));
      } else {
        toast.error("Unexpected error occurred");
      }
    }
    }


  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    push("/");
  }

  return (
    <div className="py-4 lg:px-20 xl:px-40 flex items-center justify-center text-red-500">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-1/2 flex flex-wrap gap-3"
      >
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">
          Add New Product
        </h1>
        <div className="w-full flex flex-col gap-1">
          <label
            className="text-sm cursor-pointer flex gap-4 items-center"
            htmlFor="file"
          >
            <Image
              src={file ? URL.createObjectURL(file) : "/upload.jpg"}
              alt=""
              width={50}
              height={50}
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
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <span>*</span>
          </div>
          <input
            className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="title"
            id="title"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <div>
            <label htmlFor="desc" className="text-sm font-medium">Details</label>
            <span>*</span>
          </div>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            id="desc"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-1 ">
          <div>
            <label htmlFor="price" className="text-sm font-medium">Price</label>
            <span>*</span>
          </div>
          <input
            className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            type="number"
            placeholder="29"
            name="price"
            id="price"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-1 ">
          <div>
            <label htmlFor="catSlug" className="text-sm font-medium">Category</label>
            <span>*</span>
          </div>
          <select
            className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            name="catSlug"
            id="catSlug"
            onChange={handleChange}
            value={inputs?.catSlug}
          >
            <option value="pizzas">Cheesy Pizzas</option>
            <option value="pastas">Italian Pastas</option>
            <option value="burgers">Juicy Burgers</option>
          </select>
        </div>

         <div className="w-full flex gap-1 ">
          <div>
            <label htmlFor="isFeatured" className="text-sm font-medium">Featured</label>
          </div>
          <input
            className=""
            type="checkbox"
            name="isFeatured"
            checked={inputs?.isFeatured}
            id="isFeatured"
            onChange={handleChange}
          />
        </div> 

        <div className="flex flex-col gap-1">
          <label htmlFor="options" className="text-sm font-medium">Options</label>
          <div className="flex">
            <input
              className="ring-1 ring-red-200 p-1 rounded-sm placeholder:text-red-200 outline-none"
              type="text"
              placeholder="Title"
              name="title"
              onChange={handleChangeOptions}
            />
            <input
              className="ring-1 ring-red-200 p-1 rounded-sm placeholder:text-red-200 outline-none"
              type="number"
              placeholder="Additional Price"
              name="additionalPrice"
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
            {options?.map((opt) => (
              <button
                key={opt.title}
                className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
                onClick={() =>
                  setOptions((prev) =>
                    prev.filter((item) => item !== opt)
                  )
                }
              >
                <span>{opt.title}</span>
                <span className="text-xs"> (+ ${opt.additionalPrice})</span>
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-red-500 p-2 text-white w-48 rounded-md relative h-10 text-center"
        >
          {mutation.isPending ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddPage;
