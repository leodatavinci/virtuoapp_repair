import express from 'express';
import axios from 'axios';
import shopify from "../shopify.js";
import { MongoClient } from 'mongodb';

const connectDB = async () => {
  const client = new MongoClient("mongodb+srv://leodatavinci:CaQojoG4F4tOQADc@cluster0.4suv9uc.mongodb.net");
  await client.connect();
  return client.db('VirtuoDB').collection('merchants');
}

export default function AdminAppApiEndpoints(app) {

  app.get("/api/getconfig", async (req, res) => {
    console.log("getting config");
    const session = res.locals.shopify.session;
    const collection = await connectDB();
    const doc = await collection.findOne({ shop: session.shop });
    res.send(doc.config);
  });

  app.post("/api/setconfig", async (req, res) => {
    console.log("setting config");
    const session = res.locals.shopify.session;
    console.log(session);
    const collection = await connectDB();
    const config = req.body;
    const documents = await collection.find({ shop: session.shop }).toArray();
    //await collection.updateOne({ shop: session.shop }, { $set: { config } });
    res.send({ message: "Configuration saved successfully!" });
  });

  app.get("/api/getdocuments", async (req, res) => {
    console.log("getting documents");
    const session = res.locals.shopify.session;
    console.log(session);
    const collection = await connectDB();
    const documents = await collection.find({ shop: session.shop }).toArray();
    res.send(documents);
  });

  app.post("/api/savedocument", async (req, res) => {
    console.log("save document");
    const session = res.locals.shopify.session;
    console.log(session);
    //const collection = await connectDB();
    //const document = req.body;
    //await collection.insertOne({ ...document, shop: session.shop });
    //res.send({ message: "Document saved successfully!" });
  });
}
