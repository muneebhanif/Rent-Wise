import { FaBuilding, FaCar, FaHotel } from "react-icons/fa"

export const staticListings = [
  {
    _id: "1",
    title: "Luxury Penthouse",
    category: "House",
    price: 2500,
    averageRating: 4.9,
    images: [{ url: "/placeholder.svg?height=256&width=384" }],
  },
  {
    _id: "2",
    title: "Sports Car Rental",
    category: "Cars",
    price: 200,
    averageRating: 4.8,
    images: [{ url: "/placeholder.svg?height=256&width=384" }],
  },
  {
    _id: "3",
    title: "Beachfront Villa",
    category: "House",
    price: 3000,
    averageRating: 4.7,
    images: [{ url: "/placeholder.svg?height=256&width=384" }],
  },
  {
    _id: "4",
    title: "Boutique Hostel",
    category: "Hostels",
    price: 80,
    averageRating: 4.5,
    images: [{ url: "/placeholder.svg?height=256&width=384" }],
  },
  {
    _id: "5",
    title: "Electric Car Rental",
    category: "Cars",
    price: 150,
    averageRating: 4.6,
    images: [{ url: "/placeholder.svg?height=256&width=384" }],
  },
  {
    _id: "6",
    title: "Mountain Chalet",
    category: "House",
    price: 1800,
    averageRating: 4.8,
    images: [{ url: "/placeholder.svg?height=256&width=384" }],
  },
]

export const categories = [
  { name: "Houses", icon: FaBuilding, description: "Find your dream vacation home" },
  { name: "Cars", icon: FaCar, description: "Rent the perfect ride for your journey" },
  { name: "Hostels", icon: FaHotel, description: "Discover comfortable and affordable stays" },
]

