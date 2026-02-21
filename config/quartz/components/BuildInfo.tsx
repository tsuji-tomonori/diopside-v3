import { QuartzComponentConstructor } from "./types"

function readBuildBranch(): string {
  return process.env.DIOPSIDE_DOCS_BRANCH ?? process.env.GITHUB_REF_NAME ?? "unknown"
}

function readBuildCommit(): string {
  const commit = process.env.DIOPSIDE_DOCS_COMMIT ?? process.env.GITHUB_SHA ?? "unknown"
  return commit === "unknown" ? commit : commit.slice(0, 12)
}

export default (() => {
  const BuildInfo = () => {
    const branch = readBuildBranch()
    const commit = readBuildCommit()

    return <p class="build-info">Branch: {branch} | Commit: {commit}</p>
  }

  BuildInfo.css = `
.build-info {
  margin: 0;
  color: var(--darkgray);
  font-size: 0.8rem;
  line-height: 1.4;
}
`

  return BuildInfo
}) satisfies QuartzComponentConstructor
