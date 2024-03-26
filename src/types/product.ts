export type TProduct = {
    id: string;
    createdAt: string; // Assuming ISO 8601 format for date-time strings
    title: string;
    desc: string;
    img?: string; // Optional field
    price: number; // Assuming price is in numeric format
    isFeatured: boolean;
    options: { title: string; additionalPrice: number }[]; // Array of options objects
    catSlug: string;
  };
  