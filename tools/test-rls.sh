#!/usr/bin/env bash
# Run the access-control tests in supabase/tests/access.sql against a fresh,
# throwaway local Postgres. Never touches the live Supabase project.
#
# Needs the PostgreSQL server binaries (initdb, pg_ctl) on this machine.
set -euo pipefail
cd "$(dirname "$0")/.."

PGBIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
if [ -z "$PGBIN" ] || [ ! -x "$PGBIN/initdb" ]; then
  echo "PostgreSQL server binaries not found. Set PGBIN to the directory holding initdb." >&2
  exit 2
fi

DIR="$(mktemp -d)"
PORT="${RLS_TEST_PORT:-55439}"
# initdb refuses to run as root, so drop to the postgres user when we are root.
run() { if [ "$(id -u)" = 0 ]; then su postgres -c "$*"; else sh -c "$*"; fi; }
[ "$(id -u)" = 0 ] && chown postgres "$DIR"

cleanup() { run "$PGBIN/pg_ctl -D $DIR/data -m immediate stop" >/dev/null 2>&1 || true; rm -rf "$DIR"; }
trap cleanup EXIT

run "$PGBIN/initdb -D $DIR/data -A trust -U postgres" >/dev/null
run "$PGBIN/pg_ctl -D $DIR/data -o '-p $PORT -k $DIR' -l $DIR/log -w start" >/dev/null

PSQL=(psql -h "$DIR" -p "$PORT" -U postgres -q -v ON_ERROR_STOP=1)
"${PSQL[@]}" -f supabase/tests/supabase-stub.sql >/dev/null
"${PSQL[@]}" -f supabase/schema.sql >/dev/null 2>&1
# Capture the output whatever happens: a test file that stops on an error --
# a function missing from the schema, say -- must still say where it stopped.
set +e
OUT="$(cd supabase/tests && "${PSQL[@]}" -f access.sql 2>&1)"
STATUS=$?
set -e
echo "$OUT" | grep -v NOTICE
if [ $STATUS -ne 0 ]; then
  echo "access.sql stopped with an error before finishing (exit $STATUS)." >&2
  exit 1
fi
echo "$OUT" | grep -q "ALL PASSED"
