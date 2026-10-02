/** What kind of test a teacher set: the weekly test, a topic test, or a monthly check. */
export type TestKind = 'weekly' | 'topic' | 'monthly'

export const TEST_KIND_LABEL: Record<TestKind, string> = { weekly: 'Weekly test', topic: 'Topic test', monthly: 'Monthly check' }
