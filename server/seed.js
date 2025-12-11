import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const initialProducts = [
  {
    id: '1',
    name: 'Cordless Drill X200',
    category: 'power-tools',
    sku: 'PT-001',
    price: 149.99 * 3.75,
    description: 'Professional-grade cordless drill with variable speed control and ergonomic design for extended use.',
    specs: ['18V Lithium-ion', '2Ah Battery', 'Variable Speed 0-1500 RPM', '13mm Chuck', 'LED Work Light'],
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
    featured: true,
  },
  {
    id: '2',
    name: 'Angle Grinder 7 inch',
    category: 'construction-tools',
    sku: 'CT-010',
    price: 89.99 * 3.75,
    description: 'Heavy-duty angle grinder perfect for cutting, grinding, and polishing metal surfaces.',
    specs: ['750W Motor', '7 inch Abrasive Disc', '8000 RPM', 'Side Handle', 'Spindle Lock'],
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop',
    featured: true,
  },
  {
    id: '3',
    name: 'Industrial Welding Machine 250A',
    category: 'welding-equipment',
    sku: 'WELD-05',
    price: 599.99 * 3.75,
    description: 'Professional MIG/MAG welding machine suitable for industrial and workshop applications.',
    specs: ['250A Output', 'MIG/MAG/MMA', 'Digital Display', 'Thermal Protection', '60% Duty Cycle'],
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
    featured: true,
  },
  {
    id: '4',
    name: 'Professional Impact Wrench',
    category: 'power-tools',
    sku: 'PT-015',
    price: 199.99 * 3.75,
    description: 'High-torque impact wrench for automotive and industrial fastening applications.',
    specs: ['1000 Nm Torque', '1/2" Drive', 'Brushless Motor', '20V Battery', '3 Speed Settings'],
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop',
    featured: true,
  },
  {
    id: '5',
    name: 'Circular Saw Pro 185mm',
    category: 'construction-tools',
    sku: 'CT-020',
    price: 129.99 * 3.75,
    description: 'Powerful circular saw with precision cutting guide and dust extraction port.',
    specs: ['1400W Motor', '185mm Blade', '5500 RPM', 'Laser Guide', 'Dust Port'],
    image: 'https://images.unsplash.com/photo-1616712134411-6b6ae89bc3ba?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    name: 'Gate Valve 2 inch Brass',
    category: 'valves-fittings',
    sku: 'VF-001',
    price: 45.99 * 3.75,
    description: 'High-quality brass gate valve for water and gas applications.',
    specs: ['2" BSP Thread', 'Brass Body', '200 PSI Rating', 'Non-Rising Stem', 'Lead-Free'],
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
  },
  {
    id: '7',
    name: 'Industrial Air Hose 50ft',
    category: 'air-water-hoses',
    sku: 'AH-010',
    price: 79.99 * 3.75,
    description: 'Heavy-duty rubber air hose with brass fittings for pneumatic tools.',
    specs: ['50ft Length', '3/8" ID', '300 PSI', 'Brass Fittings', 'Oil Resistant'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: '8',
    name: 'Multi-Purpose Lubricant Spray',
    category: 'lubricants-chemicals',
    sku: 'LC-005',
    price: 12.99 * 3.75,
    description: 'Versatile lubricant spray for machinery, hinges, and metal parts.',
    specs: ['400ml Can', 'Anti-Corrosion', 'Water Displacement', 'Safe for Metal', 'Precision Nozzle'],
    image: 'https://images.unsplash.com/photo-1635070040495-06b5d0213dda?w=400&h=400&fit=crop',
  },
  {
    id: '9',
    name: 'Professional Paint Sprayer',
    category: 'painting-accessories',
    sku: 'PA-008',
    price: 249.99 * 3.75,
    description: 'HVLP paint sprayer for professional finish on various surfaces.',
    specs: ['650W Motor', '1000ml Cup', 'Adjustable Pattern', '3 Nozzle Sizes', 'Easy Clean'],
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop',
    featured: true,
  },
  {
    id: '10',
    name: 'Heavy Duty Padlock 60mm',
    category: 'locks-hardware',
    sku: 'LH-003',
    price: 34.99 * 3.75,
    description: 'Weatherproof padlock with hardened steel shackle for outdoor use.',
    specs: ['60mm Body', 'Hardened Shackle', 'Weatherproof', 'Anti-Pick', '3 Keys Included'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: '11',
    name: 'Garden Pruning Shears',
    category: 'gardening-tools',
    sku: 'GT-012',
    price: 29.99 * 3.75,
    description: 'Professional pruning shears with ergonomic grip and razor-sharp blades.',
    specs: ['SK5 Steel Blade', '8" Length', 'Ergonomic Handle', 'Safety Lock', 'Rust Resistant'],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
  },
  {
    id: '12',
    name: 'Industrial Pressure Washer',
    category: 'cleaning-appliances',
    sku: 'CA-007',
    price: 449.99 * 3.75,
    description: 'High-pressure washer for commercial and industrial cleaning applications.',
    specs: ['2500 PSI', '5.5 GPM', 'Electric Motor', '25ft Hose', '5 Nozzles'],
    image: 'https://images.unsplash.com/photo-1558618047-f4b511aeb6a8?w=400&h=400&fit=crop',
    featured: true,
  },
  {
    id: '13',
    name: 'Stainless Steel Ball Valve 1"',
    category: 'sanitary-plumbing',
    sku: 'SP-004',
    price: 28.99 * 3.75,
    description: 'Full port ball valve in stainless steel for clean water applications.',
    specs: ['1" NPT Thread', '316 Stainless Steel', 'Full Port', '1000 PSI', 'PTFE Seal'],
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
  },
  {
    id: '14',
    name: 'Welding Helmet Auto-Darkening',
    category: 'welding-equipment',
    sku: 'WELD-012',
    price: 89.99 * 3.75,
    description: 'Auto-darkening welding helmet with large viewing area and adjustable sensitivity.',
    specs: ['Large View 100x93mm', 'DIN 4/9-13', 'Solar Powered', 'Grind Mode', 'Adjustable Headband'],
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
  },
  {
    id: '15',
    name: 'Concrete Mixer 120L',
    category: 'construction-tools',
    sku: 'CT-025',
    price: 389.99 * 3.75,
    description: 'Portable concrete mixer ideal for small to medium construction projects.',
    specs: ['120L Drum', '550W Motor', 'Cast Iron Gears', 'Tilting Drum', 'Wheels Included'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
  },
  {
    id: '16',
    name: 'Hydraulic Floor Jack 3 Ton',
    category: 'construction-tools',
    sku: 'CT-030',
    price: 159.99 * 3.75,
    description: 'Professional hydraulic floor jack for automotive and industrial lifting.',
    specs: ['3 Ton Capacity', 'Low Profile', 'Quick Lift', 'Safety Valve', 'Swivel Casters'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: '17',
    name: 'Electric Heat Gun',
    category: 'power-tools',
    sku: 'PT-022',
    price: 49.99 * 3.75,
    description: 'Variable temperature heat gun for paint stripping and shrink wrapping.',
    specs: ['2000W', '50-600°C Range', '2 Speed Settings', 'Overload Protection', '4 Nozzles'],
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
  },
  {
    id: '18',
    name: 'PVC Water Hose 100ft',
    category: 'air-water-hoses',
    sku: 'AH-015',
    price: 54.99 * 3.75,
    description: 'Flexible PVC garden and industrial water hose with UV resistance.',
    specs: ['100ft Length', '3/4" ID', '150 PSI', 'UV Resistant', 'Kink Resistant'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: '19',
    name: 'Industrial Degreaser 5L',
    category: 'lubricants-chemicals',
    sku: 'LC-010',
    price: 34.99 * 3.75,
    description: 'Heavy-duty degreaser for machinery and workshop floors.',
    specs: ['5L Container', 'Biodegradable', 'Non-Corrosive', 'Concentrated', 'Safe for Metal'],
    image: 'https://images.unsplash.com/photo-1635070040495-06b5d0213dda?w=400&h=400&fit=crop',
  },
  {
    id: '20',
    name: 'Roller Paint Set Pro',
    category: 'painting-accessories',
    sku: 'PA-015',
    price: 39.99 * 3.75,
    description: 'Professional paint roller set with extension pole and multiple sleeves.',
    specs: ['9" Roller Frame', '4ft Extension', '3 Sleeves', 'Paint Tray', 'Microfiber Cover'],
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop',
  },
];

const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grayship';
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Insert initial products
    await Product.insertMany(initialProducts);
    console.log(`✅ Seeded ${initialProducts.length} products`);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

