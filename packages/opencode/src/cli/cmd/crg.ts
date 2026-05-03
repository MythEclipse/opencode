import { effectCmd, fail } from "../effect-cmd"
import { Effect } from "effect"
import { Process } from "@/util/process"

interface CodeReviewGraphArgs {
  args?: string[]
}

export const CodeReviewGraphCommand = effectCmd({
  command: "code-review-graph [args..]",
  aliases: ["crg"],
  describe: "Run the code-review-graph AI agent CLI",
  builder: (yargs) =>
    yargs.positional("args", {
      describe: "Arguments passed through to code-review-graph",
      type: "string",
      array: true,
      default: [],
    }),
  instance: false,
  handler: Effect.fn("Cli.codeReviewGraph")(function* (args) {
    const command = ["uvx", "code-review-graph", ...(args.args ?? [])]
    const code = yield* Effect.promise(() =>
      Process.spawn(command, {
        cwd: process.cwd(),
        env: process.env,
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
      }).exited,
    )

    if (code !== 0) {
      return yield* fail(`code-review-graph exited with code ${code}`)
    }
  }),
})
