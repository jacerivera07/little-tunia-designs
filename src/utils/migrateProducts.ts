import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { products } from '../data';

export const migrateProductsToFirestore = async () => {
  try {
    console.log('Starting product migration...');
    
    for (const product of products) {
      // Remove the id field since Firestore will generate it
      const { id, ...productData } = product;
      
      await addDoc(collection(db, 'products'), productData);
      console.log(`Migrated: ${product.title}`);
    }
    
    console.log('Migration complete! All products have been added to Firestore.');
    alert('Success! All 7 products have been migrated to Firestore.');
  } catch (error) {
    console.error('Migration error:', error);
    alert('Failed to migrate products. Check console for details.');
  }
};
