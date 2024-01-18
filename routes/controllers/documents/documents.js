require("dotenv").config();
const { stringify } = require("querystring");
const dbConnection = require("../../../services/dbConnection");

exports.GetAllDocuments = async () => {
    return await dbConnection.FindListing("documents");
}

exports.GetDocumentsByID = async ({ id = 0 }) => {
    return await dbConnection.FindOneListingID("documents", id);
}

exports.UpdateDocumentsByID = async (collection) => {
    return await dbConnection.UpdateCollectionByID("documents", collection.id, collection);
}

exports.DeleteDocumentsByID = async ({ id = 0 }) => {
    return await dbConnection.DeleteListingByID("documents", id);
}