import { GallerySection } from '../types';

const galleryData: GallerySection[] = [
  {
    id: 'fade-in',
    title: 'Beauty Essentials',
    description: 'Capturing the essence of skincare and beauty products in their purest form.',
    effect: 'fade-in',
    items: [
      {
        id: 'fade-in-1',
        title: 'Morning Ritual',
        description: 'Essential skincare for your daily routine',
        imageUrl: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Beauty'
      },
      {
        id: 'fade-in-2',
        title: 'Essence Collection',
        description: 'Premium serums for radiant skin',
        imageUrl: 'https://images.pexels.com/photos/5069609/pexels-photo-5069609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Beauty'
      },
      {
        id: 'fade-in-3',
        title: 'Natural Glow',
        description: 'Clean beauty products for everyday use',
        imageUrl: 'https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Beauty'
      },
      {
        id: 'fade-in-4',
        title: 'Hydration Series',
        description: 'Deep moisturizing collection',
        imageUrl: 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Beauty'
      }
    ]
  },
  {
    id: 'slide-up',
    title: 'Fashion Statements',
    description: 'Bold expressions through contemporary fashion photography.',
    effect: 'slide-up',
    items: [
      {
        id: 'slide-up-1',
        title: 'Urban Sophistication',
        description: 'Contemporary street style with an edge',
        imageUrl: 'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Fashion'
      },
      {
        id: 'slide-up-2',
        title: 'Minimalist Appeal',
        description: 'Clean lines and structured silhouettes',
        imageUrl: 'https://images.pexels.com/photos/2468339/pexels-photo-2468339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Fashion'
      },
      {
        id: 'slide-up-3',
        title: 'Material Texture',
        description: 'Exploring fabric and form',
        imageUrl: 'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Fashion'
      },
      {
        id: 'slide-up-4',
        title: 'Color Theory',
        description: 'Vibrant expressions through fashion',
        imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Fashion'
      }
    ]
  },
  {
    id: 'scale-in',
    title: 'Architectural Visions',
    description: 'Exploring the intersection of space, light, and design.',
    effect: 'scale-in',
    items: [
      {
        id: 'scale-in-1',
        title: 'Geometric Patterns',
        description: 'Finding order in architectural design',
        imageUrl: 'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Architecture'
      },
      {
        id: 'scale-in-2',
        title: 'Urban Perspectives',
        description: 'City landscapes and modern structures',
        imageUrl: 'https://images.pexels.com/photos/830891/pexels-photo-830891.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Architecture'
      },
      {
        id: 'scale-in-3',
        title: 'Minimalist Spaces',
        description: 'Simplicity in architectural form',
        imageUrl: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Architecture'
      },
      {
        id: 'scale-in-4',
        title: 'Light & Shadow',
        description: 'The interplay of natural light in design',
        imageUrl: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Architecture'
      }
    ]
  },
  {
    id: 'rotate-in',
    title: 'Product Design',
    description: 'Elevating everyday objects through thoughtful design and presentation.',
    effect: 'rotate-in',
    items: [
      {
        id: 'rotate-in-1',
        title: 'Minimalist Packaging',
        description: 'Clean design for consumer products',
        imageUrl: 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Product'
      },
      {
        id: 'rotate-in-2',
        title: 'Functional Aesthetics',
        description: 'Where form meets function',
        imageUrl: 'https://images.pexels.com/photos/6370739/pexels-photo-6370739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Product'
      },
      {
        id: 'rotate-in-3',
        title: 'Material Exploration',
        description: 'Innovative use of textures and materials',
        imageUrl: 'https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Product'
      },
      {
        id: 'rotate-in-4',
        title: 'Color & Composition',
        description: 'Strategic use of color in product design',
        imageUrl: 'https://images.pexels.com/photos/5947021/pexels-photo-5947021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Product'
      }
    ]
  },
  {
    id: 'blur-in',
    title: 'Interior Spaces',
    description: 'Curated environments that blend functionality with aesthetic vision.',
    effect: 'blur-in',
    items: [
      {
        id: 'blur-in-1',
        title: 'Modern Living',
        description: 'Contemporary home interiors',
        imageUrl: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Interior'
      },
      {
        id: 'blur-in-2',
        title: 'Workspace Design',
        description: 'Productive and inspiring office environments',
        imageUrl: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Interior'
      },
      {
        id: 'blur-in-3',
        title: 'Minimalist Aesthetics',
        description: 'Clean lines and intentional spaces',
        imageUrl: 'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Interior'
      },
      {
        id: 'blur-in-4',
        title: 'Natural Elements',
        description: 'Bringing the outdoors into interior design',
        imageUrl: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Interior'
      }
    ]
  },
  {
    id: 'flip-in',
    title: 'Brand Identity',
    description: 'Visual systems that communicate the essence of innovative brands.',
    effect: 'flip-in',
    items: [
      {
        id: 'flip-in-1',
        title: 'Logo Development',
        description: 'Creating memorable brand marks',
        imageUrl: 'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Branding'
      },
      {
        id: 'flip-in-2',
        title: 'Brand Guidelines',
        description: 'Comprehensive visual identity systems',
        imageUrl: 'https://images.pexels.com/photos/5699519/pexels-photo-5699519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Branding'
      },
      {
        id: 'flip-in-3',
        title: 'Packaging Design',
        description: 'Brand expression through product packaging',
        imageUrl: 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Branding'
      },
      {
        id: 'flip-in-4',
        title: 'Visual Systems',
        description: 'Cohesive brand applications across touchpoints',
        imageUrl: 'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Branding'
      }
    ]
  },
  {
    id: 'stagger-in',
    title: 'Editorial Design',
    description: 'Print and digital publications that blend typography, imagery, and layout.',
    effect: 'stagger-in',
    items: [
      {
        id: 'stagger-in-1',
        title: 'Magazine Layouts',
        description: 'Compelling editorial spreads',
        imageUrl: 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Editorial'
      },
      {
        id: 'stagger-in-2',
        title: 'Typography Systems',
        description: 'Hierarchical text layouts for readability',
        imageUrl: 'https://images.pexels.com/photos/6375/quote-chalk-think-words.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Editorial'
      },
      {
        id: 'stagger-in-3',
        title: 'Annual Reports',
        description: 'Data visualization and information design',
        imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Editorial'
      },
      {
        id: 'stagger-in-4',
        title: 'Digital Publications',
        description: 'Interactive reading experiences',
        imageUrl: 'https://images.pexels.com/photos/326501/pexels-photo-326501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Editorial'
      }
    ]
  },
  {
    id: 'slide-in-left',
    title: 'Campaign Photography',
    description: 'Narrative-driven imagery for advertising and promotional campaigns.',
    effect: 'slide-in-left',
    items: [
      {
        id: 'slide-in-left-1',
        title: 'Lifestyle Campaigns',
        description: 'Aspirational imagery for brand storytelling',
        imageUrl: 'https://images.pexels.com/photos/1158670/pexels-photo-1158670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Campaign'
      },
      {
        id: 'slide-in-left-2',
        title: 'Product Launches',
        description: 'Visual narratives for new offerings',
        imageUrl: 'https://images.pexels.com/photos/6446709/pexels-photo-6446709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Campaign'
      },
      {
        id: 'slide-in-left-3',
        title: 'Brand Storytelling',
        description: 'Visual narratives that communicate values',
        imageUrl: 'https://images.pexels.com/photos/3757055/pexels-photo-3757055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Campaign'
      },
      {
        id: 'slide-in-left-4',
        title: 'Seasonal Collections',
        description: 'Thematic campaign series',
        imageUrl: 'https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Campaign'
      }
    ]
  },
  {
    id: 'slide-in-right',
    title: 'Digital Experiences',
    description: 'Interactive interfaces and digital products that prioritize user experience.',
    effect: 'slide-in-right',
    items: [
      {
        id: 'slide-in-right-1',
        title: 'Website Design',
        description: 'Responsive digital experiences',
        imageUrl: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Digital'
      },
      {
        id: 'slide-in-right-2',
        title: 'Mobile Applications',
        description: 'User-centric app interfaces',
        imageUrl: 'https://images.pexels.com/photos/3082341/pexels-photo-3082341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Digital'
      },
      {
        id: 'slide-in-right-3',
        title: 'E-commerce Solutions',
        description: 'Conversion-optimized shopping experiences',
        imageUrl: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Digital'
      },
      {
        id: 'slide-in-right-4',
        title: 'Interactive Platforms',
        description: 'Engaging digital environments',
        imageUrl: 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Digital'
      }
    ]
  },
  {
    id: 'zoom-in',
    title: 'Abstract Art',
    description: 'Exploring form, color, and composition through artistic expression.',
    effect: 'zoom-in',
    items: [
      {
        id: 'zoom-in-1',
        title: 'Color Studies',
        description: 'Explorations in color theory and perception',
        imageUrl: 'https://images.pexels.com/photos/1568607/pexels-photo-1568607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Art'
      },
      {
        id: 'zoom-in-2',
        title: 'Textural Compositions',
        description: 'Mixed media explorations',
        imageUrl: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Art'
      },
      {
        id: 'zoom-in-3',
        title: 'Geometric Abstractions',
        description: 'Pattern and form studies',
        imageUrl: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Art'
      },
      {
        id: 'zoom-in-4',
        title: 'Minimalist Expressions',
        description: 'Restraint in compositional form',
        imageUrl: 'https://images.pexels.com/photos/3307862/pexels-photo-3307862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Art'
      }
    ]
  },
  {
    id: 'bounce-in',
    title: 'Motion Design',
    description: 'Dynamic visual communication through animation and moving image.',
    effect: 'bounce-in',
    items: [
      {
        id: 'bounce-in-1',
        title: 'Brand Animations',
        description: 'Kinetic identity systems',
        imageUrl: 'https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Motion'
      },
      {
        id: 'bounce-in-2',
        title: 'UI Animations',
        description: 'Enhancing digital experiences through motion',
        imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Motion'
      },
      {
        id: 'bounce-in-3',
        title: 'Explainer Videos',
        description: 'Visual storytelling for complex topics',
        imageUrl: 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Motion'
      },
      {
        id: 'bounce-in-4',
        title: 'Experimental Motion',
        description: 'Pushing the boundaries of animation',
        imageUrl: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Motion'
      }
    ]
  },
  {
    id: 'perspective-in',
    title: 'Installation Art',
    description: 'Immersive spatial experiences that blend art and environment.',
    effect: 'perspective-in',
    items: [
      {
        id: 'perspective-in-1',
        title: 'Spatial Interventions',
        description: 'Site-specific artistic installations',
        imageUrl: 'https://images.pexels.com/photos/1647972/pexels-photo-1647972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Installation'
      },
      {
        id: 'perspective-in-2',
        title: 'Light Installations',
        description: 'Manipulating perception through light',
        imageUrl: 'https://images.pexels.com/photos/1480690/pexels-photo-1480690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Installation'
      },
      {
        id: 'perspective-in-3',
        title: 'Interactive Environments',
        description: 'Participatory artistic experiences',
        imageUrl: 'https://images.pexels.com/photos/3352371/pexels-photo-3352371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Installation'
      },
      {
        id: 'perspective-in-4',
        title: 'Temporary Structures',
        description: 'Ephemeral architectural interventions',
        imageUrl: 'https://images.pexels.com/photos/2119706/pexels-photo-2119706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Installation'
      }
    ]
  }
];

export default galleryData;