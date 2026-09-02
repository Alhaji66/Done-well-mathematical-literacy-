import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { demoUsers, roleLabels } from "../../data/users";
import { IconArrowRight, IconLearner, IconParent, IconSchool, IconTeacher } from "../../lib/icons";
import type { RoleId } from "../../types";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const roleHomes: Record<RoleId, string> = {
  learner: "/learner",
  parent: "/parent",
  teacher: "/teacher",
  school: "/school",
};

const roleCards: { role: RoleId; icon: typeof IconLearner; blurb: string }[] = [
  { role: "learner", icon: IconLearner, blurb: "Practise, track progress and prep for tests." },
  { role: "parent", icon: IconParent, blurb: "See how your child is doing and how to help." },
  { role: "teacher", icon: IconTeacher, blurb: "Resources, question bank and class analytics." },
  { role: "school", icon: IconSchool, blurb: "School-wide progress and intervention priorities." },
];

export function SignIn() {
  const { signInAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const intendedRole = (location.state as { intendedRole?: RoleId } | null)?.intendedRole;

  function handleSelect(role: RoleId) {
    signInAs(role);
    navigate(roleHomes[role]);
  }

  return (
    <div className="bg-navy-950">
      <div className="container-page flex min-h-dvh flex-col items-center justify-center py-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">Demo access</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Explore DONE WELL®</h1>
          <p className="mx-auto mt-3 max-w-lg text-navy-300">
            No account needed. Choose a role to explore a fully working demo dashboard with realistic sample
            data.
            {intendedRole ? (
              <span className="mt-1 block text-gold-300">
                Continue as {roleLabels[intendedRole]} to see that page.
              </span>
            ) : null}
          </p>
        </div>

        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
          {roleCards.map(({ role, icon: Icon, blurb }) => (
            <button
              key={role}
              onClick={() => handleSelect(role)}
              className="focus-ring group text-left"
            >
              <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-2 group-hover:ring-gold-400">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                    <Icon className="h-6 w-6" />
                  </span>
                  <IconArrowRight className="h-5 w-5 text-navy-300 transition-transform group-hover:translate-x-1 group-hover:text-gold-500" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-navy-900">{roleLabels[role]}</p>
                <p className="mt-1 text-sm text-navy-500">{blurb}</p>
                <p className="mt-3 text-xs text-navy-400">
                  Demo user: {demoUsers[role].name}
                </p>
              </Card>
            </button>
          ))}
        </div>

        <Button as="link" to="/" variant="ghost" className="mt-8 text-navy-300 hover:bg-white/5 hover:text-white">
          ← Back to homepage
        </Button>
      </div>
    </div>
  );
}
