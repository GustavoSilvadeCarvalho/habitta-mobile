import { Property } from "../../components/common/PropertyCard";

export const MOCKED_PROPERTIES: Property[] = [
  {
    id: "1",
    image_url:
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
    image_url:"https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
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
    image_url:
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
  {
    id: "4",
    title: "Casa Contemporânea com Piscina",
    description: "Residência moderna com arquitetura clean, amplos ambientes integrados e área de lazer completa.",
    price: "950.00",
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    address: "Alphaville, Barueri, SP",
    type: "Casa",
    image_url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    latitude: null,
    longitude: null,
    created_at: "2025-09-18T19:09:00.292Z",
    updated_at: "2025-11-06T11:30:53.173Z"
  },
  {
    id: "5",
    title: "Studio Mobiliado no Centro",
    description: "Apartamento completo e mobiliado, perfeito para quem busca praticidade e localização central perto do metrô.",
    price: "450.00",
    bedrooms: 1,
    bathrooms: 1,
    garages: 1,
    address: "Rua Augusta 500, Consolação, SP",
    type: "Apartamento",
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    latitude: null,
    longitude: null,
    created_at: "2025-09-18T19:09:00.292Z",
    updated_at: "2025-11-06T11:30:53.173Z"
  },
  {
    id: "6",
    title: "Sobrado Familiar com Quintal",
    description: "Sobrado espaçoso ideal para famílias, com quintal amplo, área de serviço e garagem para 2 carros.",
    price: "780.00",
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    address: "Rua das Flores 123, Mooca, SP",
    type: "Casa de campo",
    image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    latitude: null,
    longitude: null,
    created_at: "2025-09-18T19:09:00.292Z",
    updated_at: "2025-11-06T11:30:53.173Z"
  },
  {
    id: "7",
    title: "Casa com Piscina e Churrasqueira",
    description: "Ampla casa familiar com quintal espaçoso, piscina aquecida e área gourmet completa.",
    price: "1500.00",
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    address: "Rua das Flores, 321 - Moema, São Paulo - SP",
    type: "Casa",
    image_url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    latitude: null,
    longitude: null,
    created_at: "2025-09-18T19:09:00.292Z",
    updated_at: "2025-11-06T11:30:53.173Z"
  },
  {
  id: "8",
  title: "Sítio com Lago Particular",
  description: "Propriedade rural com casa principal, lago para pesca e área de plantio. Paz e tranquilidade garantidas.",
  price: "890.00",
  bedrooms: 3,
  bathrooms: 2,
  garages: 2,
  address: "Rodovia dos Bandeirantes KM 45, Itu - SP",
  type: "Casa de Campo",
  image_url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  latitude: null,
  longitude: null,
  created_at: "2025-09-18T19:09:00.292Z",
  updated_at: "2025-11-06T11:30:53.173Z"
  },
  {
  id: "9",
  title: "Sobrado",
  description: "Propriedade com infraestrutura completa para eventos.",
  price: "2200.00",
  bedrooms: 5,
  bathrooms: 4,
  garages: 4,
  address: "Estrada do Vinho 888, Bento Gonçalves - RS",
  type: "Casa de Campo",
  image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  latitude: null,
  longitude: null,
  created_at: "2025-09-18T19:09:00.292Z",
  updated_at: "2025-11-06T11:30:53.173Z"
  }
];
