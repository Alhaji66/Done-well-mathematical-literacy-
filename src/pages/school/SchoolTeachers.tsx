import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { schoolTeachers } from "../../data/school";

export function SchoolTeachers() {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Teachers" title="Teaching staff" description="Classes, learners and average scores per teacher." />

      <Card padded={false} className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
            <tr>
              <th className="px-5 py-3 font-medium sm:px-6">Teacher</th>
              <th className="px-5 py-3 font-medium sm:px-6">Subject</th>
              <th className="px-5 py-3 font-medium sm:px-6">Classes</th>
              <th className="px-5 py-3 font-medium sm:px-6">Learners</th>
              <th className="px-5 py-3 font-medium sm:px-6">Avg. score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {schoolTeachers.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-3.5 font-medium text-navy-900 sm:px-6">{t.name}</td>
                <td className="px-5 py-3.5 text-navy-600 sm:px-6">{t.subjects}</td>
                <td className="px-5 py-3.5 text-navy-600 sm:px-6">{t.classes}</td>
                <td className="px-5 py-3.5 text-navy-600 sm:px-6">{t.learners}</td>
                <td className="px-5 py-3.5 sm:px-6">
                  <span className={t.averageScorePercent >= 60 ? "font-semibold text-emerald-600" : "font-semibold text-gold-600"}>
                    {t.averageScorePercent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
