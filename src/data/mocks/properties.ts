import { Property } from "../../components/common/PropertyCard";

export const MOCKED_PROPERTIES: Property[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Modern Family Home",
    price: 350,
    bedrooms: 2,
    bathrooms: 1,
    garages: 1,
    address: "12 Kingfisher Drive, Doncaster, VIC",
    description:
      "A spacious, sunlit family home with an open-plan living area, a private backyard...",
      type: "House"
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1501183638714-8c2bfb0f6b9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Cozy Downtown Apartment",
    price: 250,
    bedrooms: 1,
    bathrooms: 1,
    garages: 0,
    address: "45 Main St, Melbourne, VIC",
    description:
      "A stylish apartment in the heart of the city, close to shops and restaurants.",
      type: "Apartment"
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Luxury Beachside Villa",
    price: 1200,
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    address: "78 Ocean View Rd, Byron Bay, NSW",
    description:
      "A stunning villa with panoramic ocean views, a private pool, and modern amenities.", 
    type: "Villa"
  },
];
