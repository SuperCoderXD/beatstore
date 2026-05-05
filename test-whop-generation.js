// Test script to demonstrate Whop product generation
const { testWhopProductGeneration } = require('./lib/whop-product-generator.ts');

// Run the test
const results = testWhopProductGeneration();

console.log('=== BASIC LICENSE ===');
console.log('Title:', results.basic.title);
console.log('Headline:', results.basic.headline);
console.log('Description:');
console.log(results.basic.description);
console.log('\n' + '='.repeat(50) + '\n');

console.log('=== PREMIUM LICENSE ===');
console.log('Title:', results.premium.title);
console.log('Headline:', results.premium.headline);
console.log('Description:');
console.log(results.premium.description);
console.log('\n' + '='.repeat(50) + '\n');

console.log('=== UNLIMITED LICENSE ===');
console.log('Title:', results.unlimited.title);
console.log('Headline:', results.unlimited.headline);
console.log('Description:');
console.log(results.unlimited.description);
