const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: "us-east-2" }); // Change region if needed
const BUCKET_NAME = "lt-cli-photo-cache";
const API_URL = "https://showcase.leantechniques.com/photos"; // Base API URL

exports.handler = async (event) => {
  const fetch = (await import("node-fetch")).default;
  const photoId = event.queryStringParameters?.photoId;
  if (!photoId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing photoId" }) };
  }

  const key = `photo-${photoId}.json`; // Unique S3 key for this photo

  try {
    // Check if photo data exists in S3
    const cachedPhoto = await s3.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    if (cachedPhoto.Body) {
      console.log(`Cache hit for photo ${photoId}`);
      const body = await streamToString(cachedPhoto.Body);
      return { statusCode: 200, body };
    }
  } catch (err) {
    console.log(`Cache miss for photo ${photoId}, fetching from API...`);
  }

  try {
    // Fetch from API
    const response = await fetch(`${API_URL}/${photoId}`, { headers: { 'lt_api_key': 'lt_tech_showcase' }});
    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: "Photo not found" }) };
    }
    const photoData = await response.json();

    // Store in S3
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(photoData),
      ContentType: "application/json",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(photoData),
    };
  } catch (error) {
    console.error("Error fetching photo:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};

// Helper function to convert stream to string
const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk) => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });
};
