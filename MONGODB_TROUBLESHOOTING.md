# MongoDB SSL/TLS Fix Guide

## The Issue
Your MongoDB connection is failing with SSL/TLS errors:
```
MongoServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

## Common Causes & Solutions

### 1. **Wrong Connection String Format**
Your URI should be:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beatstore?retryWrites=true&w=majority&tls=true
```

### 2. **Network Access in MongoDB Atlas**
1. Go to MongoDB Atlas → Your Cluster → Network Access
2. Add IP: `0.0.0.0/0` (allows all access)
3. Or add your specific IP address

### 3. **Database User Permissions**
1. Go to Database Access → Your User
2. Ensure user has read/write permissions on `beatstore` database
3. Password is correct (no special characters that need encoding)

### 4. **Cluster Status**
1. Check if cluster is running (green status)
2. Wait a few minutes after creating cluster

### 5. **TLS Version Issue**
If still failing, try this alternative format:
```
MONGODB_URI=mongodb://username:password@cluster.mongodb.net/beatstore?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin
```

## Quick Test
Test your connection string locally:
```bash
node -e "
const { MongoClient } = require('mongodb');
const uri = 'your-connection-string-here';
new MongoClient(uri).connect().then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e));
"
```

## Next Steps
1. Update your MONGODB_URI in Vercel environment variables
2. Redeploy
3. Test beat creation
