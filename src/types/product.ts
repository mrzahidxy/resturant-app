export type TProduct = {
    id: string;
    createdAt: string; // Assuming ISO 8601 format for date-time strings
    title: string;
    desc: string;
    img?: string; // Optional field
    price: string; // Assuming price is in numeric format
    isFeatured: boolean;
    options: { title: string; additionalPrice: string }[]; // Array of options objects
    catSlug: string;
  };


  export type TProductBody = {
    title: string;
    desc: string;
    img?: string; 
    price: number; 
    isFeatured?: boolean;
    options: { title: string; additionalPrice: number }[];
    catSlug: string;
  };
  