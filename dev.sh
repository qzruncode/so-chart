#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
STATE_DIR="${SO_CHART_DEV_STATE_DIR:-$ROOT_DIR/.dev}"
PID_FILE="$STATE_DIR/server.pid"
LOG_FILE="$STATE_DIR/server.log"
DEV_HOST="${SO_CHART_DEV_HOST:-127.0.0.1}"
DEV_PORT="${SO_CHART_DEV_PORT:-5173}"
VITE_BIN="$ROOT_DIR/node_modules/.bin/vite"

load_node() {
  local nvm_dir_path="${NVM_DIR:-${HOME}/.nvm}"
  if [[ -s "$nvm_dir_path/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "$nvm_dir_path/nvm.sh"
    nvm use 22.19.0 >/dev/null
  fi
}

read_pid() {
  local pid
  [[ -f "$PID_FILE" ]] || return 1
  read -r pid < "$PID_FILE"
  [[ "$pid" =~ ^[0-9]+$ ]] || return 1
  printf '%s\n' "$pid"
}

process_command() {
  ps -p "$1" -o command= 2>/dev/null || true
}

server_url() {
  sed -nE 's/.*Local:[[:space:]]+(https?:\/\/[^[:space:]]+).*/\1/p' "$LOG_FILE" 2>/dev/null | tail -n 1
}

print_server_url() {
  local url
  url="$(server_url)"
  echo "URL: ${url:-http://$DEV_HOST:$DEV_PORT}"
}

is_managed_process() {
  local pid="$1"
  local command
  kill -0 "$pid" 2>/dev/null || return 1
  command="$(process_command "$pid")"
  [[ "$command" == *"vite"* && "$command" == *"vite.dev.ts"* ]]
}

clear_stale_pid() {
  rm -f "$PID_FILE"
}

wait_for_exit() {
  local pid="$1"
  local attempt
  for attempt in {1..50}; do
    kill -0 "$pid" 2>/dev/null || return 0
    sleep 0.1
  done
  return 1
}

stop_server() {
  local pid
  pid="$(read_pid 2>/dev/null || true)"

  if [[ -z "$pid" ]]; then
    clear_stale_pid
    echo 'so-chart dev server is not running.'
    return 0
  fi

  if ! is_managed_process "$pid"; then
    clear_stale_pid
    echo "Removed stale PID file: $PID_FILE"
    return 0
  fi

  kill -TERM "$pid"
  if ! wait_for_exit "$pid"; then
    if is_managed_process "$pid"; then
      kill -KILL "$pid"
    fi
  fi

  clear_stale_pid
  echo "so-chart dev server stopped (pid $pid)."
}

start_server() {
  local existing_pid
  existing_pid="$(read_pid 2>/dev/null || true)"

  if [[ -n "$existing_pid" ]] && is_managed_process "$existing_pid"; then
    echo "so-chart dev server is already running (pid $existing_pid)."
    print_server_url
    return 0
  fi

  if [[ -n "$existing_pid" ]]; then
    clear_stale_pid
  fi

  if [[ ! -x "$VITE_BIN" ]]; then
    echo 'Dependencies are not installed. Run: pnpm install --frozen-lockfile' >&2
    return 1
  fi

  mkdir -p "$STATE_DIR"
  : > "$LOG_FILE"

  load_node
  (
    cd "$ROOT_DIR"
    exec nohup "$VITE_BIN" -c vite.dev.ts --host "$DEV_HOST" --port "$DEV_PORT"
  ) >> "$LOG_FILE" 2>&1 < /dev/null &
  local pid=$!
  printf '%s\n' "$pid" > "$PID_FILE"

  local attempt
  for attempt in {1..50}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      echo 'Failed to start so-chart dev server. Recent log:' >&2
      tail -n 30 "$LOG_FILE" >&2 || true
      clear_stale_pid
      return 1
    fi
    if grep -Eq 'Local:|ready in' "$LOG_FILE" 2>/dev/null; then
      echo "so-chart dev server started (pid $pid)."
      print_server_url
      echo "Log: $LOG_FILE"
      return 0
    fi
    sleep 0.1
  done

  echo "so-chart dev server started (pid $pid)."
  print_server_url
  echo "Log: $LOG_FILE"
}

usage() {
  echo "Usage: $0 {start|restart|stop}" >&2
}

main() {
  load_node
  case "${1:-}" in
    start)
      start_server
      ;;
    restart)
      stop_server
      start_server
      ;;
    stop)
      stop_server
      ;;
    *)
      usage
      return 1
      ;;
  esac
}

main "$@"
