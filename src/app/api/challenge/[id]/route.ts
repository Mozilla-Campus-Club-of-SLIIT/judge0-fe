import { proxyJson } from '../../proxy';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return proxyJson(`/api/challenge/${params.id}`);
}
