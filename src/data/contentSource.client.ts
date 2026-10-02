import type { SubjectContent } from '@/data/contentSource'
import { subjectPack } from '@/lib/contentPacks'

/**
 * The browser's '@/data/contentSource' (see vite.config.ts and contentSource.ts):
 * a subject's content comes from its downloaded content pack, or the bundled
 * sample, never from the source modules.
 */
export type { SubjectContent } from '@/data/contentSource'

export async function subjectContent(subjectId: string): Promise<SubjectContent> {
  const pack = await subjectPack(subjectId)
  return pack as SubjectContent
}
