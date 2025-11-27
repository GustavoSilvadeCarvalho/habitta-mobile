export interface Property {
    id: string;
    image_url: string;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    address: string;
    description: string;
    type: string;
    transactionType?: string;
}
