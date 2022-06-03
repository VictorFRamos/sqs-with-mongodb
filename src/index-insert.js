import { MongoClient } from "mongodb";

export async function handler(event, context) {
  const client = new MongoClient(process.env.mongoUri, {
    tlsCAFile: `rds-combined-ca-bundle.pem`
  });

  try {
    if (event.Records.length > 0) {
      await client.connect();

      const db = client.db("database");
      const pageviews = db.collection("tabela1");

      const { body } = event.Records[0];
      const json = JSON.parse(body);
      await pageviews.insertOne(json);
      await client.close();
    }
  }
  catch (e) {
    console.error(e);
  }
  return context.logStreamName;
}
