# Public package and preview delivery

This repository publishes only `@zooclaw/zooworkdesign` and `@zooclaw/zooworkdesign-chat` to npmjs.org with `access: public`. It never changes the visibility or contents of the separate legacy private packages.

## Maintainer setup

1. Enable GitHub Pages for this repository, with **GitHub Actions** as the build source and the `github-pages` environment.
2. Configure a least-privilege `NPM_TOKEN` through GitHub Secrets with write access to these two new package names. Account/organization policy must permit automated publishing. Do not copy local session credentials into CI or messages.
3. The workflow has Pages/OIDC deployment permissions and uses official `upload-pages-artifact` / `deploy-pages` actions. No separate preview repository token is required. See [GitHub's workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Verification and delivery

The Verify workflow builds, checks types and lint, runs tests, checks notices, packages actual tgz files and installs them in an independent Vite/Next.js project. It uploads the package pair and a static preview from the same commit.

The delivery workflow runs trusted default-branch scripts. Forks, failed runs, closed PRs and superseded commits are ineligible. Downloaded PR artifacts are treated as data, not executed with publishing credentials.

1. Validate the source, package names, public access configuration, exact versions, integrity and archive boundaries.
2. Publish both packages to a staging tag. Verify the registry contents **without authentication**.
3. Deploy the verified static artifact to GitHub Pages and read its live version metadata.
4. Only after the two package identities, versions and verified source match, promote channels and report success.

Stable foundations use `latest`; Chat remains Alpha on `next`; same-repository PRs use `preview` / `pr-N`. The base version plus the Verify workflow sequence determines the published version. Do not reset the workflow counter. Public preview: https://serendipityoneinc.github.io/ZooWorkDesign/.

## Recovery

Use the existing `publish-npm.yml` workflow dispatch with a successful current Verify run ID. `dry_run=true` only validates artifacts; it does not verify publishing credentials. An execution reuses the same artifacts and skips a published version only if integrity is identical. Never overwrite a version with different contents.

Registry tag reads have bounded retries. Permission errors and persistent mismatches still fail. npm and Pages are separate services: a failed deployment may leave staged npm versions, and a retry completes the remaining steps. It does not claim rollback of published packages.

Check `Delivery / npm + preview`, the run summary and live `preview-version.json`. After the first public release, separately verify an anonymous consumer install; source-only tests are insufficient.
