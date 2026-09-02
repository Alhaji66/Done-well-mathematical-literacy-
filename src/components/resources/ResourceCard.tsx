import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Modal } from "../ui/Modal";
import { resourceTypeLabels } from "../../data/resources";
import { formatDate } from "../../lib/format";
import type { Resource } from "../../types";

const typeTone = {
  "learner-book": "navy",
  workbook: "gold",
  "teacher-guide": "navy",
  test: "red",
  memo: "green",
} as const;

export function ResourceCard({ resource }: { resource: Resource }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="flex h-full flex-col">
        <Badge tone={typeTone[resource.type]}>{resourceTypeLabels[resource.type]}</Badge>
        <p className="mt-3 font-display font-semibold text-navy-900">{resource.title}</p>
        <p className="mt-1.5 flex-1 text-sm text-navy-500">{resource.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-navy-400">
          <span>Grade {resource.gradeLevel}</span>
          <span>Updated {formatDate(resource.updatedAt)}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" fullWidth onClick={() => setOpen(true)}>
            Preview
          </Button>
          <Button size="sm" fullWidth onClick={() => setOpen(true)}>
            Download
          </Button>
        </div>
      </Card>

      {open ? (
        <Modal title={resource.title} onClose={() => setOpen(false)} wide>
          <div className="space-y-3">
            <Badge tone={typeTone[resource.type]}>{resourceTypeLabels[resource.type]}</Badge>
            <p className="text-sm text-navy-600">{resource.description}</p>
            <div className="rounded-xl border border-dashed border-navy-200 bg-navy-50/60 p-8 text-center text-sm text-navy-400">
              Document preview placeholder — in the full platform this opens the actual{" "}
              {resourceTypeLabels[resource.type].toLowerCase()} ({(resource.fileSizeKb / 1024).toFixed(1)} MB).
            </div>
            <p className="text-xs text-navy-400">
              Grade {resource.gradeLevel} · Last updated {formatDate(resource.updatedAt)}
            </p>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
