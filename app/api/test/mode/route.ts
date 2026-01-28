export async function GET() {
  return new Response('Not available in production', { status: 404 });
}