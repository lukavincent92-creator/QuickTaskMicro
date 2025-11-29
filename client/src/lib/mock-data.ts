
export const MOCK_USERS = {
  worker: {
    id: "u1",
    name: "Alex Chen",
    role: "worker",
    avatar: "/attached_assets/generated_images/young_smiling_user_avatar_1.png",
    earnings: 1250,
    rating: 4.8,
    completedMissions: 12
  },
  client: {
    id: "c1",
    name: "Sarah Miller",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100",
    postedMissions: 5
  }
};

export const MOCK_MISSIONS = [
  {
    id: "m1",
    title: "Walk my Golden Retriever",
    description: "Need someone to walk Bailey for 45 mins in Central Park. She is very friendly!",
    price: 15,
    location: "Central Park, NY",
    distance: "0.8km",
    category: "Pets",
    status: "open",
    duration: "45 mins",
    client: {
      name: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: "m2",
    title: "Help move a couch",
    description: "Need a strong pair of hands to help me move a couch down 2 flights of stairs.",
    price: 30,
    location: "Brooklyn, NY",
    distance: "2.1km",
    category: "Moving",
    status: "open",
    duration: "1 hour",
    client: {
      name: "Mike R.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: "m3",
    title: "Instagram Video Editor needed",
    description: "I have raw footage, need a cool 30s Reel edit with captions. Remote work ok!",
    price: 50,
    location: "Remote",
    distance: "Online",
    category: "Digital",
    status: "open",
    duration: "2 hours",
    client: {
      name: "Fashion Boutique",
      avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: "m4",
    title: "Assemble IKEA Desk",
    description: "Just bought a Malm desk. Need help assembling it today.",
    price: 40,
    location: "Queens, NY",
    distance: "5.2km",
    category: "Handyman",
    status: "completed",
    duration: "1.5 hours",
    client: {
      name: "David L.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: "m5",
    title: "Garden Cleanup",
    description: "Raking leaves and bagging them. Bags provided.",
    price: 25,
    location: "Staten Island, NY",
    distance: "8km",
    category: "Garden",
    status: "open",
    duration: "2 hours",
    client: {
      name: "Lisa P.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100"
    }
  }
];

export const CATEGORIES = [
  { id: "all", label: "All", icon: "LayoutGrid" },
  { id: "pets", label: "Pets", icon: "Dog" },
  { id: "moving", label: "Moving", icon: "Truck" },
  { id: "digital", label: "Digital", icon: "Laptop" },
  { id: "garden", label: "Garden", icon: "Sprout" },
  { id: "cleaning", label: "Cleaning", icon: "Sparkles" },
];
