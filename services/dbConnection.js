const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@images-procesor.xvipxuu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

exports.TestConnection = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.CreateDocument = async (collection, newDocument) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection(collection).insertOne(newDocument);
        console.log(`New listing created with the following id: ${result.insertedId}`);
        return result;

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.FindOneCollectionByID = async (collection, idDocument) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection(collection).findOne({ _id: idDocument });

        if (result) {
            console.log(`Found a listing in the collection with the id '${idDocument}':`);
            console.log(result);
        } else {
            console.log(`No listings found with the id '${idDocument}'`);
        }
        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.FindCollection = async (collection) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection(collection).find();

        if (result) {
            console.log(`Found a listing in the collection`);
            console.log(result);
        } else {
            console.log(`No listings found with the id '${idDocument}'`);
        }
        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// exports.FindListingsByLanguageOrType = async (collection, {
//     language = "",
//     type = "",
//     maximumNumberOfResults = Number.MAX_SAFE_INTEGER
// } = {}) => {
//     const cursor = client.db("dbCloudVision").collection(collection).find(
//         {
//             language: { $gte: language },
//             type: { $gte: type }
//         }
//     ).sort({ last_review: -1 })
//         .limit(maximumNumberOfResults);

//     const results = await cursor.toArray();
//     if (results.length > 0) {
//         console.log(`Found listing(s) in ${language} and ${type} type:`);
//         return JSON.stringify(results);
//         // results.forEach((result, i) => {
//         //     date = new Date(result.dateScanned).toDateString();

//         //     console.log();
//         //     console.log(`${i + 1}. name: ${result.language}`);
//         //     console.log(`   _id: ${result._id}`);
//         //     console.log(`   bedrooms: ${result.text}`);
//         //     console.log(`   bathrooms: ${result.type}`);
//         //     console.log(`   most recent review date: ${new Date(result.dateScanned).toDateString()}`);
//         // });
//     } else {
//         console.log(`No listings found in ${language} language and ${type} type`);
//         JSON.stringify(results);
//     }
// }

exports.UpdateCollectionByID = async (collection, idCollection, updatedCollection) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection(collection)
            .updateOne({ _id: idCollection }, { $set: updatedCollection });

        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.DeleteListingByID = async (collection, idDocument) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const result = await client.db("dbCloudVision").collection(collection)
            .deleteOne({ _id: idDocument });
        console.log(`${result.deletedCount} document(s) was/were deleted.`);

        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// exports.DeleteListingsScrapedBeforeDate = async (collection, date = new Date()) => {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         const result = await client.db("dbCloudVision").collection(collection)
//             .deleteMany({ "dateScanned": { $lt: date } });
//         console.log(`${result.deletedCount} document(s) was/were deleted.`);

//         return JSON.stringify(result);
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }