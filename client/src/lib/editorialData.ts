export interface ServiceItem {
  id: string;
  category: 'HAIRCARE' | 'TREATMENTS' | 'SKIN & FACE' | 'COMBOS';
  title: string;
  price: string;
  duration: string;
  image: string;
  description?: string;
  backendServiceId?: string;
}

export const EDITORIAL_SERVICES: ServiceItem[] = [
  {
    id: 'haircut',
    category: 'HAIRCARE',
    title: 'Haircut and Styling',
    price: '₹250 – ₹850',
    duration: '30 – 60 mins',
    image: '/editorial/editorial_13.jpeg',
    description: 'Bespoke unisex haircut, personalized texturizing, blowout, and botanical finish tailored to your face structure.',
    backendServiceId: 'a75735f6-aba1-443d-8696-660502f7ba17',
  },
  {
    id: 'color',
    category: 'HAIRCARE',
    title: 'Color and Highlights',
    price: 'Starts at ₹1,299',
    duration: '60 – 180 mins',
    image: '/editorial/editorial_14.jpeg',
    description: 'Ammonia-free global color, balayage, root touchups, and multidimensional tone infusions with deep gloss sealing.',
    backendServiceId: '1a1a85c9-e59f-423b-9e96-e0897ad1b739',
  },
  {
    id: 'straightening',
    category: 'HAIRCARE',
    title: 'Perm and Straightening',
    price: 'Starts at ₹5,499',
    duration: '3 – 4 hrs',
    image: '/editorial/editorial_15.jpeg',
    description: 'Silken straightening, permanent smoothing, and textured beach-wave perms using international protective systems.',
    backendServiceId: 'dd8fa011-b8ac-426e-88c6-26c6ce2377cd',
  },
  {
    id: 'spa',
    category: 'TREATMENTS',
    title: 'Hair Spa',
    price: 'Starts at ₹1,199',
    duration: '45 – 60 mins',
    image: '/editorial/editorial_16.jpeg',
    description: 'Deep scalp detoxification, stimulating acupressure massage, and intensive organic moisture steam therapy.',
    backendServiceId: 'a32cad2f-8f97-4e1f-8e9c-6e9ad7cf1323',
  },
  {
    id: 'keratin',
    category: 'TREATMENTS',
    title: 'Keratin Treatment',
    price: 'Starts at ₹4,499',
    duration: '2.5 – 3.5 hrs',
    image: '/editorial/editorial_17.jpeg',
    description: 'Formaldehyde-free bio-keratin infusion that eliminates frizz, restores protein density, and seals mirror-like shine.',
    backendServiceId: 'dd8fa011-b8ac-426e-88c6-26c6ce2377cd',
  },
  {
    id: 'conditioning',
    category: 'TREATMENTS',
    title: 'Deep Conditioning',
    price: 'Starts at ₹1,799',
    duration: '60 mins',
    image: '/editorial/editorial_18.jpeg',
    description: 'Targeted moisture replenishment and lipid repair treatment formulated specifically for dry or chemically processed locks.',
    backendServiceId: 'a32cad2f-8f97-4e1f-8e9c-6e9ad7cf1323',
  },
  {
    id: 'hydra-facial',
    category: 'SKIN & FACE',
    title: 'Signature 7-Step Hydra Facial',
    price: 'Starts at ₹3,499',
    duration: '60 mins',
    image: '/editorial/editorial_19.jpeg',
    description: 'Non-invasive vortex deep pore extraction, antioxidant infusion, gentle exfoliation, and intense hyaluronic hydration.',
    backendServiceId: '9b87dd46-fc22-49c3-b4c6-9d928b1f7fd0',
  },
  {
    id: 'korean-glass',
    category: 'SKIN & FACE',
    title: 'Korean Glass-Skin Hydra + LED',
    price: 'Starts at ₹4,999',
    duration: '75 mins',
    image: '/editorial/editorial_20.jpeg',
    description: 'Ultrasonic deep infusion, calming peptide sheet therapy, and medical-grade photodynamic LED light for translucent glow.',
    backendServiceId: '8e28d2ff-85f4-4911-9210-fc3a7c920708',
  },
  {
    id: 'detan-cleanup',
    category: 'SKIN & FACE',
    title: 'Express De-Tan & Fruit Cleanup',
    price: '₹550 – ₹799',
    duration: '30 – 40 mins',
    image: '/editorial/editorial_21.jpeg',
    description: 'Rapid botanical de-tan exfoliation, steam, gentle blackhead clearing, and revitalizing fresh fruit masque.',
    backendServiceId: '5413136a-cba7-4416-8dbb-eeb9e9ea2958',
  },
  {
    id: 'exec-grooming',
    category: 'COMBOS',
    title: "Men's Executive Grooming",
    price: 'Combo ₹749 (Save ₹231)',
    duration: '60 mins',
    image: '/editorial/editorial_22.jpeg',
    description: 'Precision haircut, beard contouring with hot towel compress, executive head massage, and botanical face pack.',
    backendServiceId: 'a75735f6-aba1-443d-8696-660502f7ba17',
  },
  {
    id: 'ladies-revival',
    category: 'COMBOS',
    title: 'Ladies Signature Revival',
    price: 'Combo ₹1,799 (Save ₹570)',
    duration: '90 mins',
    image: '/editorial/editorial_23.jpeg',
    description: 'Style cut, blow dry, intensive herbal hair spa ritual, and brightening organic cleanup in one relaxed session.',
    backendServiceId: '69e77e8d-9118-43a5-a1ae-343bd0750cd6',
  },
  {
    id: 'pre-bridal',
    category: 'COMBOS',
    title: 'Pre-Bridal / Groom Complete Glow',
    price: 'Combo ₹6,999 (Save ₹1,699)',
    duration: '3.5 hrs',
    image: '/editorial/editorial_24.jpeg',
    description: 'Comprehensive luxury ritual: Hydra facial, complete body polishing, spa manicure & pedicure, and hair revival treatment.',
    backendServiceId: '50371ed0-ee68-47d2-8d91-c77054f91371',
  },
];

export const EDITORIAL_TEAM = [
  {
    name: 'Hasna K.',
    role: 'Founder & Creative Lead',
    image: '/editorial/editorial_4.jpeg',
  },
  {
    name: 'Ardra M.',
    role: 'Salon Manager',
    image: '/editorial/editorial_5.jpeg',
  },
  {
    name: 'Anfas R.',
    role: 'Senior Hair Stylist',
    image: '/editorial/editorial_6.jpeg',
  },
  {
    name: 'Sreekutty V.',
    role: 'Senior Texture Specialist',
    image: '/editorial/editorial_7.jpeg',
  },
];

export const EDITORIAL_TESTIMONIALS = [
  {
    quote:
      'The keratin treatment completely transformed my frizz without weighing down my curls. Calm studio, zero rush, and genuine care from start to finish.',
    author: 'Kian Graham',
    image: '/editorial/editorial_8.jpeg',
  },
  {
    quote:
      'Booked the Signature 7-Step Hydra Facial and a layer cut before a wedding. My skin felt luminous for days and the styling held effortlessly.',
    author: 'Celine Guajardo',
    image: '/editorial/editorial_9.jpeg',
  },
  {
    quote:
      'Best executive grooming and scalp spa in town. Consistent precision every visit and the botanical oils leave hair noticeably healthier.',
    author: 'Harlow Martin',
    image: '/editorial/editorial_10.jpeg',
  },
];
