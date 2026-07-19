import { img1 } from "../assets/Hero";

// Product images — Pexels free stock photos (no API key needed for direct embed)
const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=500`;
import Male from '../assets/vector/Male.jpg';
import Female from '../assets/vector/Female.jpg';
import banner1 from '../assets/Banner/banner1.png';
import banner2 from "../assets/Banner/banner2.png";
import select1 from '../assets/About/select1.jpeg';
import select2 from '../assets/About/select2.jpeg';
import select3 from '../assets/About/select3.jpeg';
import team1 from '../assets/About/team1.jpeg';
import team2 from '../assets/About/team2.jpeg';



export const heroData = {
  description:
    "At NoviBakes, every treat is crafted with love and a sprinkle of magic. From rich chocolate cakes to buttery cupcakes, we bake happiness for every celebration. Taste the joy in every bite!",
  image: img1,
};

//header section data
export const navItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "products", label: "Shop", path: "/shop" },
  { id: "aboutus", label: "About", path: "/aboutus" },
  { id: "service", label: "Services", path: "/services" },
  // { id: "reviews", label: "Reviews", path: "/reviews" },
  { id: "contactus", label: "Contact", path: "/contactus" },
];

//About Us section data
export const aboutUsInfo = {
  title: "Bringing People Together with Sweet Creations and Shared Moments",
  description: "At NoviBakes, we are committed to delivering high-quality, freshly baked treats made with the finest ingredients. Led by Kiruthikasanthoshni, a skilled baker with professional training, our home-based bakery specializes in crafting delicious, made-from-scratch cakes and cookies, free from artificial additives. What began as a passion for baking has now grown into a beloved business focused on creating memorable, wholesome desserts for every occasion. Whether you're celebrating a milestone or simply indulging in a sweet craving, NoviBakes provides the perfect treat to brighten your day. Every creation is made with care, ensuring that each bite is as delightful as the last. We take pride in offering custom cakes, assorted brownies, and other baked goods tailored to your needs, with delivery available within the Salem area. Experience the warmth and joy of homemade desserts that bring people together, one sweet creation at a time.",
  mission:
    "At NoviBakes, our mission is to create joy through delicious, handcrafted desserts that bring people together and make every moment special. We're committed to using premium ingredients, supporting local suppliers, and providing exceptional customer service to ensure every experience with us is delightful from start to finish.",
};
// data.js

export const featureCards = [
  {
    title: "Premium Ingredients",
    text: "We use only the finest, freshest ingredients in all our baked goods."
  },
  {
    title: "Made with Love",
    text: "Every treat is crafted with care and attention to detail."
  },
  {
    title: "Custom Designs",
    text: "We create personalized desserts tailored to your special occasions."
  },
  {
    title: "Fresh Daily",
    text: "Our products are baked fresh daily for maximum taste and quality."
  }
];


// About image
export const galleryImages = {
  main: {
    src: select1,
    alt: "Baker preparing desserts",
  },
  preview:{
    src: select2,
    alt: "Baker preparing desserts"
  },
  others: [
    {
      src: select3,
      alt: "Fresh ingredients",
    },
    {
      src: "https://images.pexels.com/photos/8477777/pexels-photo-8477777.jpeg",
      alt: "Baking tools",
    },
  ],
};
export const teamMembers = [
  {
    name: "Kiruthika Santhoshni",
    role: "Founder & Head Baker",
    description: "A passionate baker with professional training and a deep love for crafting sweet experiences. Kiruthika founded NoviBakes with a mission to blend creativity, quality, and warmth into every dessert. Her dedication to perfection and customer delight drives the heart of everything we do.",
    img: team1,
  },
  {
    name: "Subhashni",
    role: "Assistant Baker",
    description: "With a flair for perfection and a keen eye for detail, Subhashni ensures every bake meets the highest standards. Her creativity and commitment bring balance to the kitchen, making each dessert a true delight.",
    img: team1,
  },
  {
    name: "Dhanush",
    role: "Customer Relations",
    description: "Dhanush handles all customer interactions with warmth and care, ensuring every order is smooth and satisfying. His friendly approach and dedication to service make every NoviBakes experience memorable.",
    img: team2,
  },
];

// footer section data
export const footerContactInfo = {
  email: import.meta.env.VITE_BAKERY_EMAIL,
  contact: import.meta.env.VITE_BAKERY_PHONE,
};

//Footer section data
export const fotItems = {
  home: { id: "home", label: "Home" },
  products: { id: "products", label: "Products" },
  aboutUs: { id: "aboutUs", label: "AboutUs" },
  services: { id: "service", label: "Services" },
  contactUs: { id: "contactUs", label: "ContactUs" },
};

// footer section product data
export const footerProductInfo = {
  productName : "NoviBakes",
  productDescription: "Unleash your sweet tooth where every bite is pure delight!"
}


export const contactDetails = [
  {
    label: "Location",
    text: "Chennai,TamilNadu",
  },
  {
    label: "Phone",
    text: import.meta.env.VITE_BAKERY_PHONE,
  },
  {
    label: "Email",
    text: import.meta.env.VITE_BAKERY_EMAIL,
  },
  {
    label: "Open-Hours",
    text: "Mon-Sun: 10 AM – 8 PM",
  },
];


export const serviceCardInfo = [
  {
  id:1,  
  title:"Custom Cakes",
  detail:"Indulge in our handcrafted custom cakes designed for birthdays, weddings, anniversaries,and all your cherished moments. Choose your favorite flavors, designs, and themes—each cake is made to match your vision and make your celebration unforgettable."
},
{
  id:2,  
  title:"Assorted Brownies",
  detail:"Enjoy our rich, fudgy brownies made with premium ingredients—available in classic flavors and assorted boxes. Perfect for gifting, celebrations, or simply treating yourself, every bite is a delightful experience crafted with love."
},
{
  id:3,  
  title:"Online Ordering & Delivery",
  detail:"Craving something sweet? Place your orders online and enjoy our freshly baked cakes, brownies, and treats delivered right to your doorstep. We offer reliable delivery across the Salem area—making celebrations easier than ever!"
}
]

// Additional Offerings
export const additionalOfferings = [
  {
    title: "Special Occasion Cakes",
    image:
      "https://images.pexels.com/photos/2638026/pexels-photo-2638026.jpeg",
    description:
      "Custom-designed cakes for birthdays, anniversaries, weddings, and other special celebrations. Made with premium ingredients and decorated to your specifications.",
    bulletPoints: [
      "48-hour advance notice required",
      "Consultation available for complex designs",
      "Dietary accommodations available",
    ],
  },
  {
    title: "Bulk & Corporate Orders",
    image:
      "https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg",
    description:
      "Perfect for office meetings, client gifts, or family gatherings. Choose from our selection of pastries, cookies, bread, and more in larger quantities.",
    bulletPoints: [
      "24-hour advance notice required",
      "Delivery available for orders over $100",
      "Custom packaging and branding options",
    ],
  },
];

// Order Timeline Data
export const orderTimeline = [
  { label: "Regular Orders", timeframe: "24 hours in advance" },
  { label: "Custom Cakes", timeframe: "3-5 days in advance" },
  { label: "Wedding Cakes", timeframe: "2-3 months in advance" },
  { label: "Large Events", timeframe: "2+ weeks in advance" },
];

// our process 
export const ourProcess = [
  {
    step: "01",
    emoji: "💬",
    title: "Place Your Order",
    detail: "Browse our menu or chat with us about a custom creation — flavours, design, size, and delivery date. We love hearing your ideas.",
  },
  {
    step: "02",
    emoji: "🧑‍🍳",
    title: "We Craft With Care",
    detail: "Our bakers hand-pick premium ingredients and bake your order fresh from scratch. Zero shortcuts, every detail done with love.",
  },
  {
    step: "03",
    emoji: "✅",
    title: "Quality Approved",
    detail: "Before anything leaves our kitchen, every item is tasted and inspected. If it isn't perfect, it simply doesn't go out.",
  },
  {
    step: "04",
    emoji: "🎁",
    title: "Fresh to Your Door",
    detail: "Your order arrives beautifully packaged and on time — ready to make someone's celebration truly unforgettable.",
  },
]


// Add products
export const products = [
  {
    id: 1,
    name: "Strawberry Fresh Cream Cake",
    image: px(36414765),
    rating: 4.5,
    category: "Cakes",
    description: "Soft sponge layered with fresh cream and strawberry flavor.",
    weights: {
      "500g": 450,
      "1kg": 800,
      "1.5kg": 1150,
      "2kg": 1500,
    },
  },
  {
    id: 2,
    name: "Pineapple Fresh Cream Cake",
    image: px(8954801),
    rating: 4.4,
    category: "Cakes",
    description: "Classic pineapple cake with whipped cream and fruit toppings.",
    weights: {
      "500g": 430,
      "1kg": 780,
      "1.5kg": 1100,
      "2kg": 1450,
    },
  },
  {
    id: 3,
    name: "Orange Fresh Cream Cake",
    image: px(15071184),
    rating: 4.3,
    category: "Cakes",
    description: "Citrusy and light, with layers of fresh orange flavor. Note: Delivery charge added separately.",
    weights: {
      "500g": 420,
      "1kg": 760,
      "1.5kg": 1080,
      "2kg": 1400,
    },
  },
  {
    id: 4,
    name: "Blueberry Fresh Cream Cake",
    image: px(4686817),
    rating: 4.6,
    category: "Cakes",
    description: "Delicious blueberry topping with smooth fresh cream.",
    weights: {
      "500g": 470,
      "1kg": 850,
      "1.5kg": 1200,
      "2kg": 1550,
    },
  },
  {
    id: 5,
    name: "Black Forest Cake",
    image: px(11774178),
    rating: 4.7,
    category: "Cakes",
    description: "Chocolate sponge, cherries, and whipped cream.",
    weights: {
      "500g": 480,
      "1kg": 880,
      "1.5kg": 1250,
      "2kg": 1600,
    },
  },
  {
    id: 6,
    name: "White Forest Cake",
    image: px(5713248),
    rating: 4.5,
    category: "Cakes",
    description: "White chocolate and vanilla twist with cherry topping.",
    weights: {
      "500g": 460,
      "1kg": 840,
      "1.5kg": 1180,
      "2kg": 1520,
    },
  },
  {
    id: 7,
    name: "Choco Truffle Cake",
    image: px(691147),
    rating: 4.8,
    category: "Cakes",
    description: "Rich chocolate truffle cake perfect for chocolate lovers.",
    weights: {
      "500g": 520,
      "1kg": 950,
      "1.5kg": 1380,
      "2kg": 1800,
    },
  },
  {
    id: 8,
    name: "Rasmalai Cake",
    image: px(19600001),
    rating: 4.6,
    category: "Cakes",
    description: "Fusion dessert cake with rasmalai and cream topping.",
    weights: {
      "500g": 550,
      "1kg": 1000,
      "1.5kg": 1450,
      "2kg": 1900,
    },
  },
  {
    id: 9,
    name: "Rose Milk Cake",
    image: px(29192489),
    rating: 4.4,
    category: "Cakes",
    description: "Delicately flavored rose milk cake with soft texture.",
    weights: {
      "500g": 500,
      "1kg": 920,
      "1.5kg": 1320,
      "2kg": 1720,
    },
  },
  {
    id: 10,
    name: "Gulab Jamun Cake",
    image: px(4110012),
    rating: 4.5,
    category: "Cakes",
    description: "Classic Indian dessert twist with gulab jamun topping.",
    weights: {
      "500g": 530,
      "1kg": 980,
      "1.5kg": 1400,
      "2kg": 1820,
    },
  },
  {
    id: 11,
    name: "Brownie Cake",
    image: px(1028714),
    rating: 4.7,
    category: "Brownies",
    description: "Fudgy and chocolaty brownie cake with a rich flavor.",
    weights: {
      "250g": 180,
      "500g": 340,
      "1kg": 650,
    },
  },
  {
    id: 12,
    name: "Tres Leches Cake",
    image: px(30491028),
    rating: 4.6,
    category: "Cakes",
    description: "Soft and moist Latin-American cake soaked in three types of milk.",
    weights: {
      "500g": 540,
      "1kg": 990,
      "1.5kg": 1430,
      "2kg": 1860,
    },
  },
  {
    id: 13,
    name: "Vanilla Cupcake",
    image: px(9295338),
    rating: 4.5,
    category: "Cupcakes",
    description: "Classic vanilla cupcake topped with creamy frosting.",
    weights: {
      "1pc": 50,
      "6pcs": 280,
      "12pcs": 520,
    },
  },
  {
    id: 14,
    name: "Red Velvet Cake",
    image: px(16386492),
    rating: 4.8,
    category: "Cakes",
    description: "Velvety red sponge with tangy cream cheese frosting — a crowd favourite.",
    weights: {
      "500g": 560,
      "1kg": 1020,
      "1.5kg": 1480,
      "2kg": 1920,
    },
  },
  {
    id: 15,
    name: "Butterscotch Cake",
    image: px(13063263),
    rating: 4.6,
    category: "Cakes",
    description: "Caramel-kissed butterscotch cream layered on soft vanilla sponge.",
    weights: {
      "500g": 480,
      "1kg": 880,
      "1.5kg": 1260,
      "2kg": 1640,
    },
  },
  {
    id: 16,
    name: "Mango Cream Cake",
    image: px(31936366),
    rating: 4.7,
    category: "Cakes",
    description: "Fresh Alphonso mango pulp layered with light whipped cream on a soft sponge.",
    weights: {
      "500g": 500,
      "1kg": 920,
      "1.5kg": 1320,
      "2kg": 1700,
    },
  },
  {
    id: 17,
    name: "Dark Chocolate Mousse Cake",
    image: px(18856447),
    rating: 4.9,
    category: "Cakes",
    description: "Intensely rich dark chocolate mousse on a moist chocolate sponge base.",
    weights: {
      "500g": 580,
      "1kg": 1060,
      "1.5kg": 1540,
      "2kg": 2000,
    },
  },
  {
    id: 18,
    name: "Coconut Cream Cake",
    image: px(7690068),
    rating: 4.4,
    category: "Cakes",
    description: "Tropical coconut cream filling with toasted coconut flakes on top.",
    weights: {
      "500g": 460,
      "1kg": 840,
      "1.5kg": 1200,
      "2kg": 1560,
    },
  },
  {
    id: 19,
    name: "Choco Brownie Fudge",
    image: px(14577525),
    rating: 4.8,
    category: "Brownies",
    description: "Extra fudgy, gooey chocolate brownie loaded with chocolate chips.",
    weights: {
      "250g": 200,
      "500g": 380,
      "1kg": 720,
    },
  },
  {
    id: 20,
    name: "Walnut Brownie",
    image: px(6525614),
    rating: 4.6,
    category: "Brownies",
    description: "Classic chewy brownie packed with crunchy roasted walnuts.",
    weights: {
      "250g": 190,
      "500g": 360,
      "1kg": 680,
    },
  },
  {
    id: 21,
    name: "Chocolate Cupcake",
    image: px(6896369),
    rating: 4.7,
    category: "Cupcakes",
    description: "Moist chocolate cupcake topped with silky chocolate buttercream.",
    weights: {
      "1pc": 60,
      "6pcs": 330,
      "12pcs": 620,
    },
  },
  {
    id: 22,
    name: "Red Velvet Cupcake",
    image: px(28873028),
    rating: 4.6,
    category: "Cupcakes",
    description: "Miniature red velvet cake with cream cheese frosting swirl.",
    weights: {
      "1pc": 65,
      "6pcs": 360,
      "12pcs": 680,
    },
  },
  {
    id: 23,
    name: "Caramel Drip Cake",
    image: px(5172006),
    rating: 4.7,
    category: "Cakes",
    description: "Salted caramel drip over a vanilla sponge with caramel buttercream layers.",
    weights: {
      "500g": 540,
      "1kg": 990,
      "1.5kg": 1430,
      "2kg": 1870,
    },
  },
  {
    id: 24,
    name: "Lemon Drizzle Cake",
    image: px(11136872),
    rating: 4.5,
    category: "Cakes",
    description: "Zesty lemon sponge soaked in lemon syrup with a sugar glaze topping.",
    weights: {
      "500g": 440,
      "1kg": 800,
      "1.5kg": 1140,
      "2kg": 1480,
    },
  },
];

// Testimonials section 
export const testimonials = [
  {
    name: "Dhanush",
    title: "Dhanush",
    image: Male,
    testimonial:
      "The chocolate cake was amazing! The texture was soft and the flavors were perfect. Definitely ordering again!",
    rating: 5,
  },
  {
    name: "Subhashni",
    title: "Subhashni",
    image: Female,
    testimonial:
      "I tried the brownie for the first time and it was melt-in-your-mouth delicious. The perfect balance of sweetness.",
    rating: 5,
  },
  {
    name: "Sugirthan",
    title: "Sugirthan",
    image: Male,
    testimonial:
      "The vanilla cake was so soft and light. It tasted fresh and was absolutely delightful! Highly recommend it.",
    rating: 4,
  },
  {
    name: "Subhash",
    title: "Subhash",
    image: Male,
    testimonial:
      "Had the brownie, and it was rich, fudgy, and just the right amount of sweetness. Loved it! Highly recommend it.",
    rating: 5,
  },
  {
    name: "kiruthika",
    title: "kiruthika",
    image: Female,
    testimonial:
      "I ordered the chocolate cake for my birthday, and it was absolutely divine! Moist, flavorful, and beautifully decorated.",
    rating: 5,
  },
  {
    name: "Gugan",
    title: "Gugan",
    image: Male,
    testimonial:
      "The brownies were so gooey and rich in flavor! Perfect for anyone who loves chocolate. Highly recommend it.",
    rating: 5,
  },
];

export const bannerSlides = [
  {
    id: 1,
    imageUrl: banner1,
    alt: "Sale",
  },
  {
    id: 2,
    imageUrl: banner1,
    alt: "Sale",
  },
  {
    id: 3,
    imageUrl: banner2,
    alt: "Sale",
  },
];

export const navData = [
  {
    url: "https://cdn-icons-png.flaticon.com/128/869/869636.png", // cake icon
    text: "Cakes",
  },
  {
    url: "https://cdn-icons-png.flaticon.com/128/1046/1046784.png", // cupcake icon
    text: "Cupcakes",
  },
  {
    url: "https://cdn-icons-png.flaticon.com/128/1046/1046786.png", // cookie icon
    text: "Cookies",
  },
  {
    url: "https://cdn-icons-png.flaticon.com/128/1046/1046793.png", // pastry icon
    text: "Pastries",
  },
  {
    url: "https://cdn-icons-png.flaticon.com/128/2917/2917997.png", // bread icon
    text: "Breads",
  },
  {
    url: "https://cdn-icons-png.flaticon.com/128/3063/3063822.png", // custom order
    text: "Custom Orders",
  },
  {
    url: "https://cdn-icons-png.flaticon.com/128/2991/2991115.png", // gift box
    text: "Gift Boxes",
  },
  {
    url: "https://cdn-icons-png.flaticon.com/128/1995/1995512.png", // party icon
    text: "Party Packs",
  },
  {
    url: "https://cdn-icons-png.flaticon.com/128/1041/1041916.png", // offer tag
    text: "Top Offers",
  },
];



