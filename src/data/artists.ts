export interface Painting {
  id: number;
  title: string;
  image: string;
  size: string;
  price: string;
  medium: string;
  year?: number;  // Made optional with '?'
  description: string;
}

export interface Artist {
  id: number;
  name: string;
  image: string;
  bio: string;
  slug: string;
  paintings: Painting[];
}

export const artistsData: Record<string, Artist> = {
  'wagih-yassa': {
    id: 1,
    name: 'Wagih Yassa',
    image: '/images/wagihhhh.jpeg',
    bio: 'Wagih Yassa is a contemporary artist based in Cairo, Egypt.',
    slug: 'wagih-yassa',
    paintings: [
      { 
        id: 1, 
        title: 'paint', 
        image: '/images/wagih 1.jpeg',
        size: '100 x 70 cm',
        price: 'EGP 135,000',
        medium: 'Acrylic on canvas',
        description: ''
      },
      { 
        id: 2, 
        title: 'paint', 
        image: '/images/wagih2.jpeg',
        size: '50 x 60 cm',
        price: 'EGP 45,000',
        medium: 'Acrylic paint',
        description: ''
      },
      {
        id: 3,
        title: 'paint',
        image: '/images/wagih3.jpeg',
        size: '40 x 60 cm',
        price: 'EGP 30,000',
        medium: 'Acrylic paint',
        description: ''
      },
      {
        id: 4,
        title: 'paint',
        image: '/images/wagih4.jpeg',
        size: '70 x 90 cm',
        price: 'EGP 85,000',
        medium: 'Oil paint',
        description: ''
      }
    ]
  },
  'vincent-van-gogh': {
    id: 2,
    name: 'Vincent van Gogh',
    image: '/images/van-gogh-profile.jpg',
    bio: 'Dutch Post-Impressionist painter who is among the most famous and influential figures in the history of Western art.',
    slug: 'vincent-van-gogh',
    paintings: [
      {
        id: 3,
        title: 'Starry Night',
        image: '/images/starry-night.jpg',
        size: '73.7 x 92.1 cm',
        price: 'Not for sale',
        medium: 'Oil on canvas',
        description: 'One of the most recognized paintings in the history of Western culture.'
      }
    ]
  }
};

export const artistsList = Object.values(artistsData).map(artist => ({
  id: artist.id,
  name: artist.name,
  image: artist.image,
  description: artist.bio,
  slug: artist.slug
}));
