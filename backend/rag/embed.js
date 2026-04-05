export async function getEmbedding(text) {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: text,
    }),
  });

  const data = await res.json();

  if (!data.data || !data.data[0]) {
    console.error("Embedding failed:", data);
    throw new Error("Embedding API failed");
  }

  return data.data[0].embedding;
}
