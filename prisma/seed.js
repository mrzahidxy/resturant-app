const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  {
    title: "Pizzas",
    desc: "Wood-fired classics with bright, fresh toppings.",
    color: "red-500",
    img: "/temporary/p1.png",
    slug: "pizzas",
  },
  {
    title: "Burgers",
    desc: "Smash-style burgers with house sauces.",
    color: "amber-500",
    img: "/temporary/p2.png",
    slug: "burgers",
  },
  {
    title: "Pasta",
    desc: "Handmade pasta with seasonal ingredients.",
    color: "green-600",
    img: "/temporary/p3.png",
    slug: "pasta",
  },
  {
    title: "Desserts",
    desc: "Sweet finishes baked fresh daily.",
    color: "slate-800",
    img: "/temporary/p4.png",
    slug: "desserts",
  },
];

const products = [
  {
    title: "Margherita Classica",
    desc: "San Marzano tomato, mozzarella, basil, EVOO.",
    img: "/temporary/p5.png",
    price: new Prisma.Decimal("12.00"),
    isFeatured: true,
    options: [
      { title: "Small", additionalPrice: 0 },
      { title: "Large", additionalPrice: 4 },
    ],
    catSlug: "pizzas",
  },
  {
    title: "Pepperoni Heat",
    desc: "Pepperoni, chili honey, mozzarella.",
    img: "/temporary/p6.png",
    price: new Prisma.Decimal("14.00"),
    isFeatured: true,
    options: [
      { title: "Small", additionalPrice: 0 },
      { title: "Large", additionalPrice: 4 },
      { title: "Extra Pepperoni", additionalPrice: 2 },
    ],
    catSlug: "pizzas",
  },
  {
    title: "Truffle Funghi",
    desc: "Wild mushrooms, truffle cream, pecorino.",
    img: "/temporary/p7.png",
    price: new Prisma.Decimal("16.50"),
    isFeatured: false,
    options: [
      { title: "Small", additionalPrice: 0 },
      { title: "Large", additionalPrice: 4 },
    ],
    catSlug: "pizzas",
  },
  {
    title: "Classic Smash",
    desc: "Double patty, cheddar, onion, pickles.",
    img: "/temporary/p8.png",
    price: new Prisma.Decimal("11.50"),
    isFeatured: true,
    options: [
      { title: "Single", additionalPrice: 0 },
      { title: "Double", additionalPrice: 3 },
    ],
    catSlug: "burgers",
  },
  {
    title: "BBQ Bacon Stack",
    desc: "Applewood bacon, BBQ aioli, crispy onions.",
    img: "/temporary/p9.png",
    price: new Prisma.Decimal("13.75"),
    isFeatured: false,
    options: [
      { title: "Single", additionalPrice: 0 },
      { title: "Double", additionalPrice: 3 },
    ],
    catSlug: "burgers",
  },
  {
    title: "Spicy Chick",
    desc: "Crispy chicken, chili slaw, ranch.",
    img: "/temporary/p10.png",
    price: new Prisma.Decimal("12.25"),
    isFeatured: false,
    options: [
      { title: "Regular", additionalPrice: 0 },
      { title: "Extra Spicy", additionalPrice: 1 },
    ],
    catSlug: "burgers",
  },
  {
    title: "Cacio e Pepe",
    desc: "Black pepper, pecorino, butter.",
    img: "/temporary/p11.png",
    price: new Prisma.Decimal("13.00"),
    isFeatured: true,
    options: [
      { title: "Regular", additionalPrice: 0 },
      { title: "Add Chicken", additionalPrice: 3 },
    ],
    catSlug: "pasta",
  },
  {
    title: "Spicy Arrabbiata",
    desc: "Tomato, garlic, chili, basil.",
    img: "/temporary/p12.png",
    price: new Prisma.Decimal("12.00"),
    isFeatured: false,
    options: [
      { title: "Regular", additionalPrice: 0 },
      { title: "Add Shrimp", additionalPrice: 4 },
    ],
    catSlug: "pasta",
  },
  {
    title: "Lemon Ricotta",
    desc: "Ricotta, lemon zest, parmesan.",
    img: "/temporary/p1.png",
    price: new Prisma.Decimal("14.50"),
    isFeatured: false,
    options: [
      { title: "Regular", additionalPrice: 0 },
      { title: "Add Salmon", additionalPrice: 5 },
    ],
    catSlug: "pasta",
  },
  {
    title: "Tiramisu",
    desc: "Espresso-soaked ladyfingers, mascarpone.",
    img: "/temporary/p2.png",
    price: new Prisma.Decimal("7.50"),
    isFeatured: true,
    options: [
      { title: "Classic", additionalPrice: 0 },
      { title: "Extra Cocoa", additionalPrice: 1 },
    ],
    catSlug: "desserts",
  },
  {
    title: "Salted Caramel Budino",
    desc: "Silky pudding, salted caramel, cream.",
    img: "/temporary/p3.png",
    price: new Prisma.Decimal("6.75"),
    isFeatured: false,
    options: [
      { title: "Classic", additionalPrice: 0 },
      { title: "Add Hazelnuts", additionalPrice: 1 },
    ],
    catSlug: "desserts",
  },
  {
    title: "Lemon Olive Oil Cake",
    desc: "Citrus glaze, vanilla cream.",
    img: "/temporary/p4.png",
    price: new Prisma.Decimal("7.25"),
    isFeatured: false,
    options: [
      { title: "Classic", additionalPrice: 0 },
      { title: "Add Berries", additionalPrice: 2 },
    ],
    catSlug: "desserts",
  },
];

const users = [
  {
    name: "Admin User",
    email: "admin@msimmo.test",
    image: "/temporary/m1.png",
    isAdmin: true,
  },
  {
    name: "Jamie Lee",
    email: "jamie@msimmo.test",
    image: "/temporary/m2.png",
    isAdmin: false,
  },
  {
    name: "Casey Park",
    email: "casey@msimmo.test",
    image: "/temporary/m3.png",
    isAdmin: false,
  },
];

const buildOrderItem = (product, quantity, optionTitle) => ({
  id: product.id,
  title: product.title,
  img: product.img,
  price: product.price,
  quantity,
  optionTitle,
});

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    createdProducts.push(created);
  }

  const [adminUser, jamieUser, caseyUser] = await prisma.user.findMany({
    orderBy: { email: "asc" },
  });

  const orders = [
    {
      price: new Prisma.Decimal("39.50"),
      status: "paid",
      userEmail: jamieUser.email,
      products: [
        buildOrderItem(createdProducts[0], 1, "Large"),
        buildOrderItem(createdProducts[9], 2, "Classic"),
      ],
    },
    {
      price: new Prisma.Decimal("27.25"),
      status: "preparing",
      userEmail: caseyUser.email,
      products: [
        buildOrderItem(createdProducts[3], 1, "Double"),
        buildOrderItem(createdProducts[11], 1, "Add Berries"),
      ],
    },
    {
      price: new Prisma.Decimal("18.00"),
      status: "delivered",
      userEmail: jamieUser.email,
      products: [buildOrderItem(createdProducts[6], 1, "Add Chicken")],
    },
    {
      price: new Prisma.Decimal("22.00"),
      status: "not paid",
      userEmail: caseyUser.email,
      products: [
        buildOrderItem(createdProducts[1], 1, "Small"),
        buildOrderItem(createdProducts[7], 1, "Add Shrimp"),
      ],
    },
    {
      price: new Prisma.Decimal("32.75"),
      status: "paid",
      userEmail: adminUser.email,
      products: [
        buildOrderItem(createdProducts[2], 1, "Large"),
        buildOrderItem(createdProducts[10], 1, "Add Hazelnuts"),
      ],
    },
    {
      price: new Prisma.Decimal("19.50"),
      status: "preparing",
      userEmail: jamieUser.email,
      products: [buildOrderItem(createdProducts[4], 1, "Single")],
    },
  ];

  for (const order of orders) {
    await prisma.order.create({ data: order });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
