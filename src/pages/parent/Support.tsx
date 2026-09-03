import { homeActions, parentGuidanceIntro } from '@/data/parent'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { HeartHandshakeIcon, MessageIcon } from '@/components/ui/Icons'

export function ParentSupport() {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Support" title="How can I help?" description={parentGuidanceIntro} />

      <div className="space-y-4">
        {homeActions.map((action) => {
          const topic = getTopic(action.topicId)
          return (
            <div key={action.id} className="card flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                <HeartHandshakeIcon className="h-5 w-5" />
              </span>
              <div>
                {topic ? <span className="badge-navy">{topic.name}</span> : null}
                <h3 className="mt-1.5 font-semibold text-navy-900">{action.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{action.detail}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card flex flex-col items-start gap-3 border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <MessageIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold text-navy-900">Need to talk to someone?</h3>
            <p className="mt-1 text-sm text-navy-600">Chat to us on WhatsApp: +27 71 771 3275.</p>
          </div>
        </div>
        <a
          href="https://wa.me/27717713275"
          target="_blank"
          rel="noreferrer"
          className="btn-outline btn-sm shrink-0"
        >
          Message on WhatsApp
        </a>
      </div>
    </div>
  )
}
